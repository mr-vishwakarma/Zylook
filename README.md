# Zylook

AI-powered outfit commerce platform — a fashion marketplace that sells pre-curated, complete looks instead of individual garments.

## Overview

Zylook replaces the traditional "build your own outfit" shopping experience with a "buy the whole look" model, supported by AI-driven discovery, styling, and personalization.

- **Core Unit**: Outfit combos (e.g. shirt + pant + shoes + accessories) instead of individual SKUs.
- **AI-Powered**: Conversational stylist, visual search, smart recommendations, and size prediction.
- **Discovery-First**: Designed as a feed where browsing naturally leads to purchase.

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js (Vite)                   |
| Backend    | Express.js (Node.js)              |
| Database   | MongoDB (Mongoose)                |
| Cache      | Redis                             |
| AI         | OpenAI / Google Gemini            |
| Payments   | Razorpay                          |
| Storage    | Cloudinary / AWS S3               |

## Project Structure

```
Zylook/
├── client/          # React.js frontend (Vite)
├── server/          # Express.js backend API
├── Implementation/  # Business documents (DOCX)
└── Implementation_MD/  # Business documents (Markdown)
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (optional, for caching)

### Frontend
```bash
cd client
npm install
npm run dev        # → http://localhost:5173
```

### Backend
```bash
cd server
cp .env.example .env   # Configure your environment
npm install
npm run dev            # → http://localhost:5000
```

## License

GPL-3.0
