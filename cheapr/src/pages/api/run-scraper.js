import { exec } from 'child_process';
import path from 'path';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { firebaseConfig } from "@/lib/firebase/config";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  console.log('API route hit', req.method);
  if (req.method === 'POST') {
    const scriptPath = path.join(process.cwd(), 'test.py');
    console.log('Script path:', scriptPath);

    exec(`python "${scriptPath}"`, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        return res.status(500).json({ error: 'Failed to run script', details: error.message });
      }
      if (stderr) {
        console.error(`Script stderr: ${stderr}`);
        return res.status(500).json({ error: 'Script error', details: stderr });
      }
      console.log('Script output:', stdout);
      try {
        const data = JSON.parse(stdout);
        console.log('Parsed data:', data);
        
        // Upload data to Firebase
        const docRef = await addDoc(collection(db, "scraper_results"), data);
        console.log("Document written with ID: ", docRef.id);

        res.status(200).json({ message: 'Script ran successfully', docId: docRef.id });
      } catch (parseError) {
        console.error(`Error parsing script output: ${parseError.message}`);
        console.error('Raw script output:', stdout);
        res.status(500).json({ error: 'Failed to parse script output', details: parseError.message, rawOutput: stdout });
      }
    });
  } else {
    console.log('Method not allowed');
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}