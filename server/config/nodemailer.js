// import nodemailer from 'nodemailer'


//  const transporter = nodemailer.createTransport({
//             host:'smtp-relay.brevo.com',
//             port: 587,
//             auth:{
//                 user: process.env.SMTP_USER,
//                 pass: process.env.SMTP_PASS,
//             }
//  });
//  export  default transporter;  


import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

// Debugging: Ensure transporter is ready
transporter.verify((error, success) => {
    if (error) {
        console.error("Nodemailer Error:", error);
    } else {
        console.log("Email Server is Ready to Send Emails ✅");
    }
});

export default transporter;
