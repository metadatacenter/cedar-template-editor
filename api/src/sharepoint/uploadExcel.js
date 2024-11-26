import sharepointSettings from './sharepointSettings.js'
import ExcelJS from 'exceljs'
import {
    initializeGraphForAppOnlyAuth,
    graphGet,
    graphPost,
    graphPut
}from '../graphAPI/graphHelper.js'

// Add a worksheet from an array of arrays to an existing file or create a new file
export async function requestShareableLink(fileId) {

    const url = `https://graph.microsoft.com/v1.0/sites/${sharepointSettings.siteId}/drives/${sharepointSettings.driveId}/items/${fileId}`;
    const headers = { };
    const response = await graphGet(url, headers);

    if (response) {
        const data = await response.json();
        return data['@microsoft.graph.downloadUrl'];
    } else {
        console.error('Error creating shareable link:', response.status, response.statusText);
        return null;
    }
} 

// Add a worksheet from an array of arrays to an existing file or create a new file
export async function handleExcelUpload(fileName, dataMatrix) {
    initializeGraphForAppOnlyAuth();

    const fileMetadata = await checkIfFileExists(fileName);
    const workbook = new ExcelJS.Workbook();

    let version = 1;
    if (fileMetadata) {
        // Download existing file
        const fileBuffer = await downloadLargeFile(fileMetadata['@microsoft.graph.downloadUrl']);
        await workbook.xlsx.load(fileBuffer); // Load existing content
        version += workbook.worksheets.length;
    }

    // Save the current worksheets' data
    const existingWorksheets = workbook.worksheets.map(ws => ({
        name: ws.name,
        rows: ws.getSheetValues().slice(1) // Skip first empty row due to 1-based index
     }));

    // Remove all existing worksheets
    workbook.eachSheet((sheet) => {
        workbook.removeWorksheet(sheet.id);
    });

    // Add new worksheet with dataMatrix
    const worksheet = workbook.addWorksheet(`v${version}`);
    dataMatrix.forEach(row => worksheet.addRow(row));

    //Step 5: Re-add the original worksheets
    existingWorksheets.forEach(({ name, rows }) => {
        const worksheet = workbook.addWorksheet(name);
        rows.forEach(row => worksheet.addRow(row));
    });
 
    // Save workbook to buffer
    const buffer = await workbook.xlsx.writeBuffer();
    if (buffer.byteLength > 4 * 1024 * 1024) {
        console.log("File is larger than 4MB, uploading in chunks.");
        const response = await uploadLargeFile(fileName, buffer);
        if (response && response.id)
            response.downloadLink = requestShareableLink(response.id)
        return response;
    } else {
        const response = await uploadSmallFile(fileName, buffer);
        if (response && response.id)
            response.downloadLink = await requestShareableLink(response.id)
        return response;
    }
}

// Check if the file exists
async function checkIfFileExists(fileName) {
    const url = `https://graph.microsoft.com/v1.0/sites/${sharepointSettings.siteId}/drives/${sharepointSettings.driveId}/root:/BioForms/${fileName}`;

    const headers = {};

    const response = await graphGet(url, headers);

    if (response.ok) {
        return response.json();  // File metadata if exists
    } else if (response.status === 404) {
        return null;  // File does not exist
    } else {
        console.error('Error checking file existence:', response.status, response.statusText);
        return null;
    }
}

// Download the file if it exists
async function downloadLargeFile(fileUrl) {
    const headers = { };
    const response = await fetch(fileUrl, headers);

    if (response.ok) {
        return response.arrayBuffer();
    } else {
        console.error("Error downloading file:", response.status, response.statusText);
        return null;
    }
}

// Upload small file if under 4MB
async function uploadSmallFile(fileName, buffer) {
    const url = `https://graph.microsoft.com/v1.0/sites/${sharepointSettings.siteId}/drives/${sharepointSettings.driveId}/root:/BioForms/${fileName}:/content`;
    const headers = {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    };

    const response = await graphPut(url, headers, buffer);
    
    // Check if the response contains the file ID as a success indicator
    if (response && response.id) {
        console.log("Excel file uploaded successfully.");
        return response;
    } else {
        console.error('Error uploading Excel file:', response);
    }
}

// Upload large files in chunks if file size > 4MB
async function uploadLargeFile(fileName, fileBuffer) {
    const sessionUrl = `https://graph.microsoft.com/v1.0/sites/${sharepointSettings.siteId}/drives/${sharepointSettings.driveId}/root:/BioFomrs/${fileName}:/createUploadSession`;
    const headers = {
        "Content-Type": "application/json"
    };

    const sessionResponse = await graphPost(sessionUrl, headers , JSON.stringify({
        item: { "@microsoft.graph.conflictBehavior": "replace" }
    }));

    const uploadUrl = (await sessionResponse.json()).uploadUrl;

    if (!uploadUrl) {
        console.error("Failed to create an upload session.");
        return;
    }

    const chunkSize = 320 * 1024; // 320 KB
    let start = 0;
    let end = chunkSize;
    const totalSize = fileBuffer.byteLength;

    while (start < totalSize) {
        const chunk = fileBuffer.slice(start, end);
        const chunkHeaders = {
            "Content-Range": `bytes ${start}-${end - 1}/${totalSize}`
        };

        const uploadChunkResponse = await graphPut(uploadUrl, chunkHeaders, chunk);

        if (!uploadChunkResponse.ok) {
            console.error("Error uploading file chunk:", uploadChunkResponse.status, uploadChunkResponse.statusText);
            return;
        }

        start = end;
        end = Math.min(end + chunkSize, totalSize);
    }

    console.log("Large file uploaded successfully.");
    return sessionResponse;
}




