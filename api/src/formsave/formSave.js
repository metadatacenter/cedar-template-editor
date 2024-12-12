
import { tidyfyTemplateInstance } from './JsonToArray.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { promisify } from 'util';
import { mkdir } from 'fs/promises'; // Native promise-based fs methods

import { handleExcelUpload } from '../sharepoint/uploadExcel.js'

import { Mailer } from '../mail/mailer.js';
import sanitize from 'sanitize-filename';


// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define path for the responses folder
const RESPONSES_FOLDER = path.join(__dirname, '../../responses');
const JSON_RESPONSES_FOLDER = path.join(__dirname, '../../responses_json');

// Promisify the writeFile method for async/await usage
const writeFileAsync = promisify(fs.writeFile);

// Function to search for the project and investigator
function findProjectAndInvestigator(jsonData) {

    const projectName = jsonData['Project Name']?.['@value'] || '';
    const principalInvestigator = jsonData['IJC_PI_contact_info']?.Name?.['@value'] || '';
   
    return `${projectName}-${principalInvestigator}`;
}

// Function to get current date and time for a filename
function getCurrentDateFilename() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');

    // Format: YYYY-MM-DD_HH-MM-SS
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}

// Function to create directories if they don't exist
async function createFolderIfNotExists(folderPath) {
    try {
        await mkdir(folderPath, { recursive: true });
    } catch (error) {
        console.error('Error creating folder:', error);
    }
}

// Helper function to check if a file exists
async function fileExists(filePath) {
    try {
        await fs.promises.access(filePath);
        return true;
    } catch (error) {
        return false;
    }
}

// Main function to handle form saving
export async function formSave(req, res) {
    const jsonData = req.body;

    // Validate input
    if (!jsonData || !jsonData.instance || !jsonData.template) {
        return res.status(400).json({ message: 'Invalid payload' });
    }

    // Get the current year from the system date
    const currentYear = new Date().getFullYear();
    
    // Create folder path dynamically for JSON responses
    const jsonFolderPath = path.join(JSON_RESPONSES_FOLDER, currentYear.toString());

    // Ensure folders exist
    await createFolderIfNotExists(jsonFolderPath);

    // Save JSON data into the appropriate year folder
    const fileName = sanitize(`${getCurrentDateFilename()}_${findProjectAndInvestigator(jsonData.instance)}`).replaceAll(" ","_");
    const jsonFilePath = path.join(jsonFolderPath, `${fileName}.json`);

    try {
        const content = JSON.stringify(jsonData, null, 2);
        fs.writeFileSync(jsonFilePath, content);
    } catch (err) {
        console.log(err);
    }

    // Transform the JSON object into a format suitable for Excel
    const dataArray = tidyfyTemplateInstance(jsonData.template, jsonData.instance);
    dataArray.values.unshift(dataArray.header);

    // Define the output Excel file path
    const excelFolderPath = path.join(RESPONSES_FOLDER, currentYear.toString());
    const excelFilePath = path.join(excelFolderPath, `${fileName}.xlsx`);
    try {
        // Write the workbook back to the file
        //XLSX.writeFile(workbook, excelFilePath);
        const response = await handleExcelUpload(excelFilePath, dataArray.values);

        // If everithing goes fine, send the email to notify the form submission
        if (response && response.webUrl)
        {
            // Create a new instance of the Mailer class
            const mailer = new Mailer(response.webUrl, response.name);
            
            // Send the emails
            await mailer.sendEmails();            

            if (response.downloadLink)
                res.send(generateResponse(response.downloadLink, response.name));
            else
                res.status(500).send('Failed to process the form.');
        }
        else
            res.status(500).send('Failed to process the form.');
    } catch (error) {
        console.error('Error writing Excel file:', error.message);
        res.status(500).send(error.message);
        res.status
    }
}

// Replace the placeholder in the template with the shareable link
function generateResponse(webUrl, filename) {

    // Load the configuration file
    const templateFile = path.join(__dirname, '../../config/response/response-template.json');  // Fixed path to the template file
    let template = JSON.parse(fs.readFileSync(templateFile, 'utf8')).body;

    // replace the placeholders
    return template.replace('{{link}}', webUrl).replace('{{filename}}', filename);
}