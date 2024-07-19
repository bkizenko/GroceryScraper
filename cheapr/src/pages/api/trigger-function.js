import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await axios.post('https://us-central1-groceryscraper-a7b4e.cloudfunctions.net/articles', req.body);
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error calling Firebase function:', error);
      res.status(500).json({ error: 'Failed to call Firebase function', details: error.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}