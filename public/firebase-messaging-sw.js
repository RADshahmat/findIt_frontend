// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyC7KiurMMpgEaKd_RFo91Hfx-qgAbRQ9EA",
  authDomain: "finditbd-eb770.firebaseapp.com",
  projectId: "finditbd-eb770",
  storageBucket: "finditbd-eb770.firebasestorage.app",
  messagingSenderId: "894438372197",
  appId: "1:894438372197:web:0ad571ec0047589a1c678c",
  measurementId: "G-748NJKW9B1",
  databaseURL: "https://finditbd-eb770-default-rtdb.firebaseio.com",
});

const messaging = firebase.messaging();

// Optional: handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
});
