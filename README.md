# Outfit Picker — Frontend

A React Native mobile app that lets users digitise their wardrobe by photographing clothing items and generate color-matched outfits from their collection.

Built for CMU 15-113.

---

## What the project does

Outfit Picker lets you build a digital wardrobe on your phone. You take a photo of a clothing item, the background is automatically removed, and the app detects the dominant color. You then confirm the clothing type and optionally add a description. Once your wardrobe is built up, you can generate outfits — the app uses color matching logic to pair items that work well together, favouring combinations like navy + beige, red + black, or any item with a neutral.

Every item and saved outfit persists to a cloud database so your wardrobe is always there when you reopen the app.

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
4. Tap **Save to wardrobe** — the background is removed and the item is added to your wardrobe
5. Go to the **Outfits** tab and tap **Generate outfit** to get a color-matched combination
6. Save outfits you like — they appear below the generator and persist across sessions
7. Tap any wardrobe item to see its details or edit the type, color, or description

---

## Tech stack

| Technology | Purpose |
|------------|---------|
| React Native + Expo SDK 54 | Mobile app framework |
| Expo Camera | Camera access for clothing photos |
| Expo Image Picker | Photo library access |
| Expo Font | Custom font loading (Inter + OffBit) |
| React Navigation | Tab-based navigation |
| Axios | HTTP requests to backend |
| Context API | Global wardrobe and outfit state |

---

## Project structure

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

---

## How to run locally

### Prerequisites
- Node.js 18+
- Expo Go installed on your phone (iOS or Android)
- The backend running locally or deployed to Render

### Installation

```bash
cd 15113Final
npm install
npx expo start
```

Scan the QR code with Expo Go. Your phone and computer must be on the same WiFi network if running the backend locally.

### Connecting to the backend

Open `api/wardrobeApi.js` and set the URL:

```js
// For local backend (replace with your machine's local IP):
const BASE_URL = 'http://yourmachineslocalip';

// For deployed backend on Render:
const BASE_URL = 'https://your-app.onrender.com';
```

### If you see dependency warnings

```bash
npx expo install expo-status-bar expo-camera expo-image-picker expo-image-manipulator react-native react-native-safe-area-context react-native-screens @expo/vector-icons babel-preset-expo -- --legacy-peer-deps
```

---

## Running without the backend

The app degrades gracefully when the backend is unreachable:

- Items are saved locally with the captured photo URI
- Outfit generation picks randomly from in-memory items
- Edits update locally without persisting to the database
- Wardrobe shows only items added in the current session

---

## Secrets handling

There are **no secrets in the frontend**. The only configuration value is `BASE_URL` in `wardrobeApi.js` which is just the backend URL — not a credential.

All API keys (remove.bg, Cloudinary, MongoDB) are stored in the backend's `.env` file which is listed in `.gitignore` and never committed to GitHub. On Render, secrets are stored as environment variables in the dashboard and injected at runtime.

---

## Color tag system

Colors are detected automatically by Cloudinary and displayed as small dots on each item card.

| Tag | What it means |
|-----|---------------|
| black, white, grey, navy, blue, red, green, yellow, orange, pink, purple, brown, beige | Single dominant color |
| multicolor | Two colors fairly evenly distributed |
| pattern | Four or more colors spread across the image |
| unknown | Could not detect — user can set manually |

Users can override the auto-detected color at upload time or by editing the item later.

---

## Outfit color matching rules

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

---

## Known limitations

- Render free tier spins down after 15 minutes of inactivity — first request may take 30 seconds
- remove.bg free tier allows 50 background removals per month
- Saved outfits store full item snapshots — if an item is deleted the outfit card still shows its last known image

---

## Future improvements

- Weather-based outfit filtering
- Style tags (casual, formal, smart-casual)
- Outfit history and wear tracking
- Most worn items statistics
- Swipe to replace a single item in a generated outfit