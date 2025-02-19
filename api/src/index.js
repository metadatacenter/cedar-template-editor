import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { formSave } from './formsave/formSave.js';
// Import 'performance' API for precise timing
import { performance } from 'perf_hooks';

// Store the original console methods
const originalLog = console.log;
const originalError = console.error;

// Create a custom timestamp formatter
function getTimestamp() {
    return new Date().toISOString(); // e.g., 2024-12-12T12:00:00.000Z
}

// Create a timer to measure elapsed time
const startTime = performance.now();
function elapsedTime() {
    return `${(performance.now() - startTime).toFixed(2)} ms`;
}

// Override console.log
console.log = function (...args) {
    originalLog(`[LOG] [${getTimestamp()}] [Elapsed: ${elapsedTime()}]`, ...args);
};

// Override console.error
console.error = function (...args) {
    originalError(`[ERROR] [${getTimestamp()}] [Elapsed: ${elapsedTime()}]`, ...args);
};

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

