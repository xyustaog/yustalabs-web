// Vercel Serverless Function: /api/firebase-config
// Devuelve la config de Firebase desde env vars de Vercel.
// Las env vars se configuran en: vercel.com → Project → Settings → Environment Variables
//
// Variables necesarias:
//   FIREBASE_API_KEY
//   FIREBASE_AUTH_DOMAIN
//   FIREBASE_PROJECT_ID
//   FIREBASE_STORAGE_BUCKET
//   FIREBASE_MESSAGING_SENDER_ID
//   FIREBASE_APP_ID

export default function handler(req, res) {
  // Cache 5 min para no gastar invocaciones
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  const missing = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID',
  ].filter((k) => !process.env[k]);

  if (missing.length) {
    return res.status(500).json({
      error: 'Missing env vars',
      missing,
    });
  }

  return res.status(200).json({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  });
}
