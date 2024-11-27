import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAScbdSWoFbZdiSg3fHdyV7hMVhcC-jpAY",
  authDomain: "workflowbuilder-4f0c0.firebaseapp.com",
  projectId: "workflowbuilder-4f0c0",
  storageBucket: "workflowbuilder-4f0c0.firebasestorage.app",
  messagingSenderId: "756148820857",
  appId: "1:756148820857:web:b7cedc78411e7146cdeda8",
  measurementId: "G-1PM3KBNE22"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
git remote add origin <your-github-repo-url>
git add .
git commit -m "Initial commit"
git push -u origin main