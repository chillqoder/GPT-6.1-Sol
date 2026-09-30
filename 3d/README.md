# Aqua — a little ocean

A procedural, interactive 3D aquarium built from the brief in `3d.md` and expanded into an artistic ecosystem. The entire application is in `index.html`. No image textures, models, fonts, or other assets are downloaded.

- Six distinct fish models: clownfish, blue tang, yellow tang, angelfish, butterflyfish, and royal gramma. Each has its own silhouette, shader pattern, fins, size, speed, turning response, preferred depth, and navigation style.
- 26 irregularly placed plant clusters across six models: tall ribbons, thin waving blades, broad leaves with veins, feathery stems, grass, and decorative rosettes. Leaves and their shadows sway with independently phased currents.
- Two articulated crabs with slow obstacle avoidance and resting periods. Six snails crawl on front/side glass, the bottom, and a rock.
- 50 stones, 650 small gravel pieces, 12 ridged shells, barnacles, two small decorative sea stars, and two low rock shelters, with open swimming space above.
- The original glass tank, camera, lighting, ripples, bubbles, caustics, and interface are retained.

## Run

From this directory:

```sh
python3 -m http.server 8766
```

Open **http://localhost:8766**. An internet connection is needed for the pinned Three.js 0.160.0 CDN modules.

## Controls

- Drag to orbit; scroll or pinch to zoom; right-drag or two-finger drag to pan.
- Use the toolbar to pause, switch daylight/moonlight, toggle bubbles, enable a slow automatic orbit, or reset the camera.
- **Space** pauses/resumes. **R** resets the view.
- The top-right button enters fullscreen; the residents card opens an introduction to the ecosystem.

The layout adapts to desktop and mobile. Reduced-motion preferences start the aquarium paused. Rendering stays at the viewport's native device-pixel resolution: no delayed quality reduction or automatic framebuffer resizing. Static vegetation and details are batched, and gravel, stones, and bubbles use instancing. Serve the HTML from a local server for reliable ES module loading.

## Browser verification

With the server running and `playwright-cli` installed:

```sh
playwright-cli -s=aqua open http://localhost:8766
playwright-cli -s=aqua run-code --filename=tests/ecosystem.browser.js
```

The check samples native-resolution stability and fish boundaries for 24 seconds, verifies crab obstacle clearance, slow snail movement, pause and scene controls, and checks a Retina mobile viewport. It also saves desktop/mobile screenshots under `output/`. Frame rate is measured, but never used to reduce image quality.
