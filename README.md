# ✂️ Craft Idea Generator — AI-Powered DIY & Upcycling Assistant

An intelligent, modern full-stack web application that transforms everyday materials (cardboard, plastic bottles, soda tins, wool yarn, popsicle sticks, egg cartons, old clothes) into creative, step-by-step DIY craft ideas and upcycling tutorials powered by **Google Gemini AI** and an algorithmic fallback crafting engine.

Built with **React 19, TypeScript, Vite, Tailwind CSS, Python Flask, and MongoDB**.

---

## 🔐 Security Architecture

> [!IMPORTANT]
> **Server-Side Key Isolation**: The Google Gemini API key and MongoDB credentials are kept **strictly server-side** in `backend/.env`. The frontend client never touches, receives, or stores production API keys in browser `localStorage`, cookies, or state. All generative AI requests are routed securely through the Flask REST API.

```
┌───────────────────────────────┐
│     React 19 Frontend UI      │
│  (No API keys / Zero Secrets) │
└───────────────┬───────────────┘
                │  POST /api/generate
                ▼
┌───────────────────────────────┐
│      Flask REST API Backend   │
│   (Loads backend/.env via     │
│       python-dotenv)          │
└───────────────┬───────────────┘
                │  Google GenAI / REST (Server-Side)
                ▼
┌───────────────────────────────┐
│       Google Gemini API       │
│   (gemini-3.5-flash / models) │
└───────────────┬───────────────┘
                │  JSON Response
                ▼
┌───────────────────────────────┐
│      Flask Post-Processing    │
│  (Typo handling & Fallbacks)  │
└───────────────┬───────────────┘
                │  Sanitized Crafts Payload
                ▼
┌───────────────────────────────┐
│      React Interactive View   │
└───────────────────────────────┘
```

---

## 🌟 Key Features

### 1. 🎨 Modern Landing Experience
- **Craft Studio Aesthetics**: Vibrant color gradients, glassmorphism panels, and smooth micro-animations.
- **Dark & Light Mode**: Seamless theme toggling with automatic OS preference detection.
- **Quick Material Inspiration Pills**: One-click quick adds for popular scrap materials (*Cardboard, Plastic Bottles, Coke Tins, Glue Gun, Wool Yarn, Ice-cream Sticks, Denim*).

### 2. 🛠️ Interactive Craft Generator
- **Material Chip Input**: Type any household item, press `Enter` or `,` to add tag chips.
- **Multi-Factor Customization**:
  - **Category**: Home Decor, Gifts, Kids, Art, Recycling, Festival, Fashion, All.
  - **Difficulty**: Easy (10–25 mins), Medium (25–45 mins), Hard (45+ mins).
  - **Occasion**: Birthday, Festival, School Project, Decoration, General.
  - **Idea Count**: Select from 1 to 5 project ideas.
- **Loading Animation**: Animated scissors, glowing particles, and rotating DIY tips.

### 3. 🤖 Resilient Dual AI Engine Architecture
- **Google Gemini Generative AI**: Configurable via `backend/.env` (`gemini-3.5-flash` / `gemini-flash-latest`), generating realistic step-by-step instructions, time estimates, safety advice, and creative tips.
- **Smart Recipe Engine (Zero-Config Fallback)**: Built-in material-aware heuristic engine with randomized recipe shuffling and procedural craft synthesis, guaranteeing **100% uptime and instant testing even without an API key or internet connection**.

### 4. 📋 Rich Craft Cards & Interactive Tutorials
- **Structured Cards**: Distinct category pills, difficulty badges, estimated duration, and materials inventory.
- **Interactive Step Checklist**: Check off steps as you build with live progress bar tracking.
- **Safety Alerts**: Highlighted warning notes for utility shears, sharp can rims, and hot glue gun heat.
- **Print & Export**: Print-optimized recipe cards and one-click copy to clipboard.
- **"Generate Similar"**: Instantly spin off variations based on an existing craft.

### 5. ❤️ Saved Crafts Collection & Database Sync
- **Dual Database Persistence**: Stores favorites in **MongoDB** (`craft_generator` database) with automatic failover to local JSON file storage (`backend/data/saved_crafts.json`) and browser cache.
- **Real-Time Search & Filters**: Search saved crafts by title, material, category, or difficulty.
- **Export to JSON**: Download bookmarked projects anytime.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **Backend** | Python 3.11+, Flask, Flask-CORS, python-dotenv, Requests, PyMongo |
| **AI Integration** | Google Gemini API (`gemini-3.5-flash`, `gemini-flash-latest`), Server-Side Environment Config |
| **Database** | MongoDB (with automatic zero-config local JSON file storage fallback) |
| **Styling & FX** | Glassmorphism, CSS keyframe animations, Dark/Light theme |

---

## 📁 Repository Structure

```
Craft Idea Generator/
├── .gitignore                   # Ignores .env, node_modules, dist, local json db
├── README.md                    # Project documentation
├── backend/
│   ├── .env                     # Server environment variables (NEVER committed)
│   ├── .env.example             # Safe template with placeholders only
│   ├── app.py                   # Flask server, CORS, sanitized /api/health & routes
│   ├── ai_service.py            # Gemini integration + Smart Fallback recipe engine
│   ├── db.py                    # MongoDB driver with resilient JSON file fallback
│   ├── requirements.txt         # Backend Python dependencies
│   └── data/
│       └── saved_crafts.json    # Local JSON fallback store (ignored by git)
└── frontend/
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── vite.config.ts           # Vite config with API proxy to localhost:5000
    ├── tsconfig.json
    └── src/
        ├── App.tsx              # Main application orchestrator
        ├── index.css            # Tailwind styles & theme variables
        ├── main.tsx
        ├── components/
        │   ├── Navbar.tsx           # Header with dark mode, saved badge, telemetry
        │   ├── Hero.tsx             # Landing hero with quick material starter chips
        │   ├── MaterialInput.tsx    # Interactive chip/tag input with autocomplete
        │   ├── CraftFilters.tsx     # Categories, difficulty, occasion & count selectors
        │   ├── CraftCard.tsx        # Card with difficulty badges, materials & action buttons
        │   ├── CraftDetailModal.tsx # Interactive recipe checklist, print & copy modal
        │   ├── SavedCraftsModal.tsx # Saved collection drawer with search & filter
        │   ├── LoadingSkeleton.tsx  # Animated craft loader with rotating DIY quotes
        │   ├── SettingsModal.tsx    # System & Connection Status telemetry modal
        │   └── Toast.tsx            # Toast notification feedback
        ├── services/
        │   └── api.ts               # Clean, secure typed API client (no client keys)
        └── types/
            └── craft.ts             # TypeScript domain interfaces
```

---

## ⚙️ Environment Configuration

### Safe Environment Template: `backend/.env.example`

Create `backend/.env` from the template:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash
MONGODB_URI=mongodb://localhost:27017/craft_generator
```

### Environment Variable Details:

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Port for the Flask backend server | `5000` |
| `GEMINI_API_KEY` | Google Gemini API key from [Google AI Studio](https://aistudio.google.com/) | Server-side only secret |
| `GEMINI_MODEL` | Gemini model name | `gemini-3.5-flash` |
| `MONGODB_URI` | MongoDB connection URI | `mongodb://localhost:27017/craft_generator` |

> ⚠️ **IMPORTANT**: Never commit `backend/.env` to GitHub. The root `.gitignore` is configured to prevent `.env` and `*.env` files from being tracked, while allowing `.env.example`.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher) & **npm**
- **Python** (v3.10 or higher) & **pip**
- *(Optional)* **MongoDB** running locally on port 27017. If MongoDB is not running, the application automatically uses local JSON file storage with zero configuration.

---

### 1. Backend Setup

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up the environment file:
   ```bash
   cp .env.example .env
   ```
   Edit `backend/.env` and insert your Gemini API key (optional — if omitted, the app runs in Smart Engine mode).

4. Start the backend server:
   ```bash
   python app.py
   ```
   *The Flask REST API will start at `http://localhost:5000`.*

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   *The application will open at `http://localhost:5173/`.*

4. To build for production:
   ```bash
   npm run build
   ```

---

## 🔌 API Endpoints Reference

### 1. System Health & Telemetry
- **`GET /api/health`**
  - Sanitized health check endpoint returning system status without exposing any secrets or keys.
  - **Example Response**:
    ```json
    {
      "status": "healthy",
      "database": "json_fallback",
      "gemini_configured": true
    }
    ```

### 2. Generate Craft Ideas
- **`POST /api/generate`**
  - Generates structured DIY craft ideas tailored to the provided materials and preferences.
  - **Request Body**:
    ```json
    {
      "materials": ["cardboard", "plastic bottles"],
      "category": "Recycling",
      "difficulty": "Easy",
      "occasion": "General",
      "count": 3
    }
    ```
  - **Response**:
    ```json
    {
      "success": true,
      "engine": "Gemini AI",
      "count": 3,
      "crafts": [
        {
          "id": "craft-unique-id",
          "title": "Recycled Bottle-in-Board Desk Organizer",
          "tagline": "Turn cardboard and plastic bottles into a tiered desk caddy.",
          "category": "Recycling",
          "difficulty": "Easy",
          "estimatedTime": "20-30 minutes",
          "occasion": "General",
          "materialsRequired": ["Cardboard", "Plastic bottles", "Scissors", "Craft Glue"],
          "description": "An eco-friendly workspace caddy combining rigid cardboard slots with clear bottle cups.",
          "steps": [
            "1. Clean and dry the plastic bottles thoroughly.",
            "2. Cut the lower 8 cm of the plastic bottles...",
            "3. Cut cardboard divider slots and bond together...",
            "4. Insert the clear cups into the cardboard framework..."
          ],
          "tips": ["Use patterned washi tape around the plastic edges."],
          "safetyNotes": "Smooth down any cut plastic edges to prevent scratches."
        }
      ]
    }
    ```

### 3. Saved Crafts Management
- **`GET /api/crafts`**: Retrieve all saved crafts.
- **`POST /api/crafts/save`**: Save a craft to MongoDB / JSON storage.
- **`DELETE /api/crafts/<id>`**: Delete a saved craft by ID.

---

## 📸 Screenshots & UI Showcase

| System Status & Connection | Generated Craft Cards | Interactive Recipe Checklist |
| :---: | :---: | :---: |
| *Read-only telemetry indicator* | *Structured craft cards with badges* | *Checklist with live progress bar* |

---

## 🔮 Future Improvements

1. **Computer Vision Material Recognition**: Allow users to snap a photo of materials on their desk, automatically extracting supplies using Gemini 1.5 Pro / Flash Multimodal.
2. **Community Showcase**: Social feed where crafters can share photos of their finished projects.
3. **Step-by-step Audio Guide**: Hands-free voice instructions so users can craft without touching their screen.
4. **Local Hardware Export**: Print direct barcode / QR labels for workshop organization.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
