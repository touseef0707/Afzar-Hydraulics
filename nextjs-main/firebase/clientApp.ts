import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, set, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};
  
// Initialize Firebase
let app: FirebaseApp;
let auth: ReturnType<typeof getAuth>;
let googleProvider: GoogleAuthProvider;
let database: ReturnType<typeof getDatabase>;
let onValue: ReturnType<typeof getDatabase>;
let off: ReturnType<typeof getDatabase>;

if (typeof window !== "undefined") {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  database = getDatabase(app);
}
export { auth, googleProvider , database, ref, set, onValue, off};

// Sanitize function to remove undefineds
const sanitizeForFirebase = (data: any): any => {
  if (Array.isArray(data)) return data.map(sanitizeForFirebase)
  if (data && typeof data === 'object') {
    const result: { [key: string]: any } = {}
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== undefined) {
        result[key] = sanitizeForFirebase(data[key])
      }
    }
    return result
  }
  return data
}

// Save params under flows/{flowId}/nodes/{nodeId}/data/params
export async function saveNodeParams(flowId: string, nodeId: string, params: object) {
  const formattedFlowId = "fid_" + flowId.replace(/^-/, '')
  const paramsPath = `flows/${formattedFlowId}/nodes/${nodeId}/data/params`
  const sanitized = sanitizeForFirebase(params)
  await set(ref(database, paramsPath), sanitized)
}

// Load params from flows/{flowId}/nodes/{nodeId}/data/params
export async function loadNodeParams(flowId: string, nodeId: string) {
  const formattedFlowId = "fid_" + flowId.replace(/^-/, '')
  const paramsPath = `flows/${formattedFlowId}/nodes/${nodeId}/data/params`
  const snapshot = await get(ref(database, paramsPath))
  if (snapshot.exists()) return snapshot.val()
  return null
}
