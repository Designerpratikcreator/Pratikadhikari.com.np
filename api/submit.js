export default async function handler(req, res) {
  if (req.method === 'POST') {
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'yourgmail@gmail.com',
        pass: 'your_app_password', // Use app password for Gmail
      },
    });

    const mailOptions = {
      from: 'yourgmail@gmail.com',
      to: 'pratik_mhnrs2023@kusoa.edu.np',
      subject: 'New Applicant Submission',
      text: JSON.stringify(req.body, null, 2),
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).send('Method not allowed');
  }
}
