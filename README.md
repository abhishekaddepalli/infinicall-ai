# 📞 Infinicall AI — Next-Gen Voice AI & Telephony Platform

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Infinicall%20AI-015482?style=for-the-badge&logo=phone&logoColor=white" alt="Infinicall AI"/>
  <img src="https://img.shields.io/badge/Powered%20By-Infiniforge%20Technologies-6366F1?style=for-the-badge&logo=lightning&logoColor=white" alt="Infiniforge Technologies"/>
  <img src="https://img.shields.io/badge/Voice%20AI-Sarvam%20AI%20%7C%20ElevenLabs%20%7C%20OpenAI-06B6D4?style=for-the-badge" alt="Voice Engines"/>
  <img src="https://img.shields.io/badge/Telephony-Plivo%20%7C%20Twilio-10B981?style=for-the-badge" alt="Telephony"/>
  <img src="https://img.shields.io/badge/Currency-INR%20(%E2%82%B9)-F59E0B?style=for-the-badge" alt="INR Currency"/>
</p>

---

## 🌟 Overview

**Infinicall AI** is an enterprise-grade, multi-tenant AI Voice Automation & Telephony SaaS platform engineered specifically for **Indian Regional Languages (Telugu, Hindi, English)** and global business communication.

Provided by **Infiniforge Technologies**, Infinicall AI empowers businesses to create autonomous AI Voice Agents that place and receive real-time telephone calls, handle lead qualification, book appointments, run outbound campaigns, and transfer calls seamlessly to human team members.

---

## ✨ Key Features

### 🇮🇳 Native Indian Voice AI & Sarvam AI Integration
- **Telugu Voice AI**: Native Telugu voices (`Meera (Telugu)`, `Pavithra (Telugu)`, `Arvind (Telugu)`, `Amrutha (Telugu)`) powered by Sarvam AI REST API.
- **Hindi & Regional Accent Support**: Seamless Speech-to-Text (STT) and Text-to-Speech (TTS) synthesis.

### 📱 Dual Telephony Carrier Engine
- **Plivo Telephony**: Native support for Indian phone numbers, low-latency calling, and XML webhooks.
- **Twilio Telephony & SIP Trunking**: Full Twilio integration for global voice streaming and custom SIP trunks.

### 💰 Indian Rupee (₹) Pricing & SaaS Plans
- All pricing, plans, top-up credit packages, and dashboards natively configured in **Indian Rupees (`₹`)** (`₹999`, `₹2999`, `₹9999`).

### 🤖 AI Voice Agent & Workflow Builder
- Interactive visual workflow builder for conversational flow branching.
- Dynamic transfers to human agents, sentiment analysis, call recording, and instant transcripts.

### ⚙️ Centralized Superadmin Configuration Panel
- Unified system settings panel for Sarvam AI Subscription Keys, Plivo Auth IDs, Twilio credentials, and payment gateway configurations.

---

## ⚙️ Tech Stack & Architecture

- **Frontend App**: Next.js 16 (App Router + Turbopack + TailwindCSS + Redux Toolkit + Formik)
- **Backend API**: Node.js + Express + Mongoose + BullMQ + Socket.IO
- **Voice & Telephony**: Sarvam AI (`te-IN`, `hi-IN`), Plivo REST & XML API, Twilio Voice WebSockets, ElevenLabs, OpenAI
- **Database**: MongoDB (Supports Embedded Mongo Memory Server for zero-config local development)

---

## 🚀 Quick Start & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/infinicall-ai.git
cd infinicall-ai
```

### 2. Backend Setup (`autocall-api`)

Navigate to `autocall-api`, install dependencies, and configure environment variables:

```bash
cd autocall-api
npm install
```

Create or verify `.env` inside `autocall-api/.env`:

```env
PORT=5000
NODE_ENV=development
APP_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Database (Leave default for Zero-Config Mongo Memory Server)
MONGODB_URI=mongodb://127.0.0.1:27017/autocall

# Sarvam AI Key (Telugu & Indian Language Voice)
SARVAM_API_KEY=your_sarvam_subscription_key

# Plivo Telephony Credentials
PLIVO_AUTH_ID=your_plivo_auth_id
PLIVO_AUTH_TOKEN=your_plivo_auth_token
PLIVO_PHONE_NUMBER=+91XXXXXXXXXX

# Default Credentials
ADMIN_EMAIL=admin@autocall.ai
ADMIN_PASSWORD=admin123
DEFAULT_USER_EMAIL=user@autocall.ai
DEFAULT_USER_PASSWORD=user123
```

Start the Backend API (Includes Database auto-seeding):

```bash
# Start zero-config dev server with embedded MongoDB
node start-dev-server.js
```

### 3. Frontend Setup (`autocall-next`)

In a new terminal window, navigate to `autocall-next`:

```bash
cd autocall-next
npm install
```

Create or verify `.env.local` inside `autocall-next/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

Start the Frontend dev server:

```bash
npm run dev
```

The application will be accessible at:
- **Frontend Web App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

---

## 🔑 Default Login Credentials

After initial database seeding, you can log in with:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Superadmin** | `admin@autocall.ai` | `admin123` |
| **Demo User** | `user@autocall.ai` | `user123` |

---

## 🌐 Production Deployment Guide

1. **MongoDB Database**: Set `MONGODB_URI` to your production MongoDB Atlas URI.
2. **Domain & SSL/HTTPS**: Configure HTTPS/WSS URLs in `.env` for production webhooks:
   - `APP_URL=https://api.yourdomain.com`
   - `FRONTEND_URL=https://app.yourdomain.com`
3. **PM2 Deployment**:
   ```bash
   npm install -g pm2
   cd autocall-api
   pm2 start server.js --name "infinicall-api"
   ```

---

<p align="center">
  <b>Infinicall AI</b> • Enterprise Voice AI Platform<br/>
  <i>Provided by <b>Infiniforge Technologies</b></i>
</p>
