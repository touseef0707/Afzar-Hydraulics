import { cert, initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const credsString = process.env.FIREBASE_ADMIN_CREDENTIALS!; 
const serviceAccount = JSON.parse(credsString);

const adminApp = getApps()[0] || initializeApp({
  credential: cert(serviceAccount),
});

export const adminAuth = getAuth(adminApp);