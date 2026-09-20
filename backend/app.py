import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables strictly from backend/.env
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

# Import internal modules
from db import init_db, get_all_crafts, save_craft, delete_craft, get_db_mode
from ai_service import generate_craft_ideas

app = Flask(__name__)
# Enable CORS for frontend Vite dev server and standard ports
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize database
init_db()

@app.route("/api/health", methods=["GET"])
def health_check():
    """
    Sanitized health check endpoint providing service, database, and Gemini status.
    Never exposes API keys, key prefixes, credentials, or internal secrets.
    """
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    return jsonify({
        "status": "healthy",
        "database": get_db_mode(),
        "gemini_configured": bool(gemini_key)
    })

@app.route("/api/generate", methods=["POST"])
def generate_ideas():
    """
    Generate DIY craft ideas based on materials, category, difficulty, and occasion.
    Expected JSON:
    {
      "materials": ["cardboard", "paper"],
      "category": "Home Decor",
      "difficulty": "Easy",
      "occasion": "General",
      "count": 3
    }
    """
    try:
        data = request.get_json(force=True, silent=True) or {}
        
        materials = data.get("materials", [])
        if isinstance(materials, str):
            materials = [m.strip() for m in materials.split(",") if m.strip()]
            
        if not materials or len(materials) == 0:
            return jsonify({
                "success": False,
                "error": "Please provide at least one material (e.g. cardboard, plastic bottle, wool)."
            }), 400

        category = data.get("category")
        difficulty = data.get("difficulty")
        occasion = data.get("occasion")
        count = data.get("count", 3)

        result = generate_craft_ideas(
            materials=materials,
            category=category,
            difficulty=difficulty,
            occasion=occasion,
            count=count
        )

        return jsonify({
            "success": True,
            **result
        })
    except Exception as e:
        print(f"[Error in /api/generate]: {e}")
        return jsonify({
            "success": False,
            "error": f"Failed to generate craft ideas: {str(e)}"
        }), 500

@app.route("/api/crafts", methods=["GET"])
def list_saved_crafts():
    """Retrieve all saved craft ideas."""
    try:
        crafts = get_all_crafts()
        return jsonify({
            "success": True,
            "crafts": crafts,
            "count": len(crafts)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Failed to load saved crafts: {str(e)}"
        }), 500

@app.route("/api/crafts/save", methods=["POST"])
def save_craft_endpoint():
    """Save a craft idea to the database."""
    try:
        data = request.get_json(force=True, silent=True) or {}
        if not data or not data.get("title"):
            return jsonify({
                "success": False,
                "error": "Invalid craft payload; title is required."
            }), 400

        saved = save_craft(data)
        return jsonify({
            "success": True,
            "message": "Craft saved to favorites!",
            "craft": saved
        }), 201
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Failed to save craft: {str(e)}"
        }), 500

@app.route("/api/crafts/<craft_id>", methods=["DELETE"])
def delete_craft_endpoint(craft_id):
    """Delete a saved craft idea by ID."""
    try:
        success = delete_craft(craft_id)
        if success:
            return jsonify({
                "success": True,
                "message": "Craft removed from saved collection."
            })
        else:
            return jsonify({
                "success": False,
                "error": "Craft not found or already removed."
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Failed to delete craft: {str(e)}"
        }), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"[Server] Craft Idea Generator Backend running at http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)

