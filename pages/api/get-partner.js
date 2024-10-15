import Airtable from 'airtable'; // Correct import

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY; // Replace with your actual Airtable API key
const AIRTABLE_BASE_ID = 'app6V96kzHKfSguoS'; // Replace with your actual Airtable base ID
const AIRTABLE_PARTNER_TABLE = 'Partners'; // Replace with your actual table name

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  const { id } = req.query; // Get the id from the query parameters

  if (!id) {
    return res.status(400).json({ message: "Missing id parameter" });
  }

  try {
    // Query the Airtable "Partners" table for the record matching the "ID" field
    const records = await base(AIRTABLE_PARTNER_TABLE)
      .select({
        filterByFormula: `{ID} = '${id}'`, // Match the ID field in Airtable
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) {
      return res.status(404).json({ message: "Partner not found" });
    }

    const partner = {
      partnerName: records[0].get('Partner Name'),
      logo: records[0].get('Logo') // Assuming this is the field for the logo
    };

    res.status(200).json(partner);
  } catch (error) {
    console.error('Error fetching partner:', error);
    res.status(500).json({ message: 'Failed to fetch partner', error: error.toString() });
  }
}
