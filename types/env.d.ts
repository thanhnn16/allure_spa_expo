declare namespace NodeJS {
  interface ProcessEnv {
    ZALO_CLIENT_ID: string;
    ZALO_CLIENT_SECRET: string;
    GEMINI_API_KEY: string;
    OPEN_WEATHER_API_KEY: string;
    FIREBASE_API_KEY: string;
    FIREBASE_AUTH_DOMAIN: string;
    FIREBASE_PROJECT_ID: string;
    FIREBASE_STORAGE_BUCKET: string;
    FIREBASE_MESSAGING_SENDER_ID: string;
    FIREBASE_APP_ID: string;
    FIREBASE_MEASUREMENT_ID: string;
  }
}
