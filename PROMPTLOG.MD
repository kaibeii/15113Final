# Project Prompt Log

---

## ChatGPT

- I want to create a digital wardrobe app that lets users take a photo of the clothing item and add to their collection. It should remove the background, and let users confirm what type of clothing it is. They should then be able to generate an outfit from whatever's in their digital closet. Walk me through how I would complete this using EXPO and give me a plan. 

---

## Claude

I moved the context over from ChatGPT's plan that was given to me. It provided me with mock up images of the UI which I approved.

- Create the actual code for just the front end with the camera capability
- Walk me through setting up the backend and what I exactly need to do.
- Explain setting up MongoDB and all the backend APIs I need. Give me a step by step guide for each one.
- I want cloudinary to be able to find the main colors in the image to add for the clothing item. Implement the front end for adding colors and an optional description.
- Implement the code for cloudinary to be able to match colors. If there are multiple colors then it can be called multicolored/pattern. It should identify what the main color in the image is to be tagged.
- There needs to be an edit button once people actually save the item, and the item needs to be updated

> **Side note:** I originally connected Dedalus to use an API connected to ChatGPT to classify what type of clothing item it actually was and for the logic of generating outfits that matched together but I realized it was easier to just remove that since I did not have any more credits and rely on color backed logic for generation of outfits. I also realized it would be faster if individuals just chose what category they were in rather than making AI figure out manually.

- Move styling of UI of all pages into a separate file as one stylesheet
- When editing description, keyboard covers the UI,  how do I fix this?
- I'm getting this error "runtime not ready invariant violation turbo module registry" how do i fix this
---

## GitHub Copilot

I mainly just debugged with Copilot so most of my prompts were for debugging. There were more prompts but these below are the main ones.

- The description does not update in outfit cards. Fix this issue
- Editing any item property creates duplicate items in the wardrobe. Fix this
- The camera is going black after taking one image and uploading it. After going back to camera to add another one, camera screen is black and app crashes.
- I'm getting a React Native warning that CameraView component doesn't support children, fix this.
- Two tab interface on the generate outfit screen is confusing. Add the saved outfits under the generate outfit card. It should be a continuous scroll view that shows the generated outfit at top and saved outfits below.
- Add the ability to click on a saved outfit to see the items within it more closely. Users should be able to click on the outfit card and open a modal showing the details of each article of clothing
- There is a reference error when rendering the outfit cards, fix this.
- The background removal is not working anymore currently along with the description not saving, fix both of these issues.

---

## Claude

I moved back to Claude and gave context to what Copilot changed, and asked it to review all the changed files.

- Give me a list of changes I made and a review of them. *(I also gave Claude a text block that described the bugs it fixed)*
- I want to create a new category for sweaters/hoodies
- Saved outfits should still be saved once app is reopened, it needs to also b e stored in the database
- X button in camera does not exit out of camera into wardrobe page when clicked
- There are keyboard issues with description field, fix this 
- Unknown colors showing in outfit generation logs even though color dot shows on grid; why is this happening? Something isn't working properly with cloudinary
- Consolidate the styling again and remove duplicates
