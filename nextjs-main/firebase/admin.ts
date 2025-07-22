// firebase/firebase-admin.ts (server-side)

import { cert, initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

import * as admin from 'firebase-admin';
// import serviceAccount from './serviceAccount.json';

const credsString = process.env.FIREBASE_ADMIN_CREDENTIALS!; 
const serviceAccount = JSON.parse(credsString);

// Initialize the Firebase Admin app only if it hasn't been initialized already
const adminApp = getApps()[0] || initializeApp({
  credential: cert(serviceAccount),
});

export const adminAuth = getAuth(adminApp);