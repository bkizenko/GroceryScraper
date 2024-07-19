'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  signInWithGoogle,
  signOut,
  onAuthStateChanged
} from "@/lib/firebase/auth"; // Corrected import path
import { addFakeRestaurantsAndReviews } from "@/lib/firebase/firestore";
import { useRouter } from "next/navigation";
import { firebaseConfig } from "@/lib/firebase/config";

// This is a custom hook that manages the user session
function useUserSession(initialUser) {
  const [user, setUser] = useState(initialUser);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    onAuthStateChanged((authUser) => {
      if (user === undefined) return;

      if (user?.email !== authUser?.email) {
        router.refresh();
      }
    });
  }, [user]);

  return user;
}

export default function Header({ initialUser }) {
  const user = useUserSession(initialUser);

  const handleSignOut = event => {
    event.preventDefault();
    signOut();
  };

  const handleSignIn = event => {
    event.preventDefault();
    signInWithGoogle();
  };

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const serializedFirebaseConfig = encodeURIComponent(JSON.stringify(firebaseConfig));
      const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`;
      
      navigator.serviceWorker
        .register(serviceWorkerUrl)
        .then((registration) => console.log("Service Worker registered with scope:", registration.scope))
        .catch((error) => console.error("Service Worker registration failed:", error));
    }
  }, []);

  return (
    <header>
   
      {user ? (
        <div className="profile">
          <p>
            <img className="profileImage" src={user.photoURL || "/profile.svg"} alt={user.email} />
            {user.displayName}
          </p>
          <div className="menu">
            <ul>
              <li>{user.displayName}</li>
              <li>
                <a href="#" onClick={addFakeRestaurantsAndReviews}>
                  Add sample restaurants
                </a>
              </li>
              <li>
                <a href="#" onClick={handleSignOut}>
                  Sign Out
                </a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="profile">
         
        </div>
      )}
    </header>
  );
}
