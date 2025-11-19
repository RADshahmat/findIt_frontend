import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC7KiurMMpgEaKd_RFo91Hfx-qgAbRQ9EA",
  authDomain: "finditbd-eb770.firebaseapp.com",
  projectId: "finditbd-eb770",
  storageBucket: "finditbd-eb770.firebasestorage.app",
  messagingSenderId: "894438372197",
  appId: "1:894438372197:web:0ad571ec0047589a1c678c",
  measurementId: "G-748NJKW9B1",
  databaseURL: "https://finditbd-eb770-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);

let messaging = null;
if ('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
  try {
    messaging = getMessaging(app);
    console.log("Firebase messaging initialized");
  } catch (err) {
    console.error("FCM init error:", err);
  }
} else {
  console.warn("Web push notifications not supported in this browser.");
}

export { messaging };
