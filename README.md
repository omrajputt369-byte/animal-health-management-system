# Digital Farm Management Portal for Pig & Poultry Biosecurity

A comprehensive Progressive Web App (PWA) for implementing biosecurity measures in pig and poultry farms across India.

## 🎯 Project Overview

This application is developed for the **Ministry of Fisheries, Animal Husbandry & Dairying Hackathon** to address biosecurity challenges in small and marginal livestock farms.

### Key Features

- 🎯 **Risk Assessment Tool** - Customizable questionnaires with actionable recommendations
- 🚨 **Disease Alert System** - Real-time location-based outbreak notifications
- 📊 **Dashboard & Analytics** - Visual farm health metrics and trends
- 📝 **Digital Record Keeping** - Farm diary for daily activities and compliance
- ✅ **Compliance Tracker** - DADF-aligned certification tracking
- 🎓 **Training & Education Hub** - Interactive biosecurity modules

### Technology Stack

**Frontend:**
- React 18 with Hooks
- Redux Toolkit for state management
- Progressive Web App (PWA) with offline support
- i18next for multilingual support (Hindi, English, Telugu)
- Chart.js for data visualization
- Google Maps integration

**Backend:**
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT authentication
- Firebase Cloud Messaging for push notifications
- Cloudinary for image storage

## 📸 Screenshots

### Main Dashboard
<p align="center">
  <img src="screenshots/main.png" alt="Main Dashboard" width="800"/>
</p>

### Login Page - Multilingual Support

<table>
  <tr>
    <td align="center"><b>English</b></td>
    <td align="center"><b>Hindi (हिंदी)</b></td>
  </tr>
  <tr>
    <td><img src="screenshots/english.png" alt="Login - English" width="400"/></td>
    <td><img src="screenshots/hindi.png" alt="Login - Hindi" width="400"/></td>
  </tr>
</table>

### Hindi Interface
<p align="center">
  <img src="screenshots/hindi interface.png" alt="Hindi Interface" width="800"/>
</p>

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)
- Firebase account (free tier)
- Google Maps API key

### Installation

1. **Clone the repository**
```bash
cd "/Users/0mrajput/Desktop/shi problem statement project"
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up Environment Variables**

Create `.env` file in `backend/` directory:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your credentials.

Create `.env` file in `frontend/` directory:
```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env` with your API URLs and keys.

5. **Seed Database (Optional)**
```bash
cd backend
npm run seed
```

6. **Run Development Servers**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

Frontend: http://localhost:3000  
Backend API: http://localhost:5000/api

## 📱 Features

### For Farmers
- Simple registration with farm details
- Risk assessment with immediate feedback
- Disease outbreak alerts for nearby regions
- Digital record-keeping for compliance
- Access to training materials
- Community forum for peer support
- Gamification to encourage engagement

### For Policy Makers
- Aggregated farm data for insights
- Disease surveillance integration
- Compliance tracking across regions
- Analytics dashboard

### Mobile-First Design
- Works on low-end smartphones
- Optimized for 2G/3G networks
- Offline functionality with background sync
- Installable as PWA (no app store needed)
- Large touch targets for easy interaction
- High contrast for outdoor visibility

## 🌍 Multilingual Support

The application supports:
- 🇬🇧 English
- 🇮🇳 Hindi (हिंदी)
- 🇮🇳 Telugu (తెలుగు)

Additional languages can be easily added by creating translation files in `frontend/src/i18n/locales/`

## 📊 Impact Metrics

- **Target Users:** 1,000+ farmers in first 6 months
- **Response Time:** Reduce disease response from 3-5 days to < 24 hours
- **Compliance:** 40% improvement in biosecurity compliance
- **Cost Savings:** ₹50,000-₹1,00,000 per farm annually
- **Data Collection:** Structured data from 10,000+ farms for policy making

## 🏗️ Project Structure

```
farm-biosecurity-portal/
├── backend/
│   ├── config/          # Database, Firebase, Cloudinary config
│   ├── controllers/     # Route controllers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, validation, error handling
│   ├── services/        # Business logic (risk calculation, alerts)
│   ├── data/            # Seed data (questionnaires, checklists)
│   ├── scripts/         # Utility scripts
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static files, PWA manifest, service worker
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store and slices
│   │   ├── utils/       # Helper functions
│   │   ├── i18n/        # Internationalization
│   │   ├── styles/      # Global styles
│   │   └── App.js       # Main app component
│   └── package.json
├── docs/                # Additional documentation
└── README.md
```

## 🔐 Security

- JWT-based authentication with HTTP-only cookies
- Bcrypt password hashing (10 rounds)
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- MongoDB injection prevention
- HTTPS required in production

## 📈 Scalability

The application is designed to scale from hundreds to tens of thousands of users:

- Code splitting and lazy loading
- Database indexing for performance
- CDN for static assets
- Caching layer (Redis ready)
- Horizontal scaling support
- Image optimization via Cloudinary

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run all tests
npm run test:all
```

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for:
- Netlify + Heroku (Recommended)
- Vercel + Railway
- AWS (EC2 + S3)
- Google Cloud Platform

Quick deploy to Heroku (backend):
```bash
cd backend
heroku create farm-biosecurity-api
git push heroku main
```

Quick deploy to Netlify (frontend):
```bash
cd frontend
npm run build
netlify deploy --prod
```

## 📚 Documentation

- [Implementation Plan](docs/implementation_plan.md)
- [Architecture & Design](ARCHITECTURE.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Presentation Deck](PRESENTATION.md)

## 🤝 Contributing

This is a hackathon project for the Ministry of Fisheries, Animal Husbandry & Dairying.

## 📄 License

This project is developed for government use and social impact.

## 👥 Team

Developed for the Ministry of Fisheries, Animal Husbandry & Dairying Hackathon

## 🙏 Acknowledgments

- Ministry of Fisheries, Animal Husbandry & Dairying, Government of India
- Department of Animal Husbandry and Dairying (DADF)
- Indian farmers who provided invaluable feedback
- Open source community

## 📞 Support

For questions or issues:
- Email: support@farmbiosecurity.gov.in
- GitHub Issues: [Project Issues](https://github.com/yourusername/farm-biosecurity-portal/issues)

## 🌟 Demo

**Live Demo:** [Coming Soon]

**Demo Video:** [Coming Soon]

---


