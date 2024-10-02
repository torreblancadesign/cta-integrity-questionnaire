import Airtable from 'airtable';

const AIRTABLE_API_KEY = 'patouN6Gr3y651ydi.3643964e3a5852adb6ad1ed36d63ec7ad9019beda6a2f20673ac4bcd021e86af'; // Replace with your actual Airtable API key
const AIRTABLE_BASE_ID = 'app6V96kzHKfSguoS'; // Replace with your actual Airtable base ID
const AIRTABLE_TABLE_NAME = 'Questionnaire Responses'; // Replace with your Airtable Table name

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Missing record ID' });
  }

  try {
    // Fetch the record with the provided record ID
    const record = await base(AIRTABLE_TABLE_NAME).find(id);
    
    // Get the "Logic" field value from the record
    const logic = record.get('Logic');

    if (!logic) {
      return res.status(404).json({ message: 'Logic field not found' });
    }

    // Respond with the value of the "Logic" field
    res.status(200).json({ logic });
  } catch (error) {
    console.error('Error fetching record:', error);
    res.status(500).json({ message: 'Failed to fetch Logic field', error: error.toString() });
  }
}
