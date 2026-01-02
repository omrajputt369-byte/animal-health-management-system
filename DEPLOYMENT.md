# Deployment Guide

## Deployment Options

| Platform | Frontend | Backend | Database | Recommended For |
|----------|----------|---------|----------|-----------------|
| Netlify + Render | ✅ | ✅ | MongoDB Atlas | Free tier, easy setup |
| Vercel + Railway | ✅ | ✅ | MongoDB Atlas | Fast deployments |
| AWS | S3 + CloudFront | EC2/Lambda | DocumentDB | Enterprise scale |
| GCP | Cloud Storage | Cloud Run | MongoDB Atlas | Google ecosystem |

---

## Quick Deploy: Netlify + Render (Recommended)

### Prerequisites
- [Netlify Account](https://netlify.com) (free)
- [Render Account](https://render.com) (free)
- [MongoDB Atlas Account](https://mongodb.com/atlas) (free)
- [Cloudinary Account](https://cloudinary.com) (free)

---

### Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster (M0 Sandbox)
3. Create a database user with password
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/farm-biosecurity
   ```

---

### Step 2: Deploy Backend to Render

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **New** → **Web Service**
4. Connect your GitHub repository
5. Configure:
   - **Name**: `farm-biosecurity-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

6. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<random-32-character-string>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
   CLOUDINARY_API_KEY=<your-api-key>
   CLOUDINARY_API_SECRET=<your-api-secret>
   ```

7. Click **Create Web Service**
8. Note your API URL: `https://farm-biosecurity-api.onrender.com`

---

### Step 3: Deploy Frontend to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **Add new site** → **Import an existing project**
3. Connect your GitHub repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`

5. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://farm-biosecurity-api.onrender.com/api
   REACT_APP_GOOGLE_MAPS_KEY=<your-google-maps-key>
   ```

6. Click **Deploy site**
7. Your site will be live at: `https://your-site.netlify.app`

---

## Alternative: Vercel + Railway

### Backend on Railway

1. Go to [Railway](https://railway.app)
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Set root directory to `backend`
5. Add environment variables (same as Render)
6. Railway will auto-deploy

### Frontend on Vercel

1. Go to [Vercel](https://vercel.com)
2. Click **New Project** → Import from GitHub
3. Set root directory to `frontend`
4. Add environment variables
5. Deploy

---

## Production Checklist

### Security
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS only
- [ ] Configure CORS for your domain only
- [ ] Set up rate limiting
- [ ] Enable MongoDB authentication

### Performance
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Enable database indexing

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure application logging
- [ ] Set up uptime monitoring
- [ ] Enable database monitoring

---

## Environment Variables Reference

### Backend (.env)
```bash
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://...

# Authentication
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRE=30d

# File Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Push Notifications (Optional)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

### Frontend (.env)
```bash
REACT_APP_API_URL=https://your-api.onrender.com/api
REACT_APP_GOOGLE_MAPS_KEY=your-google-maps-key
```

---

## Troubleshooting

### Common Issues

**Backend not starting?**
- Check MongoDB connection string
- Verify all environment variables are set
- Check Render/Railway logs for errors

**Frontend API calls failing?**
- Verify `REACT_APP_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running

**Database connection errors?**
- Whitelist IP in MongoDB Atlas (0.0.0.0/0)
- Check username/password in connection string
- Verify cluster is active

---

## Custom Domain Setup

### Netlify
1. Go to **Domain settings**
2. Add custom domain
3. Update DNS records as instructed

### Render
1. Go to **Settings** → **Custom Domains**
2. Add your domain
3. Update DNS records

---

## Scaling Considerations

For high traffic (10,000+ users):
- Upgrade MongoDB Atlas to M10+
- Use Redis for session caching
- Enable CDN for global distribution
- Consider containerization (Docker)
- Implement load balancing
