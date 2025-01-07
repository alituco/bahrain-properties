import os
import logging
import joblib
import pandas as pd

from flask import Flask, request, jsonify

app = Flask(__name__)

logging.basicConfig(level=logging.INFO)

# -----------------------------------------------------------------------
# LOAD MODEL + TRAINING COLUMNS
# -----------------------------------------------------------------------
MODEL_PATH = "random_forest_model.pkl"
COLUMNS_PATH = "training_columns.pkl"

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Missing {MODEL_PATH}. Train and save your model first.")

if not os.path.exists(COLUMNS_PATH):
    raise FileNotFoundError(f"Missing {COLUMNS_PATH}. Train and save your model first.")

model = joblib.load(MODEL_PATH)
training_columns = joblib.load(COLUMNS_PATH)

logging.info("Model and training columns loaded successfully.")

# -----------------------------------------------------------------------
# PREPARE INFERENCE DATA
# -----------------------------------------------------------------------
def prepare_inference_data(data_dict):
    """
    Reconstruct a single-row DataFrame from the user's JSON input.
    Apply the same get_dummies to match training, then align columns
    so the order matches exactly what the model expects.
    """
    # Convert the user's JSON into a DataFrame with ONE row
    # data_dict might look like:
    # {
    #   "parcelNo": "12345",
    #   "shape_area": 999.99,
    #   "num_of_roads": 2,
    #   "longitude": 50.55,
    #   "latitude": 26.22,
    #   "ewa_edd": "X",
    #   "ewa_wdd": "Y",
    #   "roads": "main",
    #   "sewer": "connected",
    #   "nzp_code": "RESIDENTIAL"
    # }
    df = pd.DataFrame([data_dict])

    # We don't *necessarily* need parcelNo in the features if it's just an ID
    # If your model doesn't use parcelNo, drop it
    if "parcelNo" in df.columns:
        df.drop(columns=["parcelNo"], inplace=True)

    # Step 1: Dummy-encode the same categorical features with drop_first=True
    # NOTE: This must match EXACTLY the list used during training
    cat_features = ["ewa_edd", "ewa_wdd", "roads", "sewer", "nzp_code"]
    for cat in cat_features:
        if cat not in df.columns:
            # If not provided, fill with some default (or None) 
            df[cat] = None

    df = pd.get_dummies(df, columns=cat_features, drop_first=True)

    # Step 2: Align columns with the training schema
    # - Any missing columns in df: fill with 0
    # - Any extra columns not in training_columns: drop them
    final_df = df.reindex(columns=training_columns, fill_value=0)

    return final_df

# -----------------------------------------------------------------------
# FLASK ROUTE: /predict
# -----------------------------------------------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        request_data = request.json
        if not request_data:
            return jsonify({"success": False, "error": "No JSON body provided"}), 400

        # Convert the input into a single-row DataFrame
        X_inference = prepare_inference_data(request_data)
        
        # Make prediction
        prediction = model.predict(X_inference)

        # For demonstration, we’ll assume the model predicts a single numeric value
        return jsonify({
            "success": True,
            "prediction": float(prediction[0]),  # Convert numpy float to plain float
            "input_used": request_data  # Echo back the user-provided input
        })

    except Exception as e:
        logging.error(f"Error in prediction: {e}", exc_info=True)
        return jsonify({"success": False, "error": str(e)}), 500

# -----------------------------------------------------------------------
# RUN THE FLASK SERVICE
# -----------------------------------------------------------------------
if __name__ == "__main__":
    # e.g., run on port 5001
    app.run(host="0.0.0.0", port=5001, debug=True)
