# Flowarr

**The fastest way to send your Sonarr and Radarr libraries to FileFlows for automated processing and optimization—just one click per show or movie.**

Effortlessly browse your entire TV and movie collection, see which titles are already optimized, and add new ones to FileFlows with a single click. Instantly track your storage savings and keep your media library lean and organized.

## Features

- 📺 **Browse all your Sonarr series and Radarr movies** with cover art
- 🟢 **One-click add to FileFlows** for optimization and tracking
- 💾 **See storage savings** for each library, or a "Processing..." badge if still running
- 🟩 **Tabs** to switch between Television and Movies
- 👁️ **Hide added** toggle to focus on unoptimized content
- ⚡ **Fast, responsive UI** for a seamless experience

## Setup

1. **Install dependencies**
   ```sh
   bun install
   ```

2. **Configure your servers**
   Edit `config.json` with your Sonarr, Radarr, and FileFlows URLs and API keys:
   ```json
   {
     "sonarrUrl": "http://your-sonarr:8989",
     "sonarrApiKey": "YOUR_SONARR_API_KEY",
     "radarrUrl": "http://your-radarr:7878",
     "radarrApiKey": "YOUR_RADARR_API_KEY",
     "fileflowsUrl": "http://your-fileflows:19200"
   }
   ```

3. **Run the app**
   ```sh
   bun run dev --open
   ```

4. **Visit**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## How it works

- **Backend API proxies** all requests to Sonarr, Radarr, and FileFlows to avoid CORS issues.
- **Add to FileFlows** uses the correct flow for TV or Movies, and updates the UI instantly.
- **Storage savings** are fetched and displayed for each library, or a "Processing..." badge if not yet available.

## License

MIT
