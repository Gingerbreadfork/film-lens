# 🎬 Film Lens

A Chrome extension that enhances movie browsing with instant ratings, cast info, and insights. 

Built by me, for me—but hey, if you’re here, you might enjoy it too! Powered by the data from the glorious folks over at [OMDb API](https://www.omdbapi.com/), go donate to them or something!

## 🚀 Setup
1. Clone the repository
2. Create a `.env` file in the root directory with your OMDB API key:
   ```
   VITE_OMDB_API_KEY=your_api_key_here
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Build the extension:
   ```
   npm run build
   ```
5. Load the extension in Chrome from the `dist` folder

## 🛠 Development
**Building:**  
`npm run build` - Builds the extension

**Loading the Extension in Chrome:**  
- Open Chrome and navigate to chrome://extensions/.
- Enable "Developer mode" (top right corner).
- Click "Load unpacked" and select the dist folder from this repository.
- The extension icon should now appear in your browser toolbar.
- Click it, search movies, enjoy.
