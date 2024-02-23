const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: "465",
  secure: true,
  logger: false,
  debug: false,
  secureConnection: true,
  auth: {
    user: "cotactearmenion@gmail.com",
    pass: "htsf fsuz esya mbix",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

function sendEmail(emailAddress, password) {
  const mailOptions = {
    from: '"GROUP 10 - LFSA322N002 👻" <cotactearmenion@gmail.com>',
    to: emailAddress,
    subject: "Your Temporary Password",
    text: `Your Password is: ${password}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error: ", error);
    } else {
      console.log("Success: ", info.response);
    }
  });
}

module.exports = { sendEmail };