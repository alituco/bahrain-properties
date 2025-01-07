import os
import logging
import joblib
import pandas as pd
from dotenv import load_dotenv  # <-- Import load_dotenv

from flask import Flask, request, jsonify

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

logging.basicConfig(level=logging.INFO)

# -----------------------------------------------------------------------
# LOAD MODEL + TRAINING COLUMNS
# -----------------------------------------------------------------------
# Use environment variables with fallbacks
MODEL_PATH = os.getenv("MODEL_PATH", "random_forest_model.pkl")
COLUMNS_PATH = os.getenv("COLUMNS_PATH", "training_columns.pkl")

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
    df = pd.DataFrame([data_dict])
    if "parcelNo" in df.columns:
        df.drop(columns=["parcelNo"], inplace=True)

    cat_features = ["ewa_edd", "ewa_wdd", "roads", "sewer", "nzp_code"]
    for cat in cat_features:
        if cat not in df.columns:
            df[cat] = None

    df = pd.get_dummies(df, columns=cat_features, drop_first=True)
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

        X_inference = prepare_inference_data(request_data)
        prediction = model.predict(X_inference)

        return jsonify({
            "success": True,
            "prediction": float(prediction[0]),
            "input_used": request_data
        })

    except Exception as e:
        logging.error(f"Error in prediction: {e}", exc_info=True)
        return jsonify({"success": False, "error": str(e)}), 500

# -----------------------------------------------------------------------
# RUN THE FLASK SERVICE
# -----------------------------------------------------------------------
if __name__ == "__main__":
    # Retrieve port and debug mode from environment variables
    port = int(os.getenv("FLASK_PORT", 5001))
    debug_mode = os.getenv("FLASK_DEBUG", "True").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug_mode)
