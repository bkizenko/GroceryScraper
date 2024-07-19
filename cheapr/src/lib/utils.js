import { initializeApp } from "firebase/app";
import { getAuth, getIdToken } from "firebase/auth";
import { getInstallations, getToken } from "firebase/installations";
import { firebaseConfig } from "./firebase/config";

async function fetchWithFirebaseHeaders(request) {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const installations = getInstallations(app);
  const headers = new Headers(request.headers);
  const [authIdToken, installationToken] = await Promise.all([
    getAuthIdToken(auth),
    getToken(installations),
  ]);
  headers.append("Firebase-Instance-ID-Token", installationToken);
  if (authIdToken) headers.append("Authorization", `Bearer ${authIdToken}`);
  const newRequest = new Request(request, { headers });
  return await fetch(newRequest);
}

async function getAuthIdToken(auth) {
  await auth.authStateReady();
  if (!auth.currentUser) return;
  return await getIdToken(auth.currentUser);
}

// Define the functions here
export function getRandomDateBefore() {
    // implementation
}

export function randomNumberBetween() {
    // implementation
}

export function getRandomDateAfter() {
    // implementation
}

// Export functions here
//export { fetchWithFirebaseHeaders, getAuthIdToken, getRandomDateBefore, randomNumberBetween, getRandomDateAfter };
