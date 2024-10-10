// firebaseService.ts
import { initializeApp, getApps, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDLAR58XAtHaXKhHJ_J15Kg_TOklESPBiw",
  authDomain: "allure-spa-app.firebaseapp.com",
  projectId: "allure-spa-app",
  storageBucket: "allure-spa-app.appspot.com",
  messagingSenderId: "150739207719",
  appId: "1:150739207719:web:xxxxxxxxxxxxxxxx",
  measurementId: "G-xxxxxxxxxx"
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const auth = getAuth();
