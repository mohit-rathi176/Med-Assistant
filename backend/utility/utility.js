const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer');

module.exports.generateOTP = () => {
    return otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
}

module.exports.transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'teammedassistant@gmail.com',
        pass: 'Medassist161024'
    }
});

module.exports.mailOptions = {
    from: 'teammedassistant@gmail.com',
    to: '',
    subject: '',
    text: ''
};