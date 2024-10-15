import Airtable from 'airtable'; // Correct import

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY; // Replace with your actual Airtable API key
const AIRTABLE_BASE_ID = 'app6V96kzHKfSguoS'; // Replace with your actual Airtable base ID
const AIRTABLE_TABLE_NAME = 'Questionnaire Questions & Options'; // Replace with your actual table name

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch the questions, sorted by "Order"
      const records = await base(AIRTABLE_TABLE_NAME)
        .select({
          sort: [{ field: 'Order', direction: 'asc' }], // Sort by "Order"
          fields: ['Field Name', 'Question', 'Order', 'Options', 'Description'] // Add 'Description' field
        })
        .all();

      // Map the records into a simpler format, including Options and Description
      const questions = records.map((record) => ({
        id: record.id,
        fieldName: record.get('Field Name'),
        question: record.get('Question'),
        order: record.get('Order'),
        options: record.get('Options') || [], // Get options or default to an empty array
        description: record.get('Description') || '' // Get description or default to an empty string
      }));

      res.status(200).json({ questions });
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({
        message: 'Failed to fetch questions.',
        error: error.toString(),
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
