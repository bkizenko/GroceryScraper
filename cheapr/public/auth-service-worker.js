importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js');

const firebaseConfig = {
  apiKey: "AIzaSyD9sYhslQn18WpnbunFE_6T-Uo4Spb-lzA",
  authDomain: "groceryscraper-a7b4e.firebaseapp.com",
  projectId: "groceryscraper-a7b4e",
  storageBucket: "groceryscraper-a7b4e.appspot.com",
  messagingSenderId: "112621586657",
  appId: "1:112621586657:web:f68a34dc9dc8e00b920fa0"
};

firebase.initializeApp(firebaseConfig);

// Add any additional service worker logic here