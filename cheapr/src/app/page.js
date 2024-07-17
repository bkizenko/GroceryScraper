'use client';

import { getRestaurants } from "@/lib/firebase/firestore.js";
import { signInWithGoogle, signOut, onAuthStateChanged } from "@/lib/firebase/auth.js";
import { useState, useEffect } from "react";

export const dynamic = "force-dynamic";

export default function Home({ searchParams }) {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchRestaurants();
      }
    });
    return () => unsubscribe();
  }, [searchParams]);

  const fetchRestaurants = async () => {
    const response = await fetch('/api/getAuthenticatedAppForUser');
    const { firebaseServerApp } = await response.json();
    const restaurants = await getRestaurants(firebaseServerApp, searchParams);
    setRestaurants(restaurants);
  };

  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <main className="main__home">
      {user ? (
        <>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={handleSignIn}>Sign In with Google</button>
      )}
    </main>
  );
}
