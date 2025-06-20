// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const formData = await request.formData();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const message = formData.get('message') as string;

  // Basic validation
  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Name, email, and message are required' },
      { status: 400 }
    );
  }

  try {
    // Create a transporter using your Gmail account
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Send to yourself
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      text: `
        You have a new contact form submission:
        
        Name: ${name}
        Email: ${email}
        Phone: ${phone || 'Not provided'}
        
        Message:
        ${message}
      `,
      html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #333;">New Contact Form Submission - ${process.env.COMPANY_NAME}</h2>
    <p>Dear Team,</p>
    
    <p>A new inquiry has been submitted through our website:</p>
    
    <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #3498db;">
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
    </div>

    <h3 style="margin-top: 20px;">Next Steps</h3>
    <ul>
      <li>Please respond within 24-48 hours</li>
      <li>Update CRM case #${Date.now()}</li>
    </ul>

        <div style="margin-top: 30px; font-size: 0.9em; color: #777;">
            <p>Submitted: ${new Date().toLocaleString()}</p>
            <p>ℹ Automated message - Do not reply directly</p>
        </div>
    </div>
    `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Error sending message' },
      { status: 500 }
    );
  }
}