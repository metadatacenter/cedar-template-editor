import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { formSave } from './formsave/formSave.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define path for templates folder
const TEMPLATES_FOLDER = path.join(__dirname, '../templates');

// Increase the limit for JSON requests to 50MB
app.use(bodyParser.json({ limit: '50mb' }));  // for JSON data
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));  // for form data


// Serve static files from the templates folder
app.use('/templates', express.static(TEMPLATES_FOLDER));

// API endpoint to save form data as an Excel file
app.get('/users', async (req, res) => {
    formSave(req, res);
});

// API endpoint to save form data as an Excel file
app.post('/api/formsave', async (req, res) => {
    formSave(req, res);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

