import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "@/lib/firebase/config";

export default function handler(req, res) {
  if (req.method === 'GET') {
    const firebaseServerApp = initializeApp(firebaseConfig);
    const auth = getAuth(firebaseServerApp);
    res.status(200).json({ firebaseServerApp });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}