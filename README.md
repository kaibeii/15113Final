# 15113Final — Outfit Picker App

React Native + Expo mobile app that lets users digitise their wardrobe and generate color-matched outfits. Built for CMU 15-113.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React Native + Expo SDK 54 | Mobile app framework |
| Expo Camera | Camera access for clothing photos |
| Expo Image Picker | Photo library access |
| React Navigation | Tab-based navigation |
| Axios | HTTP requests to backend |
| Context API | Global wardrobe state management |

---

## Project Structure

```
15113Final/
├── App.js                        ← Root component, tab navigator, WardrobeProvider
├── app.json                      ← Expo config, permissions, SDK version
├── babel.config.js               ← Babel preset for Expo
├── package.json                  ← Dependencies
├── api/
│   └── wardrobeApi.js            ← All Axios calls to the backend
├── components/
│   ├── ClothingItem.js           ← Item card with color dot, detail modal, edit mode
│   └── OutfitCard.js             ← Saved outfit row card
├── constants/
│   └── theme.js                  ← Colors, spacing, category labels, color swatches
├── context/
│   └── WardrobeContext.js        ← Global state: items + saved outfits
└── screens/
    ├── WardrobeScreen.js         ← Home tab: wardrobe grid with category sections
    ├── CameraScreen.js           ← Centre tab: camera, type selector, color picker, description
    └── OutfitsScreen.js          ← Right tab: generate + save outfits
```

---

## Features

### Wardrobe (Home tab)
- Displays all clothing items in a grid, grouped by category (Tops, Bottoms, Shoes, Hats)
- Filter chips at the top to view by category
- Each item card shows a small color dot in the bottom-right corner
- Tap any item to open a detail modal showing:
  - Full image
  - Type badge (e.g. Top, Bottom)
  - Color tag (e.g. Navy, Multicolor, Pattern)
  - Optional description
  - Date added
  - Edit button
  - Delete button
- Pull to refresh loads latest items from the backend

### Editing an item
- Tap any item card → detail modal opens
- Tap **Edit item** at the bottom → modal switches to edit mode
- Edit mode allows changing:
  - Type (Top / Bottom / Shoes / Hat / Other)
  - Color (full color picker with all color families)
  - Description (free text)
- Tap **Save changes** → calls `PATCH /items/:id` on the backend
- Item updates instantly in the wardrobe grid
- Tap **Cancel** to exit edit mode without saving

### Camera (Centre + button)
- Opens camera viewfinder with corner guides
- Flip between front and back camera
- Pick from photo library instead
- After capturing, confirm screen shows:
  - Type selector (Top / Bottom / Shoes / Hat / Other)
  - Color picker — optional manual selection, auto-detected by Cloudinary if left blank
  - Optional text description
- Tapping back retakes the photo without crashing (camera remounts via key prop)

### Color detection
- When an item is uploaded, Cloudinary analyses the image and returns dominant hex colors
- Backend maps hex values to named color families using RGB distance
- If one color covers 60%+ of the image → single color tag (e.g. "navy")
- If two colors are fairly even → "multicolor"
- If 4+ colors spread across the image → "pattern"
- User can manually override the auto-detected color at upload time or by editing later

### Outfits (Right tab)
- **Generated tab** — tap Generate outfit to get a color-matched combination
  - Picks 1 top, 1 bottom, 1 pair of shoes
  - Color matching rules:
    - Neutrals (black, white, grey, beige, brown) pair with everything
    - Solid colors matched against compatibility table (e.g. navy + beige, red + black)
    - Multicolor/pattern items paired with neutrals only
  - Save button keeps the outfit in the Saved tab
  - Regenerate button picks a new combination
- **Saved tab** — shows all saved outfits as cards with 3-slot previews
  - Delete individual saved outfits

### Human-in-the-loop design
The app puts the user in control at every step. Type and color can be set manually at upload and edited at any time after saving. The auto-detection is a suggestion, not a final decision. This is a deliberate HCI design choice.

---

## Screens

### WardrobeScreen.js
- Fetches items from `GET /items` on mount
- Groups items by `type` field into category sections
- Filter chips switch between grouped view and flat filtered grid
- Each item rendered by `ClothingItem` component

### CameraScreen.js
- Uses `expo-camera` CameraView with a `key` prop to force remount between shots
- After capture, shows a scrollable confirm screen with:
  - Type chips
  - Color picker grid (tap to select, tap again to deselect for auto-detect)
  - Description text input
- On save: calls `POST /upload` with image, type, color, and description
- Falls back to local in-memory save if backend is unreachable

### OutfitsScreen.js
- Calls `GET /outfit` for color-matched generation
- Falls back to local random selection if backend is unreachable
- Saved outfits stored in WardrobeContext (in-memory, session only)

---

## State Management

All global state lives in `WardrobeContext.js`:

```
WardrobeContext
├── items[]               ← all clothing items
├── savedOutfits[]        ← outfits saved this session
├── addItem(item)         ← adds item to wardrobe
├── removeItem(id)        ← removes item from wardrobe
├── updateItem(item)      ← replaces an item with updated version
├── saveOutfit(outfit)    ← saves a generated outfit
├── removeSavedOutfit(id) ← deletes a saved outfit
└── getItemsByType(type)  ← filters items by category
```

---

## API Integration

All backend calls are in `api/wardrobeApi.js`:

| Function | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| `uploadClothingItem` | POST | `/upload` | Send image, type, color, description |
| `fetchWardrobeItems` | GET | `/items` | Load all wardrobe items |
| `deleteClothingItem` | DELETE | `/items/:id` | Remove an item |
| `updateClothingItem` | PATCH | `/items/:id` | Update type, color, description |
| `generateOutfit` | GET | `/outfit` | Get a color-matched outfit |

### Changing the backend URL

For local development (phone + computer on same WiFi):
```js
const BASE_URL = 'http://192.168.x.x:3000';
```

For production (after deploying to Render):
```js
const BASE_URL = 'https://your-app.onrender.com';
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Expo Go app installed on your phone (iOS or Android)
- Phone and computer on the same WiFi network (for local backend)

### Installation

```bash
cd 15113Final
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone.

### If you see dependency warnings

```bash
npx expo install expo-status-bar expo-camera expo-image-picker expo-image-manipulator react-native react-native-safe-area-context react-native-screens @expo/vector-icons babel-preset-expo -- --legacy-peer-deps
```

---

## Running Without the Backend

The app degrades gracefully when the backend is not running:

- **Camera screen** — saves items locally with the captured photo URI
- **Outfit generation** — picks randomly from in-memory items
- **Edit item** — updates locally without persisting to database
- **Wardrobe** — shows items added this session only

---

## Color Tag System

Colors are detected by the backend (via Cloudinary) and stored with each item. The frontend displays them as:

- A small colored dot in the bottom-right corner of each item card
- A color badge in the item detail modal
- A selectable color in the edit modal and camera confirm screen

| Tag | Display |
|-----|---------|
| black, white, grey, navy, blue, red, green, yellow, orange, pink, purple, brown, beige | Solid colored dot |
| multicolor | Half-red, half-blue dot |
| pattern | Striped ≋ indicator |
| unknown | Grey dot |

---

## Outfit Color Matching

The outfit generator uses these compatibility rules:

```
Neutrals (black, white, grey, beige, brown)  →  match with everything
Solid color  +  neutral                       →  always works
Solid color  +  matching color pair           →  works (e.g. navy + beige)
Multicolor   +  neutral                       →  works
Multicolor   +  multicolor                    →  avoided
Pattern      +  neutral                       →  works
Pattern      +  pattern                       →  avoided
```

---

## Known Issues & Limitations

- Saved outfits are in-memory only — they reset when the app is closed
- remove.bg free tier is limited to 50 background removals per month
- Render free tier spins down after 15 minutes — first request after inactivity may be slow
- Color detection works best on items photographed against a plain background

---

## Future Improvements

- Persist saved outfits to MongoDB
- Weather-based outfit filtering
- Outfit history tracking
- Style tags (casual, formal, smart-casual)
- Most worn items statistics
- Swipe to replace a single item in a generated outfit
- Push notifications for daily outfit suggestion