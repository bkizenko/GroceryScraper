'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
	signInWithGoogle,
	signOut,
	onAuthStateChanged
} from "@/src/lib/firebase/auth.js";
import { addFakeRestaurantsAndReviews } from "@/src/lib/firebase/firestore.js";
import { useRouter } from "next/navigation";
import { firebaseConfig } from "@/src/lib/firebase/config";

// This is a custom hook that manages the user session
function useUserSession(initialUser) {
	// The initialUser comes from the server via a server component
	const [user, setUser] = useState(initialUser); // Initialize state with the initial user
	const router = useRouter(); // Get the Next.js router instance

	// Register the service worker that sends auth state back to server
	// The service worker is built with npm run build-service-worker
	useEffect(() => {
		// Check if the browser supports service workers
		if ("serviceWorker" in navigator) {
			// Serialize the Firebase config to be used as a query parameter
			const serializedFirebaseConfig = encodeURIComponent(JSON.stringify(firebaseConfig));
			// Construct the service worker URL with the serialized Firebase config
			const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`;
			
			// Register the service worker
			navigator.serviceWorker
				.register(serviceWorkerUrl)
				.then((registration) => console.log("scope is: ", registration.scope)); // Log the scope of the registered service worker
		}
	}, []); // Empty dependency array ensures this effect runs only once on mount

	useEffect(() => {
			const unsubscribe = onAuthStateChanged((authUser) => {
					setUser(authUser)
				})

			return () => unsubscribe()
			// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
			onAuthStateChanged((authUser) => {
					if (user === undefined) return

					// refresh when user changed to ease testing
					if (user?.email !== authUser?.email) {
							router.refresh()
					}
			})
			// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	return user;
}

export default function Header({initialUser}) {

	const user = useUserSession(initialUser) ;

	const handleSignOut = event => {
		event.preventDefault();
		signOut();
	};

	const handleSignIn = event => {
		event.preventDefault();
		signInWithGoogle();
	};

	return (
		<header>
			<Link href="/" className="logo">
				<img src="/friendly-eats.svg" alt="FriendlyEats" />
				Friendly Eats
			</Link>
			{user ? (
				<>
					<div className="profile">
						<p>
							<img className="profileImage" src={user.photoURL || "/profile.svg"} alt={user.email} />
							{user.displayName}
						</p>

						<div className="menu">
							...
							<ul>
								<li>{user.displayName}</li>

								<li>
									<a
										href="#"
										onClick={addFakeRestaurantsAndReviews}
									>
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
				</>
			) : (
				<div className="profile"><a href="#" onClick={handleSignIn}>
					<img src="/profile.svg" alt="A placeholder user image" />
					Sign In with Google
				</a></div>
			)}
		</header>
	);
}