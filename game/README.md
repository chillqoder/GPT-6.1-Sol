# Little Leap

A single-file, low-poly 3D platformer built from `game.md`. All game code, styling, geometry, and procedural scenery are in `index.html`. Three.js and the optional fonts load from CDNs.

## Play

Open `index.html` in a modern browser with internet access, or serve this folder:

```sh
python3 -m http.server 8766 --bind 127.0.0.1
```

Then visit **http://127.0.0.1:8766**.

| Action | Control |
| --- | --- |
| Move | Left/right arrows or A/D |
| Jump | Space, W, or up arrow; hold for a higher leap |
| Run | Hold Shift |
| Pause/resume | P or Escape |
| Start/resume | Enter |
| Restart | R |
| Sound | M or the speaker button |

On small screens, use the on-screen arrows and jump button.

Collect coins, bump question blocks from below, stomp mushrooms from above, and cross the gaps. Reach the finish flag to complete the level. You have three lives and a checkpoint halfway through. Coin and enemy progress persists after losing a life; restarting resets the whole adventure. Sound starts muted and can be enabled at any time.

No installation or build step is required.
