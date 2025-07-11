// pages/api/send-email.js

// You'll need to install 'resend' package:
// npm install resend
// or
// yarn add resend

import { Resend } from 'resend';

// Initialize Resend with your API key from environment variables
// IMPORTANT: This key MUST be set in your Vercel project's Environment Variables!
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests for security
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Destructure data from the request body
  const { name, email, subject, message } = req.body;

  // Basic server-side validation
  if (!email || !message) {
    return res.status(400).json({ message: 'Email and message fields are required.' });
  }

  try {
    // Attempt to send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Your Portfolio <onboarding@yourdomain.com>', // Replace 'yourdomain.com' with a domain you have verified in Resend.
                                                         // If you don't have a custom domain, you might need to use a generic
                                                         // Resend domain provided during setup, or use a verified email address.
      to: 'your.email@example.com', // Replace with the actual email address where you want to receive messages
      subject: `Portfolio Inquiry: ${subject || 'No Subject'}`,
      html: `
        <p><strong>Name:</strong> ${name || 'N/A'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      // Log the error from Resend for debugging
      console.error('Resend API Error:', error);
      // Send a 500 status back to the frontend
      return res.status(500).json({ message: 'Failed to send message via email service.', details: error.message });
    }

    // If successful, send a 200 status back to the frontend
    res.status(200).json({ message: 'Message sent successfully!' });

  } catch (err) {
    // Catch any unexpected errors during the process
    console.error('Server error during email sending:', err);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
}
