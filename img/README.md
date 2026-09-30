# Kage — The Silent Ronin

A single-file interactive Three.js sculpture based on `img.png` and the brief in `model.md`.

Open `index.html` in a modern browser, or serve this directory:

```sh
python3 -m http.server 8767
```

Then visit <http://localhost:8767>.

Drag to orbit, scroll or pinch to zoom, and right-drag or use two fingers to pan. The toolbar controls turntable rotation, idle breathing, wireframe inspection, and reset.

All character geometry, surface variation, and studio lighting are generated in the HTML file. The reference image is not loaded by the page. The only imported modules are Three.js and OrbitControls, pinned to version 0.170.0 on unpkg. Internet access and WebGL 2 are required. Reduced-motion preferences disable idle animation by default.

The model includes a curved skull with bevelled eye and nasal cavities, a ribbed kasa, tapered horns, layered armor and pouches, a wrapped katana, gathered trousers, tabi socks, and sandals with individual toes. The page adapts to desktop, mobile, and landscape layouts.
