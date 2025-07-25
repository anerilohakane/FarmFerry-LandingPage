import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    // Validate input
    if (!name || !email || !phone || !subject || !message) {
      return new Response(JSON.stringify({ success: false, message: 'All fields are required' }), { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Send email to site owner
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: 'farm.ferry.225@gmail.com', // Change this to your real email
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h3>New Partner Inquiry Received</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    // Send acknowledgment email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Thanks for contacting Farm Ferry!',
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for your interest in partnering with Farm Ferry. We've received your inquiry regarding "${subject}" and our team will get back to you within 24 hours.</p>
        
        <h3>Your Submission Details:</h3>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 4px solid #4CAF50; padding-left: 15px; margin-left: 0;">
          ${message.replace(/\n/g, '<br>')}
        </blockquote>
        
        <p>If you have any urgent inquiries, please call us at +1 (123) 456-7890.</p>
        
        <p>Best regards,</p>
        <p><strong>The Farm Ferry Team</strong></p>
      `
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error('Email send error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Failed to send message',
      error: error.message 
    }), { status: 500 });
  }
}
