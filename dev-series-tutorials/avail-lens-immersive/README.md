# 🌌 Lens Network Immersive Visualization

An interactive 3D visualization of the Lens Network social graph, built with Next.js, Three.js, and React Three Fiber.

## 🎨 Features

- 🔮 Beautiful 3D visualization of Lens Network connections
- 🎯 Interactive camera controls for exploring the network
- 🔍 Search functionality to find specific Lens handles
- ✨ Animated transitions between network clusters
- 🎭 Double-click navigation to focus on specific nodes
- 🌈 Distinct color schemes for different clusters
- 💫 Dynamic starburst patterns for follower visualization
- 🎬 Smooth camera animations and transitions

## 🚀 Getting Started

1. Clone this repository:
```bash
git clone https://github.com/availproject/pass-the-block.git
```

2. Navigate to the Lens visualization project:
```bash
cd pass-the-block/dev-series-tutorials/avail-lens-immersive
```

3. Install dependencies:
```bash
npm install
```

4. Set up environment variables:
```bash
cp env.example.js .env
```
Then edit the `.env` file and set `NEXT_PUBLIC_APP_URL` to match your application's running URL (e.g., `http://localhost:3000`).

5. Run the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the Lens Network visualization!

## 🎮 How to Use

- 🖱️ **Mouse Controls**:
  - Left Click + Drag: Rotate the view
  - Right Click + Drag: Pan the camera
  - Scroll: Zoom in/out
  - Double Click: Focus on a node

- 🔍 **Search**:
  - Use the search bar to find specific Lens handles
  - The camera will smoothly animate to the selected profile

## 🛠️ Built With

- Next.js 14
- Three.js
- React Three Fiber
- NextUI
- TypeScript
- Tailwind CSS

## 🎯 Future Enhancements

- Real-time Lens Protocol data integration
- Enhanced cluster visualization patterns
- Profile metadata display
- Connection strength visualization
- Interactive node information panels
- Custom color theme selection

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Lens Protocol Documentation](https://docs.lens.xyz)
- [Three.js Documentation](https://threejs.org/docs)

## ⚖️ License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.