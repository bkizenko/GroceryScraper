"use client"; // Mark this file as a Client Component

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; // Corrected import path
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "@/lib/firebase/auth"; // Import the onAuthStateChanged function

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Header initialUser={currentUser?.toJSON()} /> {/* Pass currentUser to Header */}
        {children}
      </body>
    </html>
  );
}
