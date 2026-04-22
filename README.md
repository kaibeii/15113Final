# Outfit Picker

A React Native mobile app that lets users digitise their wardrobe by photographing clothing items and generate color-matched outfits from their collection.

Built for CMU 15-113.

---

## What the project does

Outfit Picker lets you build a digital wardrobe on your phone. You take a photo of a clothing item, the background is automatically removed by the backend, and the app detects the dominant color. You confirm the clothing type and optionally add a description. Once your wardrobe is built up, you can generate outfits — the backend uses color matching logic to pair items that work well together, favouring combinations like navy + beige, red + black, or any item with a neutral.

Every item and saved outfit persists to a cloud database so your wardrobe is always there when you reopen the app.

The project is split into two parts:
- **Frontend** — React Native + Expo mobile app (`15113Final/`)
- **Backend** — Node.js + Express API server (`15113Backend/`)

---

## Features I'm most proud of

**Background removal + color detection pipeline**
The most technically interesting part of the project is the image processing pipeline. When you upload a photo, the backend sends it to remove.bg to strip the background, then uploads the clean PNG to Cloudinary which analyses the image and returns the dominant hex colors. The backend then maps those hex values to named color families using RGB distance across multiple reference values per family — so `#1a237e` correctly maps to navy even though it's not an exact match. This was tricky to get right and makes the color tagging feel automatic and accurate.

**Color-based outfit generation**
The outfit generator doesn't pick randomly; it uses compatibility table to match colors intelligently. Neutrals (black, white, grey, beige, brown) pair with everything. Solid colors are matched against specific pairs (navy pairs with beige, white, grey, brown; red pairs with navy, white, black, grey). Multicolor and pattern items are only paired with neutrals. Same colors only match if they're both neutral — so all-black works but all-red doesn't. This makes the generated outfits feel considered rather than random.

**App layout and UX**
The three-tab layout with a floating + button in the centre feels natural for a wardrobe app. The item detail modal, edit flow, and saved outfit cards all came together into a UI I'm happy with.


---

## How to use it

1. Tap the **+** button in the centre of the tab bar to open the camera
2. Take a photo of a clothing item or pick one from your library
3. Select the type (Top, Sweater, Bottom, Shoes, Hat) and optionally pick a color and add a description
4. Tap **Save to wardrobe** — the backend removes the background, detects the color, and saves the item
5. Go to the **Outfits** tab and tap **Generate outfit** to get a color-matched combination
6. Save outfits you like — they appear below the generator and persist across sessions
7. Tap any wardrobe item to see its details or edit the type, color, or description

---

## Tech stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React Native + Expo SDK 54 | Mobile app framework |
| Expo Camera | Camera access for clothing photos |
| Expo Image Picker | Photo library access |
| Expo Font | Custom font loading (Inter + OffBit) |
| React Navigation | Tab-based navigation |
| Axios | HTTP requests to backend |
| Context API | Global wardrobe and outfit state |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | Server and API routes |
| MongoDB Atlas | Database for clothing items and saved outfits |
| Mongoose | MongoDB object modeling |
| Cloudinary | Image hosting + automatic color extraction |
| remove.bg | AI background removal |
| Multer | Multipart image upload handling |

### External services
| Service | Free tier | Purpose |
|---------|-----------|---------|
| MongoDB Atlas | 512MB storage, free forever | Database |
| Cloudinary | 25GB storage, 25GB bandwidth/month | Image hosting + color detection |
| remove.bg | 50 removals/month | Background removal |
| Render | Free with spin-down | Backend hosting |

---

## Project structure

### Frontend (`15113Final/`)
```
15113Final/
├── App.js                        ← Root, tab navigator, font loading
├── app.json                      ← Expo config, SDK version, permissions
├── babel.config.js
├── package.json
├── assets/
│   └── fonts/
│       ├── Inter-Light.ttf
│       ├── Inter-Regular.ttf
│       ├── Inter-Medium.ttf
│       └── OffBit-DotBold.ttf
├── api/
│   └── wardrobeApi.js            ← All Axios calls to backend
├── components/
│   ├── ClothingItem.js           ← Item card, detail modal, edit mode
│   └── OutfitCard.js             ← Saved outfit card with detail modal
├── constants/
│   └── theme.js                  ← Colors, fonts, spacing, categories
├── context/
│   └── WardrobeContext.js        ← Global state — items and saved outfits
├── screens/
│   ├── WardrobeScreen.js         ← Home tab: grid with category sections
│   ├── CameraScreen.js           ← Centre tab: camera + confirm screen
│   └── OutfitsScreen.js          ← Right tab: generate and save outfits
└── styles/
    └── index.js                  ← All styles in one file with section comments
```

### Backend (`15113Backend/`)
```
15113Backend/
├── server.js                  ← Entry point
├── .env                       ← API keys (never committed)
├── .gitignore
├── package.json
├── config/
│   └── db.js                  ← MongoDB connection
├── models/
│   ├── ClothingItem.js        ← Clothing item schema
│   └── SavedOutfit.js         ← Saved outfit schema
├── routes/
│   └── items.js               ← All route definitions
├── controllers/
│   └── itemsController.js     ← Request handlers + color matching + outfit logic
└── services/
    ├── removeBg.js            ← remove.bg background removal
    ├── cloudinary.js          ← Cloudinary upload + color extraction
    └── vision.js              ← Placeholder for future AI classification
```

---

## API endpoints (backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/upload` | Upload and process a clothing item |
| GET | `/items` | Get all wardrobe items |
| DELETE | `/items/:id` | Delete an item |
| PATCH | `/items/:id` | Update type, color, description |
| GET | `/outfit` | Generate a color-matched outfit |
| POST | `/outfits` | Save an outfit |
| GET | `/outfits` | Get all saved outfits |
| DELETE | `/outfits/:id` | Delete a saved outfit |

### POST `/upload` — image processing flow

1. Image buffer received via Multer (kept in memory, not written to disk)
2. Sent to remove.bg → returns clean PNG with transparent background
3. Clean PNG uploaded to Cloudinary with `colors: true` → returns URL + dominant color data
4. Hex colors mapped to named color family using RGB distance
5. If user selected a color manually it overrides the auto-detected one
6. Item saved to MongoDB with imageUrl, type, color, description
7. Returns saved item + suggestedColor so the frontend can display what was detected

---

## How to run locally

### Frontend

```bash
cd 15113Final
npm install
npx expo start
```

Scan the QR code with Expo Go. Your phone and computer must be on the same WiFi network if running the backend locally.

Open `api/wardrobeApi.js` and set the URL to your machine's local IP:
```js
const BASE_URL = 'http://yourlocalIP:3000';
```

### Backend

```bash
cd 15113Backend
npm install
npm run dev
```

Create a `.env` file in `15113Backend/` with your credentials:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/outfit-picker?retryWrites=true&w=majority
REMOVE_BG_KEY=your_remove_bg_key
CLOUDINARY_CLOUD=your_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
PORT=3000
```

Test the backend is running by visiting:
```
http://localhost:3000
```

You should see:
```json
{ "status": "Outfit Picker API is running" }
```

### Running without the backend

The frontend degrades gracefully when the backend is unreachable — items save locally, outfit generation picks randomly from in-memory items, and edits update locally without persisting.

---

## Secrets handling

**Frontend** — there are no secrets in the frontend. The only configuration value is `BASE_URL` in `wardrobeApi.js` which is just the backend URL, not a credential.

**Backend** — all secrets are stored in a `.env` file which is listed in `.gitignore` and never committed to GitHub:
```
MONGO_URI        ← MongoDB Atlas connection string
REMOVE_BG_KEY    ← remove.bg API key
CLOUDINARY_CLOUD ← Cloudinary cloud name
CLOUDINARY_KEY   ← Cloudinary API key
CLOUDINARY_SECRET← Cloudinary API secret
```

On Render, these values are entered manually as environment variables in the dashboard and injected at runtime — they are never stored in the codebase.

---

## Color tag system (backend)

Colors are detected automatically by Cloudinary and stored with each item. Cloudinary returns dominant colors as hex values with percentage coverage — the backend maps these to named families using RGB distance.

| Condition | Result |
|-----------|--------|
| Top color covers ≥55% | Single color (e.g. "navy") |
| Two colors fairly even, one neutral | Returns the non-neutral color |
| Two colors fairly even, neither neutral | "multicolor" |
| 3+ significant colors | "pattern" |

Users can override the auto-detected color at upload time or by editing the item later.

---

## Outfit color matching rules (backend)

```
Neutrals (black, white, grey, beige, brown) → pair with everything
Same color + same color → only works for neutrals (all black ✅, all red ❌)
Multicolor / pattern → pairs with neutrals only
navy   → beige, white, grey, brown
blue   → white, grey, beige, navy
red    → navy, white, black, grey
green  → beige, white, brown, navy
yellow → navy, white, black, grey
orange → navy, white, black, brown
pink   → navy, white, black, grey
purple → white, black, grey, beige
```

The generator picks a random top first, then finds the best color match for the bottom and shoes. Falls back to neutrals if no match exists, and falls back to random as a last resort.

---

## Deployment

The backend is deployed on Render and the database is hosted on MongoDB Atlas. To deploy your own instance:

1. Push `15113Backend` to a private GitHub repository
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repository
4. Set build command: `npm install` and start command: `npm start`
5. Add all environment variables under **Environment**
6. Deploy — Render gives you a URL like `https://your-app.onrender.com`
7. Update `BASE_URL` in `api/wardrobeApi.js` to that URL

**Note:** Render free tier spins down after 15 minutes of inactivity. The first request after inactivity may take 20-30 seconds while the server wakes up. For a live demo, open the app a minute before presenting.

---

## Known limitations

- Render free tier spin-down means first request after inactivity is slow
- remove.bg free tier allows 50 background removals per month
- Saved outfits store full item snapshots — if an item is deleted the outfit card still shows its last known image

---

## Future improvements

- Weather-based outfit filtering
- Style tags (casual, formal, smart-casual)
- Outfit history and wear tracking
- Most worn items statistics
- Swipe to replace a single item in a generated outfit