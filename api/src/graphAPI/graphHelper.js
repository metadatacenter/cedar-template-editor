import 'node-fetch'
import { ClientSecretCredential, DeviceCodeCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
// prettier-ignore
import { TokenCredentialAuthenticationProvider } from
    '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js';

import appSettings from './appSettings.js';    

let _settings = undefined;
let _clientSecretCredential = undefined;
let _appClient = undefined;
let _deviceCodeCredential = undefined;
let _userClient = undefined;



export function initializeGraphForUserAuth(deviceCodePrompt) {
    // Ensure settings isn't null
    if (!appSettings) {
        throw new Error('Settings cannot be undefined');
    }

    _settings = appSettings;

    _deviceCodeCredential = new DeviceCodeCredential({
        clientId: settings.clientId,
        tenantId: settings.tenantId,
        userPromptCallback: deviceCodePrompt,
    });

    const authProvider = new TokenCredentialAuthenticationProvider(
        _deviceCodeCredential,
        {
            scopes: settings.graphUserScopes,
        },
    );

    _userClient = Client.initWithMiddleware({
        authProvider: authProvider,
    });
}

export function initializeGraphForAppOnlyAuth() {
    // Ensure settings isn't null
    if (!appSettings) {
        throw new Error('Settings cannot be undefined');
    }

    _settings = appSettings;

    // Ensure settings isn't null
    if (!_settings) {
        throw new Error('Settings cannot be undefined');
    }

    if (!_clientSecretCredential) {
        _clientSecretCredential = new ClientSecretCredential(
            _settings.tenantId,
            _settings.clientId,
            _settings.clientSecret,
        );
    }

    if (!_appClient) {
        const authProvider = new TokenCredentialAuthenticationProvider(
            _clientSecretCredential,
            {
                scopes: ['https://graph.microsoft.com/.default'],
            },
        );

        _appClient = Client.initWithMiddleware({
            authProvider: authProvider,
        });
    }
}


export async function getAppOnlyTokenAsync() {
    // Ensure credential isn't undefined
    if (!_clientSecretCredential) {
        throw new Error('Graph has not been initialized for app-only auth');
    }

    // Request token with given scopes
    const response = await _clientSecretCredential.getToken([
        'https://graph.microsoft.com/.default',
    ]);
    return response.token;
}

export async function getUsersAsync() {
    // Ensure client isn't undefined
    if (!_appClient) {
        throw new Error('Graph has not been initialized for app-only auth');
    }

    return _appClient
        ?.api('/users')
        .select(['displayName', 'id', 'mail'])
        .top(25)
        .orderby('displayName')
        .get();
}


export async function makeGraphCallAsync() { 
    await updateFile();
}

// Function to sent a get request
export async function graphGet(url, headers) {
    
    return _appClient
        ?.api(url)
        .headers(headers)
        .responseType("raw")
        .get();
        //?.api(`https://graph.microsoft.com/v1.0/sites/${sharepointSettings.siteId}/drives/${sharepointSettings.driveId}/root:/${filename}:/content`)

}

// Function to sent a put requests
export async function graphPut(url, headers, body) {
    
    return _appClient
        ?.api(url)
        .headers(headers)
        .put(body);
        //?.api(`https://graph.microsoft.com/v1.0/sites/${sharepointSettings.siteId}/drives/${sharepointSettings.driveId}/root:/${filename}:/content`)

}

export async function graphPost(url, headers, body) {
    
    return _appClient
        ?.api(url)
        .headers(headers)
        .post(body);
        //?.api(`https://graph.microsoft.com/v1.0/sites/${sharepointSettings.siteId}/drives/${sharepointSettings.driveId}/root:/${filename}:/content`)

}

export async function getUserTokenAsync() {
    // Ensure credential isn't undefined
    if (!_deviceCodeCredential) {
        throw new Error('Graph has not been initialized for user auth');
    }

    // Ensure scopes isn't undefined
    if (!_settings?.graphUserScopes) {
        throw new Error('Setting "scopes" cannot be undefined');
    }

    // Request token with given scopes
    const response = await _deviceCodeCredential.getToken(
        _settings?.graphUserScopes,
    );
    return response.token;
}

export async function getUserAsync() {
    // Ensure client isn't undefined
    if (!_userClient) {
        throw new Error('Graph has not been initialized for user auth');
    }

    // Only request specific properties with .select()
    return _userClient
        .api('/me')
        .select(['displayName', 'mail', 'userPrincipalName'])
        .get();
}

export async function getInboxAsync() {
    // Ensure client isn't undefined
    if (!_userClient) {
        throw new Error('Graph has not been initialized for user auth');
    }

    return _userClient
        .api('/me/mailFolders/inbox/messages')
        .select(['from', 'isRead', 'receivedDateTime', 'subject'])
        .top(25)
        .orderby('receivedDateTime DESC')
        .get();
}

export async function sendMailAsync(subject, body, recipient) {
    // Ensure client isn't undefined
    if (!_userClient) {
        throw new Error('Graph has not been initialized for user auth');
    }

    // Create a new message
    const message = {
        subject: subject,
        body: {
            content: body,
            contentType: 'text',
        },
        toRecipients: [
            {
                emailAddress: {
                    address: recipient,
                },
            },
        ],
    };

    // Send the message
    return _userClient.api('me/sendMail').post({
        message: message,
    });
}

/*
// This function serves as a playground for testing Graph snippets
// or other code
export async function makeGraphCallAsync() {

    // Grant the app access to the SharePoint site
    const response = await axios.post(
        `https://graph.microsoft.com/v1.0/sites/${siteId}/permissions`,
        
    );

    // Create a new message
    const message = {        
        "@odata.type": "#microsoft.graph.permission",
        "grantedToIdentities": [
            {
                "application": {
                    "id": appId
                }
            }
        ],
        "roles": ["write"], 
        };


    // Send the message
    return _userClient.api('sites/bioforms/permissions').post({
        message: message,
    });
} */