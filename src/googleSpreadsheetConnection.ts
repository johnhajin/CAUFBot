import { usernameMapping } from "./settings/usernameTranslate.js"; // Adjust the path as needed
import { google } from 'googleapis';
import path from 'path';

// Load the service account key JSON file.
const keyFilePath = path.resolve(__dirname, '../src/settings/credentials.json'); // Path to your service account file
const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// Initialize Google Sheets API
const sheets = google.sheets({ version: 'v4', auth });

async function updateUserNameMapping() : Promise<void>{
  const spreadsheetId = '1qJCJJY5Z5pxBW6Pvdm10BTa6wHUFT8DbYYsDQez9q9M'; // Replace with your spreadsheet ID
  const range = 'Sheet1!A:B';  // Adjust range to include only columns A and B

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    // Ensure that values is not null or undefined
    const rows = response.data.values || [];

    if (rows.length) {
      rows.forEach((row) => {
        const [discordId, mappingValue] = row;
        if (discordId && mappingValue) {
          usernameMapping[discordId] = mappingValue;
        }
      });

      console.log('Username Mapping:', usernameMapping);
    } else {
      console.log('No data found.');
    }
  } catch (err) {
    console.error('The API returned an error:', err);
  }
}

export {
    updateUserNameMapping
};
