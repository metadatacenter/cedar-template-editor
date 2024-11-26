import settings from './appSettings.js';
import axios from 'axios';
import readline from 'readline';

// Configure the readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

/// Function to get credentials
const getCredentials = () => {
    return new Promise((resolve) => {
        rl.question('Enter your Azure username: ', (username) => {
            rl.stdoutMuted = true; // Mute the output
            rl.question('Enter your Azure password: ', (password) => {
                rl.stdoutMuted = false; // Unmute the output
                rl.close();
                resolve({ username, password });
            });
            rl._writeToOutput = (char) => {
                // Hide the password input
                if (rl.stdoutMuted) {
                    rl.output.write('*'); // Display asterisks instead of actual characters
                } else {
                    rl.output.write(char);
                }
            };
        });
    });
};

// Function to grant access
const grantAccess = async (username, password, siteId, appId) => {
    try {
        // Obtain an access token (replace with your token endpoint and scope)
        const tokenResponse = await axios.post(`https://login.microsoftonline.com/4c5189e5-293a-45d1-a558-de2a96d6e10e/oauth2/v2.0/token`, new URLSearchParams({
            grant_type: 'password',
            username: username,
            password: password,
            client_id: `${settings.clientId}`,
            client_secret: `${settings.clientSecret}`,
            scope: 'https://graph.microsoft.com/.default',
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const accessToken = tokenResponse.data.access_token;

        // Grant the app access to the SharePoint site
        const response = await axios.post(
            `https://graph.microsoft.com/v1.0/sites/${siteId}/permissions`,
            {
                "@odata.type": "#microsoft.graph.permission",
                "grantedToIdentities": [
                    {
                        "application": {
                            "id": appId
                        }
                    }
                ],
                "roles": ["read"], // or "write" or other permissions as needed
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Access granted:', response.data);
    } catch (error) {
        console.error('Error granting access:', error.response ? error.response.data : error.message);
    }
};

// Main function to run the script
const main = async () => {
    const { username, password } = await getCredentials();
    const siteId = 'bioforms'; // Use the site ID of your SharePoint site
    const appId = '4a737836-dd04-4fb1-8dc9-70f1a9f5c431'; // The application ID of your Entra app

    await grantAccess(username, password, siteId, appId);
};

main();
