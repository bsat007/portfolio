# Badal Satyarthi — Portfolio

A dark, futuristic portfolio website with custom WebGL shaders and 3D graphics.

**Live:** [satyarthi.online](https://satyarthi.online)

---

## ✨ Unique Features

- **Parallax Cloud Layer** — Custom GLSL shader creating layered, drifting clouds with scroll-based parallax. A personal touch representing "Badal" (बादल = cloud in Hindi).

- **Dithered 3D Graphics** — WebGL shader with Bayer matrix dithering for a retro-futuristic aesthetic. Features an animated torus knot and floating icosahedrons.

- **Noise-Driven Animations** — Fractal Brownian Motion (FBM) generates organic cloud textures and smooth vertex displacement.

- **Sci-Fi Terminal Aesthetic** — Dark theme with monospace typography, subtle vignette effects, and cinematic atmosphere.

- **Scroll Progress Indicator** — Spring-animated progress bar with mix-blend-difference for visibility.

- **Responsive Design** — Mobile-first navigation with animated hamburger menu.

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | React 19, TypeScript |
| **3D Graphics** | Three.js, @react-three/fiber |
| **Shaders** | Custom GLSL (vertex + fragment) |
| **Animation** | Framer Motion |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **Build** | Vite |

---

## 🚀 Run Locally

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## 📁 Project Structure

```
├── App.tsx              # Main app with sections
├── constants.ts         # Resume data
├── types.ts             # TypeScript types
├── components/
│   ├── ShaderBackground.tsx   # 3D scene + cloud shaders
│   └── ui/
│       ├── Card.tsx
│       └── Section.tsx
```

---

## 📧 Contact

- **Email:** [bsatyarthi@gmail.com](mailto:bsatyarthi@gmail.com)
- **LinkedIn:** [linkedin.com/in/bsat007](https://linkedin.com/in/bsat007)
- **HackerRank:** [hackerrank.com/bsatyarthi](https://hackerrank.com/bsatyarthi)

---

*End of Transmission*
