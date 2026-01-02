# Quick Start Guide - Farm Biosecurity Portal

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

**Backend:**
```bash
cd "/Users/0mrajput/Desktop/shi problem statement project/backend"
npm install
```

**Frontend:**
```bash
cd "/Users/0mrajput/Desktop/shi problem statement project/frontend"
npm install
```

### Step 2: Configure Environment

**Backend - Create `.env` file:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with minimal config:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/farm-biosecurity
JWT_SECRET=your_secret_key_here_change_this
CORS_ORIGIN=http://localhost:3000
```

**Frontend - Create `.env` file:**
```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api/v1
```

### Step 3: Start MongoDB (if using local)

```bash
# macOS (if MongoDB installed via Homebrew)
brew services start mongodb-community

# Or use MongoDB Atlas (cloud - recommended)
# Sign up at https://www.mongodb.com/cloud/atlas
# Get connection string and update MONGODB_URI in backend/.env
```

### Step 4: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Step 5: Access the App

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/v1/health

---

## 📱 Test the Application

### 1. Register a New User
1. Go to http://localhost:3000
2. Click "Register"
3. Fill in user details:
   - Phone: 9876543210
   - Password: test123
   - Name: Test Farmer
4. Fill in farm details:
   - Farm Name: Test Poultry Farm
   - Size: 5 acres
   - Type: Poultry
   - Location: Pune, Maharashtra

### 2. Take Risk Assessment
1. From dashboard, click "Take Risk Assessment"
2. Answer 6 biosecurity questions
3. View your risk score and recommendations

### 3. View Disease Alerts
1. Click on "Disease Alerts" in bottom navigation
2. See nearby outbreaks (if MongoDB has sample data)

---

## 🔧 Troubleshooting

**Port already in use:**
```bash
# Change port in backend/.env
PORT=5001
```

**MongoDB connection error:**
- Make sure MongoDB is running OR
- Use MongoDB Atlas connection string

**Module not found errors:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

---

## ✅ What's Working

✅ User registration with farm setup
✅ User login/logout
✅ Dashboard with biosecurity scores
✅ Risk Assessment questionnaire (6 questions)
✅ Risk results with recommendations
✅ Disease alerts page
✅ Profile page
✅ Multilingual (English, Hindi, Telugu)
✅ Responsive mobile design
✅ PWA configuration

---

## 📦 Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions to:
- Netlify (frontend) + Heroku (backend)
- Vercel + Railway
- AWS

---

## 🎬 Demo for Hackathon

**5-Minute Demo Script:**

1. **Show Homepage** (30sec)
   - Explain problem and solution

2. **Register User** (1min)
   - Create account with farm details
   - Show bilingual support

3. **Risk Assessment** (2min)
   - Complete questionnaire
   - Show calculated risk score
   - Display prioritized recommendations

4. **Dashboard** (1min)
   - Biosecurity score visualization
   - Active disease alerts
   - Quick actions

5. **Disease Alerts** (30sec)
   - Show location-based alerts
   - Action requirements

**Total: 5 minutes** ✨

---

For complete documentation, see [walkthrough.md](/Users/0mrajput/.gemini/antigravity/brain/04f7d8b7-7105-42fd-b91d-c764ef337d38/walkthrough.md)
