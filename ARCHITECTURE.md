# Architecture & Design

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    React PWA Frontend                    │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │Dashboard │ │   Risk   │ │  Alerts  │ │Compliance│   │    │
│  │  │   Page   │ │Assessment│ │   Page   │ │  Tracker │   │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────────┐   │    │
│  │  │              Redux Toolkit Store                 │   │    │
│  │  │  auth │ farm │ assessment │ alerts │ compliance │   │    │
│  │  └─────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTPS/REST API
┌─────────────────────────────────────────────────────────────────┐
│                         SERVER LAYER                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   Express.js Backend                     │    │
│  │                                                         │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │   Auth   │ │   Farm   │ │Assessment│ │  Alerts  │   │    │
│  │  │Controller│ │Controller│ │Controller│ │Controller│   │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────────┐   │    │
│  │  │              Middleware Layer                    │   │    │
│  │  │    JWT Auth │ Validation │ Error Handling       │   │    │
│  │  └─────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                               │
│  ┌──────────────────────┐    ┌──────────────────────┐          │
│  │      MongoDB         │    │     Cloudinary       │          │
│  │  ┌────────────────┐  │    │  (Image Storage)     │          │
│  │  │ Users          │  │    └──────────────────────┘          │
│  │  │ Farms          │  │                                       │
│  │  │ Assessments    │  │    ┌──────────────────────┐          │
│  │  │ Alerts         │  │    │      Firebase        │          │
│  │  │ Compliance     │  │    │  (Push Notifications)│          │
│  │  └────────────────┘  │    └──────────────────────┘          │
│  └──────────────────────┘                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: ['farmer', 'admin', 'vet'],
  language: ['en', 'hi', 'te'],
  createdAt: Date
}
```

### Farm Model
```javascript
{
  owner: ObjectId (User),
  name: String,
  type: ['cattle', 'poultry', 'mixed'],
  location: {
    address: String,
    coordinates: [Number]
  },
  size: Number,
  animalCount: Number,
  createdAt: Date
}
```

### Risk Assessment Model
```javascript
{
  farm: ObjectId (Farm),
  user: ObjectId (User),
  responses: [{
    questionId: String,
    answer: String,
    score: Number
  }],
  totalScore: Number,
  riskLevel: ['low', 'medium', 'high', 'critical'],
  recommendations: [String],
  completedAt: Date
}
```

### Disease Alert Model
```javascript
{
  title: String,
  description: String,
  disease: String,
  severity: ['low', 'medium', 'high', 'critical'],
  affectedArea: {
    region: String,
    coordinates: [Number],
    radius: Number
  },
  source: String,
  isActive: Boolean,
  createdAt: Date
}
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Farm Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/farms` | Get user's farms |
| POST | `/api/farms` | Create new farm |
| PUT | `/api/farms/:id` | Update farm |
| DELETE | `/api/farms/:id` | Delete farm |

### Risk Assessment
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assessments` | Get assessments |
| POST | `/api/assessments` | Submit assessment |
| GET | `/api/assessments/:id` | Get specific assessment |

### Disease Alerts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts` | Get all alerts |
| GET | `/api/alerts/nearby` | Get nearby alerts |
| POST | `/api/alerts` | Create alert (admin) |

### Compliance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/compliance` | Get compliance data |
| POST | `/api/compliance` | Update compliance |
| GET | `/api/compliance/checklist` | Get checklist |

---

## Security Architecture

```
┌────────────────────────────────────────────┐
│              Security Layers                │
├────────────────────────────────────────────┤
│  1. HTTPS/TLS Encryption                   │
│  2. JWT Token Authentication               │
│  3. Password Hashing (bcrypt, 10 rounds)   │
│  4. Rate Limiting (100 req/15min)          │
│  5. Input Validation & Sanitization        │
│  6. CORS Configuration                     │
│  7. HTTP-Only Cookies                      │
│  8. MongoDB Injection Prevention           │
└────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Component Hierarchy
```
App
├── Layout
│   ├── Header (with language switcher)
│   └── BottomNav
├── Pages
│   ├── HomePage
│   ├── LoginPage
│   ├── RegisterPage
│   ├── DashboardPage
│   ├── RiskAssessmentPage
│   ├── DiseaseAlertsPage
│   ├── CompliancePage
│   └── ProfilePage
└── Store (Redux)
    ├── authSlice
    ├── farmSlice
    ├── assessmentSlice
    ├── alertSlice
    └── complianceSlice
```

### State Management Flow
```
User Action → Dispatch Action → Redux Thunk → API Call → Update Store → Re-render
```

---

## Offline Strategy

1. **Service Worker**: Caches static assets and API responses
2. **IndexedDB**: Stores user data for offline access
3. **Background Sync**: Queues actions when offline, syncs when online
4. **Optimistic Updates**: UI updates immediately, syncs in background
