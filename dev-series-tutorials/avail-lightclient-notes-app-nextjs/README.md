# 🧊 Pass the Block: Decentralized Notes App

Welcome to the first tutorial in our Pass the Block series! Just like building with blocks, we'll stack knowledge piece by piece, helping you construct a decentralized notes application using Next.js and Avail's Light Client. Each step of the tutorial is a new block in your foundation - from understanding Data Availability (DA) to creating something real and practical. In this project, you'll assemble the building blocks of your first decentralized app while gaining hands-on experience with Avail's technology!

## 📝 What You'll Build

A fully decentralized notes app that:
- 🏗️ Stores messages directly on Avail's DA layer
- 🔗 Uses Light Client for trustless data verification
- 📡 Tracks block confirmations in real-time
- 🎨 Features a clean, modern UI built with Next.js
- 🛡️ Includes local backup and error handling

## 🌟 Getting Started

1. Clone this repository:
```bash
git clone https://github.com/availproject/pass-the-block.git
```

2. Navigate to the notes app project:
```bash
cd pass-the-block/avail-light-client-notes-app-nextjs
```

3. Install dependencies:
```bash
npm install
```

4. Start your Avail Light Client (make sure to replace YOUR_APP_ID):
```bash
curl -sL1 avail.sh | bash -s -- --app_id YOUR_APP_ID --network turing --identity PATH_TO_YOUR_IDENTITY_TOML/identity.toml
```

5. Run the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start using your decentralized notes app!

## 📚 Learning Journey

This tutorial breaks down into four main parts:
1. Setting up the Next.js foundation
2. Integrating with Avail Light Client
3. Implementing note submission and verification
4. Adding advanced features like block confirmation tracking

## 🤝 Need Help?

- 📖 [Avail Documentation](https://docs.availproject.org)
- 🔧 [Light Client API Documentation](https://docs.availproject.org/api-reference/avail-lc-api)

## ⚖️ License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
