// pages/api/questionnaire.js

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Ideally, validate and process the data here, then save it to a database or store
    console.log('Data received:', req.body);

    // For demo, simulate successful data handling
    res.status(200).json({ message: 'Question answered successfully', data: req.body });
  } else {
    // Handle any other HTTP method, like GET
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
 