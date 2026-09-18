import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { app, db, auth } from '../firebase';
import firebaseConfig from '../../firebase-applet-config.json';

export { app, db, auth, firebaseConfig };
export type { FirebaseApp, Firestore, Auth };
export default app;
