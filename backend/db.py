import os
import json
import uuid
import datetime
from pathlib import Path

# Local fallback directory
DATA_DIR = Path(__file__).parent / "data"
FALLBACK_FILE = DATA_DIR / "saved_crafts.json"

mongo_client = None
mongo_db = None
is_mongo_active = False

def init_db(uri=None, db_name="craft_generator"):
    global mongo_client, mongo_db, is_mongo_active
    uri = uri or os.getenv("MONGODB_URI", "mongodb://localhost:27017/craft_generator")
    db_name = os.getenv("MONGODB_DB_NAME", db_name)

    try:
        from pymongo import MongoClient
        from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure

        # Short timeout so app doesn't hang if MongoDB isn't running locally
        client = MongoClient(uri, serverSelectionTimeoutMS=1500)
        # Test connection
        client.admin.command('ping')
        mongo_client = client
        mongo_db = client[db_name]
        is_mongo_active = True
        print(f"[Database] Successfully connected to MongoDB: {db_name}")
    except Exception as e:
        is_mongo_active = False
        print(f"[Database] MongoDB not available ({str(e)}). Using reliable JSON file storage fallback.")
        _ensure_local_storage()

def _ensure_local_storage():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not FALLBACK_FILE.exists():
        with open(FALLBACK_FILE, "w", encoding="utf-8") as f:
            json.dump([], f)

def _read_local_crafts():
    _ensure_local_storage()
    try:
        with open(FALLBACK_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def _write_local_crafts(crafts):
    _ensure_local_storage()
    with open(FALLBACK_FILE, "w", encoding="utf-8") as f:
        json.dump(crafts, f, indent=2, ensure_ascii=False)

def get_db_mode():
    return "mongodb" if is_mongo_active else "json_fallback"

def get_db_status():
    return {
        "is_connected": True,
        "engine": "MongoDB" if is_mongo_active else "Local JSON Store (Zero-Config)",
        "mode": get_db_mode(),
        "fallback_mode": not is_mongo_active
    }

def get_all_crafts():
    global is_mongo_active, mongo_db
    if is_mongo_active and mongo_db is not None:
        try:
            docs = list(mongo_db.crafts.find().sort("savedAt", -1))
            for doc in docs:
                if "_id" in doc:
                    doc["id"] = str(doc.get("id") or doc["_id"])
                    del doc["_id"]
            return docs
        except Exception as e:
            print(f"[Database Error] MongoDB read failed: {e}. Falling back to local storage.")
            is_mongo_active = False
            return _read_local_crafts()
    else:
        crafts = _read_local_crafts()
        crafts.sort(key=lambda x: x.get("savedAt", ""), reverse=True)
        return crafts

def save_craft(craft_data):
    global is_mongo_active, mongo_db
    
    # Ensure standard craft structure
    craft = dict(craft_data)
    if not craft.get("id"):
        craft["id"] = str(uuid.uuid4())
    
    if "savedAt" not in craft:
        craft["savedAt"] = datetime.datetime.now(datetime.timezone.utc).isoformat()

    if is_mongo_active and mongo_db is not None:
        try:
            # Check if craft already exists
            existing = mongo_db.crafts.find_one({"id": craft["id"]})
            if existing:
                mongo_db.crafts.update_one({"id": craft["id"]}, {"$set": craft})
            else:
                mongo_db.crafts.insert_one(craft.copy())
            
            # Clean up _id for return
            if "_id" in craft:
                del craft["_id"]
            return craft
        except Exception as e:
            print(f"[Database Error] MongoDB save failed: {e}. Falling back to local file.")
            is_mongo_active = False

    # Local fallback
    crafts = _read_local_crafts()
    existing_index = next((i for i, c in enumerate(crafts) if c.get("id") == craft["id"]), -1)
    if existing_index >= 0:
        crafts[existing_index] = craft
    else:
        crafts.insert(0, craft)
    _write_local_crafts(crafts)
    return craft

def delete_craft(craft_id):
    global is_mongo_active, mongo_db
    craft_id = str(craft_id)

    if is_mongo_active and mongo_db is not None:
        try:
            result = mongo_db.crafts.delete_one({"id": craft_id})
            if result.deleted_count > 0:
                return True
        except Exception as e:
            print(f"[Database Error] MongoDB delete failed: {e}.")
            is_mongo_active = False

    # Local fallback
    crafts = _read_local_crafts()
    initial_len = len(crafts)
    crafts = [c for c in crafts if str(c.get("id")) != craft_id]
    if len(crafts) < initial_len:
        _write_local_crafts(crafts)
        return True
    return False
