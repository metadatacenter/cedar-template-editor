import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });


const appSettings = {
    clientId: '4a737836-dd04-4fb1-8dc9-70f1a9f5c431',
    clientSecret: process.env.GRAPH_API_CLIENT_SECRET,
    tenantId: '4c5189e5-293a-45d1-a558-de2a96d6e10e',
};

export default appSettings;