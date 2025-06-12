# TalentLink

TalentLink is a comprehensive web platform that connects skilled individuals with real-time opportunities like internships, projects, and mentorships. Built with modern web technologies, it offers smart matching, personalized feeds, and seamless mentor connections.

## 🚀 Features

### 🔧 Core Functionality
- Social Feed System: Create posts, like, comment, and engage with the community
- Job Portal: Browse and apply for jobs with advanced filtering
- Course Management: Discover and enroll in courses offered by mentors
- Mentor Connections: Connect with industry professionals and mentors
- User Profiles: Comprehensive profile management with role-based features

### 👥 User Roles
- Users: General community members seeking opportunities
- Mentors: Industry professionals offering guidance and courses
- Organizations: Companies posting jobs and opportunities

## 🛠 Requirements
- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)
- Firebase account
- Git

## 📦 Installation

### 1. Clone the Repository
```bash
git clone [repository-url]
cd TalentLink
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Setup

#### a. Create a new Firebase project
- Visit [Firebase Console](https://console.firebase.google.com)
- Click "Add Project" and follow the setup wizard

#### b. Enable Authentication methods
- Go to Authentication > Sign-in methods
- Enable Email/Password and Google Sign-in
- Add authorized domains

#### c. Create Firestore Database
- Navigate to Firestore Database
- Click "Create Database"
- Start in Production mode
- Select a location

#### d. Set up Firebase Configuration
Create a file at `src/firebase/config.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### 4. Environment Setup
Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 5. Firestore Security Rules
Update `firestore.rules`:

<details>
<summary>Click to expand Firebase rules</summary>

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /jobs/{jobId} {
      allow read: if true;
      allow create: if request.auth != null &&
                   request.resource.data.organizationId == request.auth.uid &&
                   request.resource.data.isActive == true;
      allow update, delete: if request.auth != null &&
                           resource.data.organizationId == request.auth.uid;
    }

    match /courses/{courseId} {
      allow read: if true;
      allow create: if request.auth != null &&
                   request.resource.data.mentorId == request.auth.uid &&
                   request.resource.data.isActive == true;
      allow update, delete: if request.auth != null &&
                           resource.data.mentorId == request.auth.uid;
    }

    match /enrollments/{enrollmentId} {
      allow read: if request.auth != null &&
                 (resource.data.studentId == request.auth.uid ||
                  resource.data.mentorId == request.auth.uid);
      allow create: if request.auth != null &&
                   request.resource.data.studentId == request.auth.uid;
      allow update: if request.auth != null &&
                   (resource.data.studentId == request.auth.uid ||
                    resource.data.mentorId == request.auth.uid);
    }

    match /mentors/{mentorId} {
      allow read, write: if request.auth != null;
    }

    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null &&
                   request.resource.data.authorId == request.auth.uid &&
                   request.resource.data.isActive == true;
      allow update, delete: if request.auth != null &&
                           resource.data.authorId == request.auth.uid;
    }

    match /applications/{applicationId} {
      allow read, write: if request.auth != null;
    }

    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
</details>

## 🧪 Running the Project

### Development Mode
```bash
npm run dev
```
Runs the app in development mode at: 📍 http://localhost:5173

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
│   └── AuthContext.jsx
├── firebase/           # Firebase config and services
│   ├── config.js
│   ├── postService.js
│   ├── jobService.js
│   └── courseService.js
├── pages/              # Page components
│   ├── Feed/
│   ├── Jobs/
│   ├── Courses/
│   ├── Profile/
│   └── ...
└── utils/              # Utility functions
```

## 🔒 Authentication Flow

### 1. User Registration
- Email/Password registration
- Google Sign-in
- Profile completion required after signup

### 2. Role-Based Access
- Users: Access to feed, jobs, and courses
- Mentors: Can create courses and offer mentorship
- Organizations: Can post jobs and manage applications

### 3. Protected Routes
- Authentication required for posting
- Role-specific feature access
- Secure data handling via Firestore rules

## 🎨 Styling
The project uses:
- Material UI components
- Tailwind CSS for utility styling
- Custom CSS Modules where needed

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## 📧 Contact
Feel free to reach out with any questions or support needs:
- 📨 ntavishek@gmail.com
- 📨 rrabir9815@gmail.com
- 📨 sushilchlgn@gmail.com
- 📨 missansu8@gmail.com

---

Built with ❤️ using React, Firebase, and modern web technologies  
Team: PUSAT