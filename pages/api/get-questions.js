import Airtable from 'airtable'; // Correct import

const AIRTABLE_API_KEY = 'patouN6Gr3y651ydi.3643964e3a5852adb6ad1ed36d63ec7ad9019beda6a2f20673ac4bcd021e86af'; // Replace with your actual Airtable API key
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
        })
        .all();

      // Map the records into a simpler format
      const questions = records.map((record) => ({
        id: record.id,
        fieldName: record.get('Field Name'),
        question: record.get('Question'),
        order: record.get('Order'),
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
