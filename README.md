# Physics Figures

A standalone, high-fidelity educational vector diagram generator built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Vite**.

Created based on the reverse engineering of [PhysicsFigures.com](https://physicsfigures.com/), this platform provides physics educators, students, and textbook authors with mathematically precise, publication-ready vector diagrams.

---

## Features

- **9 Specialized Physics Generators**:
  1. **Free-Body Diagrams (FBD)**: Center-of-mass origin, 1–8 forces, custom angles, parallel arrow collision offsets, orthogonal components ($F_x, F_y$), kinematics direction arrows.
  2. **Vector Addition Diagrams**: Head-to-tail vector chaining on Cartesian grids, auto-resultant calculation, angle arcs.
  3. **Inclined Planes**: Ramp angle ($\theta$), normal force, weight components ($mg\sin\theta, mg\cos\theta$), friction, block/ball/cart bodies.
  4. **Pulleys & Atwood Machines**: Dual-mass Atwood setups, pulley groove styling, string tension markers, acceleration vectors.
  5. **Projectile Motion**: Ground and cliff launches, velocity decomposition ($v_0, v_{0x}, v_{0y}$), parabolic trajectory plotting, maximum height ($H_{\max}$), and range ($R$).
  6. **Kinematics Motion Graphs**: $x(t)$, $v(t)$, and $a(t)$ piecewise segments (constant, linear, quadratic curves) with tick marks and grid options.
  7. **Newton Spring Scales**: Calibrated Newton scale cylinder, Hooke's law elongation, movable collar pointer, hanging loads.
  8. **DC Circuits**: Series and parallel topologies, batteries, resistors, light bulbs, switches, and ammeters/voltmeters.
  9. **Wave Diagrams**: Transverse and longitudinal waves, wavelength ($\lambda$), amplitude ($A$), node and antinode markers.

- **Textbook Legibility**:
  - Uses Times New Roman math typography with SVG `paint-order: stroke` (halo effect), ensuring text is readable over dense lines and arrows.
  - Full LaTeX math syntax parser (`F_g`, `\vec{F}_N`, `\mathbf{F}_A`, `\theta`, `\mu_k`, `x^2`, `v_0^2`).
  - Blank line support (`_`) for quiz worksheets.

- **Multi-Format Export & Sharing**:
  - **Copy Image**: Copies high-DPI (3× rasterized) PNG directly to system clipboard for instant pasting into Word, Google Docs, or slides.
  - **Download PNG**: High-resolution print-ready PNG (1800×1200+ px).
  - **Download SVG**: Clean, sanitized vector graphic XML for Illustrator or Inkscape.
  - **Share Link**: Encodes diagram configuration into URL query parameters (`?figure=<id>&state=...`).
  - **Print Ready**: Integrated `@media print` stylesheet isolating diagrams onto clean white paper.

---

## Getting Started

### Development
```bash
cd physics-figures
npm install
npm run dev
```

### Run Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

The output bundle will be located in the `dist/` directory.
