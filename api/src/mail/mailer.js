import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define a class to handle email functionality
export class Mailer {
  constructor(shareableLink, fileName) {
    const mailListFile = path.join(__dirname, '../../config/mail/mail-list.json');  // Fixed path to the mail list file
    const templateFile = path.join(__dirname, '../../config/mail/mail-template.json');  // Fixed path to the template file
    this.shareableLink = shareableLink;  // Shareable link for the Excel file
    this.fileName = fileName;

    // Load the configuration files
    this.recipients = this.loadJSON(mailListFile).recipients;
    this.template = this.loadJSON(templateFile);
  }

  // Load JSON configuration files
  loadJSON(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error loading file ${filePath}:`, error);
      throw new Error(`Failed to load configuration file: ${filePath}`);
    }
  }

  // Create Nodemailer transporter
  createTransporter() {
    return nodemailer.createTransport({
      host: 'carrerasresearch-org.mail.protection.outlook.com', // Relay server's address
      port: 25,  // SMTP port (port 25 or port 587 depending on the relay setup)
      secure: false,  // Set to true if using TLS/SSL (port 587 or 465)
      tls: {
        rejectUnauthorized: false,  // Ignore invalid SSL certificates (for testing)
      },
    });
  }

  // Send email to all recipients
  async sendEmails() {
    const transporter = this.createTransporter();

    // Loop through recipients and send an email to each one
    for (const recipient of this.recipients) {
      const emailBody = this.generateEmailBody(this.template.body);
      const mailOptions = {
        from: 'bioforms@carrerasresearch.org', // Sender email address
        to: recipient,                         // Recipient email address
        subject: this.template.subject,        // Subject from the template
        html: emailBody,                       // HTML body generated from the template
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent to', recipient, ':', info.response);
      } catch (error) {
        console.error('Error sending email to', recipient, ':', error);
      }
    }
  }

  // Replace the placeholder in the template with the shareable link
  generateEmailBody(templateBody) {
    return templateBody.replace('{{link}}', this.shareableLink).replace('{{fileName}}', this.fileName);
  }
}
