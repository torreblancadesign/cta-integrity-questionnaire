// api/api.js
import Airtable from 'airtable';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY; // Replace with your actual Airtable API key
const AIRTABLE_BASE_ID = 'app6V96kzHKfSguoS'; // Replace with your actual Airtable base ID
const AIRTABLE_TABLE_NAME = 'Questionnaire Responses'; // Replace with your actual table name

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { fields } = req.body;
      console.log('Fields received for Airtable:', fields);

      // Remove the "fields" key and pass the fields object directly
      const createdRecord = await base(AIRTABLE_TABLE_NAME).create(fields);

      res.status(200).json({
        message: 'Record created successfully!',
        id: createdRecord.id,
      });
    } catch (error) {
      console.error('Error creating record:', error);
      res.status(500).json({
        message: 'Failed to create record.',
        error: error.toString(),
      });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { id, fields } = req.body;
      console.log('Fields for update:', fields);

      // Remove the "fields" key and pass the fields object directly
      const updatedRecord = await base(AIRTABLE_TABLE_NAME).update(id, fields);

      res.status(200).json({
        message: 'Record updated successfully!',
        id: updatedRecord.id,
      });
    } catch (error) {
      console.error('Error updating record:', error);
      res.status(500).json({
        message: 'Failed to update record.',
        error: error.toString(),
      });
    }
  } else {
    res.setHeader('Allow', ['POST', 'PATCH']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
 
