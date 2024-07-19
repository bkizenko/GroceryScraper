'use client';

import { signInWithGoogle, signOut, onAuthStateChanged } from "@/lib/firebase/auth.js";
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseConfig } from "@/lib/firebase/config";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const dynamic = "force-dynamic";

export default function Home({ searchParams }) {
  const [user, setUser] = useState(null);
  const [scraperOutput, setScraperOutput] = useState('');
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [searchParams]);

  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const runScraper = async () => {
    try {
      console.log('Attempting to fetch from /api/run-scraper');
      const response = await fetch('/api/run-scraper', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response received:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Data received:', data);
      
      // Fetch results from Firebase
      const docRef = doc(db, "scraper_results", data.docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setScraperOutput(JSON.stringify(docSnap.data(), null, 2));
      } else {
        setScraperOutput("No such document!");
      }
    } catch (error) {
      console.error('Error running scraper:', error);
      setScraperOutput(`Error: ${error.message}`);
    }
  };

  const handleButtonClick = async () => {
    try {
      const res = await fetch('/api/trigger-function', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'value' }), // Add any data you want to send to the function
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error triggering function:', error);
      setResponse({ error: error.message });
    }
  };

  return (
    <main className="main__home">
      {user ? (
        <>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <>
          <button onClick={handleSignIn}>Sign In with Google</button>
          <p>User is not signed in</p>
        </>
      )}
      <button onClick={runScraper}>Run Scraper</button>
      {scraperOutput && <pre>{scraperOutput}</pre>}
      <div>
        <button onClick={handleButtonClick}>Trigger Function</button>
      </div>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </main>
  );
}
