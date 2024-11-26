import { keyInSelect } from 'readline-sync';


import {
    initializeGraphForAppOnlyAuth,
    getAppOnlyTokenAsync,
    getUsersAsync,
    makeGraphCallAsync,
} from './graphHelper.js';


// Main function
async function main() {

    console.log('JavaScript Graph App-Only Tutorial');

    let choice = 0;

    // Initialize Graph
    initializeGraph(settings);

    // Display access token
    await displayAccessTokenAsync();
    
    //await listUsersAsync();
    
    await doGraphCallAsync();
    
/*
    try {
        const accessToken = await authenticate();
        const content = "Updated content";
        await updateFile(content);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
*/
}

// Execute main function
main();


function initializeGraph(settings) {
    initializeGraphForAppOnlyAuth(settings);
}

async function displayAccessTokenAsync() {
    try {
        const appOnlyToken = await getAppOnlyTokenAsync();
        console.log(`App-only token: ${appOnlyToken}`);
    } catch (err) {
        console.log(`Error getting app-only access token: ${err}`);
    }
}

async function listUsersAsync() {
    try {
        const userPage = await getUsersAsync();
        const users = userPage.value;

        // Output each user's details
        for (const user of users) {
            console.log(`User: ${user.displayName ?? 'NO NAME'}`);
            console.log(`  ID: ${user.id}`);
            console.log(`  Email: ${user.mail ?? 'NO EMAIL'}`);
        }

        // If @odata.nextLink is not undefined, there are more users
        // available on the server
        const moreAvailable = userPage['@odata.nextLink'] != undefined;
        console.log(`\nMore users available? ${moreAvailable}`);
    } catch (err) {
        console.log(`Error getting users: ${err}`);
    }
}

async function doGraphCallAsync() {
    try {
        await makeGraphCallAsync();
    } catch (err) {
        console.log(`Error making Graph call: ${err}`);
    }
}