// src/config/firebase.ts
import admin from 'firebase-admin';
import path  from 'path';
import { readFileSync } from 'fs';

if (!admin.apps.length) {
  const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ??
                 path.resolve('firebase-service-account.json');

  admin.initializeApp({
    credential   : admin.credential.cert(
                     JSON.parse(readFileSync(saPath, 'utf8'))
                   ),
    // use **only** the env var so there is a single source of truth
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}

export const bucket = admin.storage().bucket();
