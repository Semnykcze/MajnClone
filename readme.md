# Mini Minecraft

**Mini Minecraft** is a lightweight yet feature‑rich voxel sandbox and survival game built on **Three.js**, with advanced rendering, realistic time management, and full modding support. This README will guide you through setup, features, and usage.

---

## 🚀 Key Features

- **Modern Graphics**  
  - SSAO, Bloom, Motion Blur, God Rays, Depth of Field
  - Optional Screen-Space Reflections (SSR) & Parallax Occlusion Mapping (POM)
  - Vegetation Wind Shader & Volumetric Clouds
  - Cascaded Shadow Maps (CSM) & Temporal SSAO
  - Toggle each effect individually for performance

- **Hardcore Survival Mechanics**  
  - True **real‑time processes**: crafting, smelting, baking, and crop/tree growth take minutes of in‑game time
  - **Durability** and **tiered tools** enforce progression (wood → stone → copper → iron → diamond)
  - **Seasons & Temperature**: growth and comfort depend on season and ambient temperature
  - **Hunger & Health** bars; spoilable food with shelf‑life

- **Procedural World**  
  - 2D/3D Simplex noise terrain with **caves** carved by 3D noise
  - Bedrock, layered stone (granite/diorite/andesite), plus 20+ realistic ores (coal, iron, gold, diamond, copper, tin, nickel, titanium, uranium, etc.) in natural veins
  - Dynamic day–night cycle with moving sun, sky color, and shadows

- **Crafting & Processing**  
  - Data‑driven **recipes** with configurable `craftTime`
  - **Furnace** for smelting ores into ingots/crystals using fuel (coal, wood)
  - **CropManager** & **TreeManager** for seed planting, watering, and multi‑stage growth

- **Moddable & Extensible**  
  - **Hot-reload** of JS mods in `scripts/mods/`
  - **Lua scripting** via Fengari: write `init()` and `onEvent()` handlers
  - **Achievement Manager** with customizable milestones

- **Multiplayer (P2P)**  
  - PeerJS‑based P2P networking: reliable block updates + fast movement channels
  - No dedicated server required; just exchange Peer IDs

- **Accessibility & Localization**  
  - Multi-language UI (`assets/i18n/`) and simple UI scale/high‑contrast modes

---

## 📦 Project Structure
```text
projekt-minecraft/
├── index.html
├── style.css
├── package.json
├── main.js             # Electron bootstrap
├── assets/             # JSON definitions, textures, sounds
│   ├── blocks/
│   ├── items/
│   ├── foods/
│   ├── crops/
│   ├── recipes/
│   ├── i18n/
│   └── textures/
└── scripts/            # Core engine and modules
    ├── scene.js
    ├── graphics.js
    ├── postprocessing.js
    ├── controls.js
    ├── world.js
    ├── worldManager.js
    ├── clouds.js
    ├── optimization.js
    ├── chunkWorker.js
    ├── ui.js
    ├── gameManager.js
    ├── playerManager.js
    ├── inventoryManager.js
    ├── resolutionSelect.js
    ├── saveLoad.js
    ├── network.js
    ├── modManager.js
    ├── hotReloadManager.js
    ├── luaScripting.js
    ├── achievementManager.js
    ├── processManager.js
    ├── furnaceManager.js
    ├── seasonManager.js
    ├── treeManager.js
    ├── cropManager.js
    ├── cropsLoader.js
    └── fluid.js
```

---

## 🔧 Installation

1. **Clone** this repository:
   ```bash
   git clone https://github.com/your-repo/mini-minecraft.git
   cd mini-minecraft
   ```

2. **Install dependencies** (Electron-based desktop):
   ```bash
   npm install
   ```

3. **Run** in desktop:
   ```bash
   npm start
   ```

4. **Or** open `index.html` in a modern browser (adjust file‑loading permissions).

---

## 🎮 Controls & UI
- **W/A/S/D**: Move
- **Mouse**: Look / Aim
- **Left‑click**: Place block / Interact
- **Right‑click**: Break block
- **E**: Toggle Inventory
- **C**: Craft
- **1–8**: Hotbar slots
- **T** (with Clock): Show Day/Season (survival mode)

Use **Settings** menu for graphics/gameplay/control options.

---

## 🛠️ Modding & Extensions
- Drop JS files into `scripts/mods/` with:
  ```js
  export const metadata = { id: 'myMod', name: 'My Mod', description: '...' };
  // ... your code
  ```
- Lua scripts in `scripts/lua/` with `init()` and `onEvent(name, data)`.

---

## 📜 License
MIT License. See [LICENSE](LICENSE).

Enjoy building, exploring, and surviving in your own voxel world! 🚀

