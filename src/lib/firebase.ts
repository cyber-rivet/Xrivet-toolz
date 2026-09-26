import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export interface FirestoreUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  status: 'active' | 'suspended';
  keysCount?: number;
}

// Sync user to Firestore
export async function syncUserToFirestore(user: FirestoreUser) {
  try {
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt || new Date().toISOString(),
      status: user.status || 'active',
      lastSeenAt: new Date().toISOString()
    }, { merge: true });
    
    // Add audit log
    const logRef = doc(collection(db, 'auditLogs'));
    await setDoc(logRef, {
      id: logRef.id,
      timestamp: new Date().toISOString(),
      action: 'USER_REGISTER_OR_LOGIN',
      user: user.username,
      details: `User ${user.username} (${user.email}) logged in / registered`,
      ip: 'Firestore Client'
    });
  } catch (err) {
    console.error('Error syncing user to Firestore:', err);
  }
}

// Fetch all users from Firestore
export async function fetchFirestoreUsers(): Promise<FirestoreUser[]> {
  try {
    const snap = await getDocs(collection(db, 'users'));
    const users: FirestoreUser[] = [];
    snap.forEach((d) => {
      users.push(d.data() as FirestoreUser);
    });
    return users;
  } catch (err) {
    console.error('Error fetching Firestore users:', err);
    return [];
  }
}
