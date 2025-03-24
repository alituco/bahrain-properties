import os
import logging
import joblib
import pandas as pd
from dotenv import load_dotenv  # <-- Import load_dotenv
from flask import Flask, request, jsonify

# Additional imports for property fetching functionality
import requests
import psycopg2
from psycopg2 import sql
from shapely.geometry import Polygon
import time

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

logging.basicConfig(level=logging.INFO)

# -----------------------------------------------------------------------
# MODEL & PREDICTION CODE (unchanged)
# -----------------------------------------------------------------------
MODEL_PATH = os.getenv("MODEL_PATH", "random_forest_model.pkl")
COLUMNS_PATH = os.getenv("COLUMNS_PATH", "training_columns.pkl")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Missing {MODEL_PATH}. Train and save your model first.")

if not os.path.exists(COLUMNS_PATH):
    raise FileNotFoundError(f"Missing {COLUMNS_PATH}. Train and save your model first.")

model = joblib.load(MODEL_PATH)
training_columns = joblib.load(COLUMNS_PATH)

logging.info("Model and training columns loaded successfully.")

def prepare_inference_data(data_dict):
    """
    Reconstruct a single-row DataFrame from the user's JSON input.
    Apply get_dummies and reindex to match training_columns.
    """
    df = pd.DataFrame([data_dict])
    if "parcelNo" in df.columns:
        df.drop(columns=["parcelNo"], inplace=True)

    cat_features = ["ewa_edd", "ewa_wdd", "roads", "sewer", "nzp_code", "block_no"]
    for cat in cat_features:
        if cat not in df.columns:
            df[cat] = None

    df = pd.get_dummies(df, columns=cat_features, drop_first=True)
    final_df = df.reindex(columns=training_columns, fill_value=0)
    return final_df

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
# PROPERTY FETCHING FUNCTIONALITY
# -----------------------------------------------------------------------

# Use your Postgres connection string (or load from env)
DB_URL = os.getenv("DB_URL", "postgres://ucgi9succp23ok:p8bbbaf1e63ac43446618486b5a847793d7627ea835197bd4a62a5c4bd30bd8e7@c67okggoj39697.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d6rv8n52s2l20f")

HEADERS = {
    "Host": "www.locatorservices.gov.bh",
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json",
    "Referer": "https://www.benayat.bh/"
}

def get_initial_url(parcel_number):
    base_url = "https://www.locatorservices.gov.bh/BPProxy/proxy.ashx?"
    query = (
        "https://www.locatorservices.gov.bh/arcgis/rest/services/BP/SLRB_CADASTRAL/MapServer/0/query"
        f"?f=json&outFields=*&spatialRel=esriSpatialRelIntersects&where=PARCELNO = '{parcel_number}'"
    )
    return f"{base_url}{query}"

def get_rings(parcel_number):
    start_time = time.time()
    try:
        response = requests.get(get_initial_url(parcel_number), headers=HEADERS, timeout=10).json()
        elapsed = time.time() - start_time
        logging.debug(f"get_rings: Fetched rings for parcel {parcel_number} in {elapsed:.2f} seconds.")
        if response.get("features"):
            return response["features"][0]["geometry"]
        logging.warning(f"get_rings: Parcel number {parcel_number} is invalid.")
        return None
    except Exception as e:
        logging.error(f"get_rings: Request failed for parcel {parcel_number}: {e}")
        return None

def rings_to_wkt(rings):
    polygon = Polygon(rings[0])
    return polygon.wkt

def first_fetch(parcel_number, rings):
    if not rings:
        return None
    start_time = time.time()
    base_url = "https://www.locatorservices.gov.bh/BPProxy/proxy.ashx?"
    query = (
        "https://www.locatorservices.gov.bh/arcgis/rest/services/BP_FENCE/SA_INDICATOR/MapServer/0/query"
        f"?f=json&geometry={{\"spatialReference\":{{\"latestWkid\":20439,\"wkid\":20439}},\"rings\":{rings['rings']}}}"
        "&outFields=PARCEL_NO,EWA_EDD,EWA_WDD,ROADS,SEWER,GATED_COM"
        "&returnGeometry=false&spatialRel=esriSpatialRelIntersects"
        "&geometryType=esriGeometryPolygon&inSR=20439"
    )
    try:
        response = requests.get(f"{base_url}{query}", headers=HEADERS, timeout=10).json()
        elapsed = time.time() - start_time
        logging.debug(f"first_fetch: Fetched first data for parcel {parcel_number} in {elapsed:.2f} seconds.")
        for feature in response.get('features', []):
            attrs = feature.get('attributes', {})
            if str(attrs.get('PARCEL_NO')) == str(parcel_number):
                return {
                    'parcel_no': attrs.get('PARCEL_NO'),
                    'ewa_edd': attrs.get('EWA_EDD'),
                    'ewa_wdd': attrs.get('EWA_WDD'),
                    'roads': attrs.get('ROADS'),
                    'sewer': attrs.get('SEWER'),
                    'gated_com': attrs.get('GATED_COM'),
                }
        logging.info(f"first_fetch: No matching features found for parcel {parcel_number}.")
        return None
    except Exception as e:
        logging.error(f"first_fetch: Request failed for parcel {parcel_number}: {e}")
        return None

def second_fetch(parcel_number, rings):
    if not rings:
        logging.warning(f"second_fetch: Parcel number {parcel_number} is invalid.")
        return None
    start_time = time.time()
    base_url = "https://www.locatorservices.gov.bh/BPProxy/proxy.ashx?"
    query = (
        "https://www.locatorservices.gov.bh/arcgis/rest/services/BP/AdminBoundary/MapServer/identify"
        "?f=json&tolerance=3&returnGeometry=false&returnFieldName=false&returnUnformattedValues=false"
        "&imageDisplay=2560,771,96"
        f"&geometry={{\"rings\":{rings['rings']}}}"
        "&geometryType=esriGeometryPolygon&sr=20439"
        "&mapExtent=447630.6899730252,2889529.9760651765,448172.55772342737,2889693.171391567"
        "&layers=all:0,1,2"
    )
    try:
        response = requests.get(f"{base_url}{query}", headers=HEADERS, timeout=10).json()
        elapsed = time.time() - start_time
        logging.debug(f"second_fetch: Fetched second data for parcel {parcel_number} in {elapsed:.2f} seconds.")
        data = {}
        for result in response.get('results', []):
            attrs = result.get("attributes", {})
            data.update({
                'block_no': attrs.get('BLOCK_NO'),
                'area_namea': attrs.get('AREA_NAMEA'),
                'area_namee': attrs.get('AREA_NAMEE'),
                'gov_nm_ar': attrs.get('GOV_NM_AR'),
                'min_min_go': attrs.get('MIN_MIN_GO'),
            })
        if data:
            logging.debug(f"second_fetch: Extracted data for parcel {parcel_number}: {data}")
        else:
            logging.info(f"second_fetch: No relevant data found for parcel {parcel_number}.")
        return data
    except Exception as e:
        logging.error(f"second_fetch: Request failed for parcel {parcel_number}: {e}")
        return None

def third_fetch(parcel_number, rings):
    if not rings:
        logging.warning(f"third_fetch: Parcel number {parcel_number} is invalid.")
        return None
    start_time = time.time()
    base_url = "https://www.locatorservices.gov.bh/BPProxy/proxy.ashx?"
    query = (
        "https://www.locatorservices.gov.bh/arcgis/rest/services/BP_FENCE/BP_ZONE_FENCE/MapServer/0/query"
        "?f=json"
        f"&geometry={{\"spatialReference\":{{\"latestWkid\":20439,\"wkid\":20439}},\"rings\":{rings['rings']}}}"
        "&outFields=*&spatialRel=esriSpatialRelIntersects"
        "&geometryType=esriGeometryPolygon&inSR=20439&outSR=20439"
    )
    try:
        response = requests.get(f"{base_url}{query}", headers=HEADERS, timeout=10).json()
        elapsed = time.time() - start_time
        logging.debug(f"third_fetch: Fetched third data for parcel {parcel_number} in {elapsed:.2f} seconds.")
        if response.get('features'):
            attrs = response['features'][0].get('attributes', {})
            data = {
                'objectid': attrs.get('OBJECTID'),
                'nzp_code': attrs.get('NZP_CODE'),
                'nzp_desc_e': attrs.get('NZP_DESC_E'),
                'nzp_desc_a': attrs.get('NZP_DESC_A'),
                'nzp_date': int(attrs['NZP_DATE']) if attrs.get('NZP_DATE') else None,
            }
            logging.debug(f"third_fetch: Extracted data for parcel {parcel_number}: {data}")
            return data
        logging.info(f"third_fetch: No features found for parcel number {parcel_number}.")
        return None
    except Exception as e:
        logging.error(f"third_fetch: Request failed for parcel {parcel_number}: {e}")
        return None

def fourth_fetch(parcel_number):
    start_time = time.time()
    base_url = "https://www.locatorservices.gov.bh/BPProxy/proxy.ashx?"
    query = (
        "https://www.locatorservices.gov.bh/arcgis/rest/services/BP/SLRB_CADASTRAL/MapServer/0/query"
        f"?f=json&outFields=*&spatialRel=esriSpatialRelIntersects&where=PARCELNO = '{parcel_number}'"
    )
    try:
        response = requests.get(f"{base_url}{query}", headers=HEADERS, timeout=10).json()
        elapsed = time.time() - start_time
        logging.debug(f"fourth_fetch: Fetched fourth data for parcel {parcel_number} in {elapsed:.2f} seconds.")
        if response.get('features'):
            attrs = response['features'][0].get('attributes', {})
            data = {
                'shape_area': attrs.get('SHAPE.AREA'),
                'shape_len': attrs.get('SHAPE.LEN')
            }
            logging.debug(f"fourth_fetch: Extracted data for parcel {parcel_number}: {data}")
            return data
        logging.info(f"fourth_fetch: No features found for parcel number {parcel_number}.")
        return None
    except Exception as e:
        logging.error(f"fourth_fetch: Request failed for parcel {parcel_number}: {e}")
        return None

def insert_into_database(data):
    start_time = time.time()
    try:
        with psycopg2.connect(DB_URL) as conn:
            with conn.cursor() as cursor:
                insert_query = sql.SQL("""
                    INSERT INTO properties (
                        parcel_no, ewa_edd, ewa_wdd, roads, sewer, gated_com,
                        block_no, area_namea, area_namee, gov_nm_ar, min_min_go,
                        objectid, nzp_code, nzp_desc_e, nzp_desc_a, nzp_date,
                        shape_area, shape_len, geometry
                    ) VALUES (
                        %(parcel_no)s, %(ewa_edd)s, %(ewa_wdd)s, %(roads)s,
                        %(sewer)s, %(gated_com)s, %(block_no)s, %(area_namea)s,
                        %(area_namee)s, %(gov_nm_ar)s, %(min_min_go)s,
                        %(objectid)s, %(nzp_code)s, %(nzp_desc_e)s,
                        %(nzp_desc_a)s, %(nzp_date)s, %(shape_area)s,
                        %(shape_len)s, ST_GeomFromText(%(geometry)s, 20439)
                    )
                """)
                cursor.execute(insert_query, data)

                update_status_query = """
                    INSERT INTO parcel_status (parcel_no, indatabase, doesntexist)
                    VALUES (%s, TRUE, FALSE)
                    ON CONFLICT (parcel_no) DO UPDATE 
                    SET indatabase = TRUE, doesntexist = FALSE;
                """
                cursor.execute(update_status_query, (data['parcel_no'],))
                conn.commit()
                elapsed = time.time() - start_time
                logging.debug(f"insert_into_database: Inserted data for parcel {data['parcel_no']} in {elapsed:.2f} seconds.")
    except Exception as e:
        logging.error(f"insert_into_database: Error inserting data for parcel {data.get('parcel_no')}: {e}")
        raise

def check_if_parcel_exists(parcel_number):
    start_time = time.time()
    try:
        with psycopg2.connect(DB_URL) as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT 1 FROM properties WHERE parcel_no = %s LIMIT 1;", (parcel_number,))
                exists = cursor.fetchone() is not None
                elapsed = time.time() - start_time
                logging.debug(f"check_if_parcel_exists: Checked existence for parcel {parcel_number} in {elapsed:.4f} seconds. Exists: {exists}")
                return exists
    except Exception as e:
        logging.error(f"check_if_parcel_exists: Error checking parcel {parcel_number}: {e}")
        return False

def mark_parcel_as_invalid(parcel_number):
    start_time = time.time()
    try:
        with psycopg2.connect(DB_URL) as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO parcel_status (parcel_no, indatabase, doesntexist)
                    VALUES (%s, FALSE, TRUE)
                    ON CONFLICT (parcel_no) DO UPDATE 
                    SET indatabase = FALSE, doesntexist = TRUE;
                """, (parcel_number,))
                conn.commit()
                elapsed = time.time() - start_time
                logging.debug(f"mark_parcel_as_invalid: Marked parcel {parcel_number} as invalid in {elapsed:.2f} seconds.")
    except Exception as e:
        logging.error(f"mark_parcel_as_invalid: Error marking parcel {parcel_number} as invalid: {e}")

def fetch_all_property_info(parcel_number):
    if check_if_parcel_exists(parcel_number):
        logging.info(f"fetch_all_property_info: Parcel {parcel_number} already exists. Skipping...")
        return

    rings = get_rings(parcel_number)
    if not rings:
        logging.info(f"fetch_all_property_info: Parcel {parcel_number} is invalid, marking as doesn't exist.")
        mark_parcel_as_invalid(parcel_number)
        return

    data = {}
    start_time = time.time()

    first_data = first_fetch(parcel_number, rings)
    if first_data:
        data.update(first_data)

    second_data = second_fetch(parcel_number, rings)
    if second_data:
        data.update(second_data)

    third_data = third_fetch(parcel_number, rings)
    if third_data:
        data.update(third_data)

    fourth_data = fourth_fetch(parcel_number)
    if fourth_data:
        data.update(fourth_data)

    geometry_wkt = rings_to_wkt(rings['rings'])
    data['geometry'] = geometry_wkt

    elapsed = time.time() - start_time
    logging.debug(f"fetch_all_property_info: Collected all data for parcel {parcel_number} in {elapsed:.2f} seconds.")

    if data:
        insert_into_database(data)

def ensure_parcel_in_db(parcel_number):
    """
    Checks if a parcel exists in the database. If not, attempts to fetch and insert it.
    Returns True if the parcel ends up in the DB, otherwise False.
    """
    if check_if_parcel_exists(parcel_number):
        logging.info(f"ensure_parcel_in_db: Parcel {parcel_number} is already in the database.")
        return True

    logging.info(f"ensure_parcel_in_db: Parcel {parcel_number} not found in DB. Fetching now...")
    fetch_all_property_info(parcel_number)

    if check_if_parcel_exists(parcel_number):
        logging.info(f"ensure_parcel_in_db: Parcel {parcel_number} successfully fetched and inserted.")
        return True
    else:
        logging.warning(f"ensure_parcel_in_db: Parcel {parcel_number} could not be fetched/inserted.")
        return False

@app.route('/fetchParcel', methods=["POST"])
def fetch_parcel_endpoint():
    data = request.json
    parcel_no = data.get("parcel_no")
    if not parcel_no:
        return jsonify({"success": False, "error": "Missing parcel_no"}), 400
    
    success = ensure_parcel_in_db(parcel_no)
    if success:
        return jsonify({"success": True, "message": f"Parcel {parcel_no} is now in the DB."})
    else:
        return jsonify({"success": False, "message": f"Parcel {parcel_no} could not be fetched."}), 404

# -----------------------------------------------------------------------
# RUN THE FLASK SERVICE
# -----------------------------------------------------------------------
if __name__ == "__main__":
    port = int(os.getenv("FLASK_PORT", 5000))
    debug_mode = os.getenv("FLASK_DEBUG", "True").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug_mode)
