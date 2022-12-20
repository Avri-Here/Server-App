const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chaimbinder31@gmail.com",
    pass: "vqxqjtozupxxmass",
  },
});

function retSend(nameFum, pass) {
  const mailOptions = {
    from: "chaimbinder31@gmail.com",
    to: "chaimbinder31@gmail.com",
    subject: nameFum + " שכח את הסיסמא שלו ...",
    text: "מסור לו את הסיסמא שלו .. : " + pass,
  };
  const myPromise = new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);
      } else {
        resolve("Email sent: " + info.response);
      }
    });
  });
  return myPromise;
}
module.exports = retSend;
