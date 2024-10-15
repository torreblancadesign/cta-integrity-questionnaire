import Airtable from 'airtable';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY; // Replace with your actual Airtable API key
const AIRTABLE_BASE_ID = 'app6V96kzHKfSguoS'; // Replace with your actual Airtable base ID
const AIRTABLE_TABLE_NAME = 'Results End Pages'; // Replace with your table name

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  const { pageName } = req.query; // Expecting "pageName" to be passed as a query parameter

  if (!pageName) {
    return res.status(400).json({ message: 'Page name is required.' });
  }

  try {
    const records = await base(AIRTABLE_TABLE_NAME)
      .select({
        filterByFormula: `{Page Name} = "${pageName}"`, // Match the "Page Name"
        maxRecords: 1
      })
      .all();

    if (records.length === 0) {
      return res.status(404).json({ message: 'Results page not found.' });
    }

    const record = records[0];
    const resultsPage = {
      resultsText: record.get('Results Text'),
      buttonName: record.get('Button Name'),
      buttonLink: record.get('Button Link')
    };

    res.status(200).json(resultsPage);
  } catch (error) {
    console.error('Error fetching results page:', error);
    res.status(500).json({ message: 'Failed to fetch results page.', error: error.toString() });
  }
}
