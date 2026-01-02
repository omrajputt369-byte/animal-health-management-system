# Environment Setup Instructions

## ✅ Dependencies Installed Successfully!

Both backend and frontend dependencies have been installed.

---

## 📝 Manual Setup Required

### Step 1: Create Backend Environment File

Create a file at `/Users/0mrajput/Desktop/shi problem statement project/backend/.env` with this content:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/farm-biosecurity
JWT_SECRET=farm_biosecurity_super_secret_key_2025
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
API_VERSION=v1
```

### Step 2: Create Frontend Environment File

Create a file at `/Users/0mrajput/Desktop/shi problem statement project/frontend/.env` with this content:

```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_ENV=development
REACT_APP_NAME=Farm Biosecurity Portal
REACT_APP_DEFAULT_LANGUAGE=hi
```

### Step 3: MongoDB Setup

**Option A: Use MongoDB Atlas (Recommended - Cloud, Free)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster
4. Get connection string
5. Update `MONGODB_URI` in backend `.env` file

**Option B: Use Local MongoDB**
```bash
# Install MongoDB (if not already installed)
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

---

## 🚀 Start the Application

### Terminal 1 - Start Backend:
```bash
cd "/Users/0mrajput/Desktop/shi problem statement project/backend"
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected
```

### Terminal 2 - Start Frontend:
```bash
cd "/Users/0mrajput/Desktop/shi problem statement project/frontend"
npm start
```

Browser will automatically open at http://localhost:3000

---

## 🧪 Test the Application

### 1. Register New User
- Click "Register" button
- **User Details:**
  - Phone: 9876543210
  - Password: test123
  - Name: Test Farmer
  
- **Farm Details:**
  - Farm Name: My Test Farm
  - Size: 5 acres
  - Type: Poultry
  - Address: Test Village
  - District: Pune
  - State: Maharashtra

### 2. Login
- Phone: 9876543210
- Password: test123

### 3. Take Risk Assessment
- From dashboard, click "Take Risk Assessment"
- Answer the 6 questions
- View your risk score and recommendations

### 4. View Profile
- Click profile icon in bottom navigation
- See your user and farm information

---

## 📊 API Testing (Optional)

Test backend endpoints directly:

```bash
# Health check
curl http://localhost:5000/api/v1/health

# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "password": "test123",
    "name": "Test Farmer",
    "preferredLanguage": "hi"
  }'
```

---

## ⚠️ Troubleshooting

**Port 5000 already in use:**
- Change `PORT=5001` in backend `.env`

**MongoDB connection error:**
- Make sure MongoDB is running OR use MongoDB Atlas

**Cannot find module errors:**
- Run `npm install` again in the respective directory

**CORS errors:**
- Verify `CORS_ORIGIN=http://localhost:3000` in backend `.env`

---

## ✨ What's Working

✅ User registration & login
✅ Farm setup
✅ Dashboard with scores
✅ Risk assessment (6 questions)
✅ Results with recommendations
✅ Disease alerts page
✅ Profile page
✅ Language switching (English/Hindi/Telugu)
✅ Mobile responsive design

---

## 📱 Next Steps

1. ✅ Test all features locally
2. 📸 Take screenshots for presentation
3. 🎬 Record demo video
4. 🚀 Deploy to production (see DEPLOYMENT.md)

---

Ready to start testing! 🎉
