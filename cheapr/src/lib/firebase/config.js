const config = {
  apiKey: "AIzaSyD9sYhslQn18WpnbunFE_6T-Uo4Spb-lzA",
  authDomain: "groceryscraper-a7b4e.firebaseapp.com",
  projectId: "groceryscraper-a7b4e",
  storageBucket: "groceryscraper-a7b4e.appspot.com",
  messagingSenderId: "112621586657",
  appId: "1:112621586657:web:f68a34dc9dc8e00b920fa0"
};

// When deployed, there are quotes that need to be stripped
Object.keys(config).forEach((key) => {
  const configValue = config[key] + "";
  if (configValue.charAt(0) === '"') {
    config[key] = configValue.substring(1, configValue.length - 1);
  }
});

export const firebaseConfig = config;

