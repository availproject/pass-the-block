# 🌐 Pass the Block: Unified Web3 Experience with Avail Nexus SDK

Welcome to the Nexus SDK tutorial in our Pass the Block series! In this tutorial, you'll set up the Nexus SDK and build your first unified Web3 experience by viewing balances across multiple chains. Just like building with blocks, we'll stack knowledge piece by piece, helping you construct a seamless multi-chain application using Next.js and Avail's Nexus SDK.

## 🎯 The Problem We're Solving

Web3 development today feels like asking users to become blockchain experts just to use your app! They need to manage gas on different chains, bridge assets manually, approve tokens on each network, and constantly switch between wallets. What if your users could interact with any blockchain as easily as browsing the web?

Chain abstraction is the solution, and the Avail Nexus SDK makes it reality. Think of it like the internet: you don't think about which servers host websites, you just browse seamlessly. The Nexus SDK does the same for blockchains, handling all the complex multi-chain operations behind the scenes.

## 📝 What You'll Build

A unified Web3 application that:
- 🌐 Displays balances across multiple chains in one interface
- 🔗 Handles wallet connections seamlessly
- 🛡️ Manages basic error handling and user feedback
- 🎨 Features a clean, modern UI built with Next.js and Tailwind CSS
- ⚡ Provides a foundation for advanced cross-chain operations

## 🗺️ Tutorial Series Overview

This is Part 1 of 4 in our comprehensive Nexus SDK series:

### ✅ Part 1: Getting Started (You are here)
- Set up the Nexus SDK from scratch
- Build unified balance display
- Handle wallet connections and basic errors

### 🔜 Part 2: Cross-Chain Operations (Coming next)
- Implement cross-chain bridging
- Move assets between networks seamlessly
- Handle token transfer confirmations and status

### 🔜 Part 3: Direct Transfers (Coming soon)
- Send tokens directly across chains
- Build cross-chain payment flows
- Advanced transaction handling

### 🔜 Part 4: Production Ready (Final part)
- Deploy to mainnet with confidence
- Advanced error monitoring and analytics
- Performance optimization and scaling

## 🌟 Getting Started

1. Clone this repository:
```bash
git clone https://github.com/availproject/pass-the-block.git
```

2. Navigate to the Nexus tutorial project:
```bash
cd pass-the-block/avail-nexus-tutorial
```

3. Install dependencies:
```bash
npm install
```

If you encounter dependency conflicts with React 19:
```bash
npm install --legacy-peer-deps
```

4. Set up your environment variables for proper wallet connectivity.
Create `.env.local`:
```bash
# WalletConnect Project ID (required for mobile wallet support)
# Get this free from https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Optional: App metadata
NEXT_PUBLIC_APP_NAME="Nexus SDK Tutorial - Part 1"
NEXT_PUBLIC_APP_DESCRIPTION="Learning chain abstraction with unified balance viewing"
```

5. Run the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start building your unified Web3 experience!

## 📚 Learning Journey

In Part 1, we're going to build the foundation: a clean Web3 application that displays unified balances across multiple chains. This might seem simple, but it's an important foundation for your users to see all their assets in one place, regardless of which blockchain they're on.

## 🤝 Need Help?

- 📖 [Avail Documentation](https://docs.availproject.org)
- 🔧 [Nexus SDK Documentation](https://docs.availproject.org/api-reference/avail-nexus-sdk)
- 💬 [Community Discord](https://discord.gg/availproject)

## ⚖️ License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
