const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validation/user_val');
const { generateOTP, transporter, mailOptions } = require('../utility/utility');

const usersOtp = [];

router.post('/verification', async (req, res) => {

    // Validate request, if invalid return 400 Bad Request
    var result = registerValidation(req.body);
    if (result.error)
    {
        res.status(400).json({ error: result.error.details[0].message });
        return;
    }

    // Check if the user is already in the database
    result = await User.findOne({ email: req.body.email });
    if (result)
    {
        res.status(400).json({ error: 'Email already exists' });
        return;
    }

    // generate otp
    const otp = generateOTP();

    // set mail options
    mailOptions.to = req.body.email;
    mailOptions.subject = 'One Time Password';
    mailOptions.text = `Your OTP for registration is: ${otp}` ;

    // send mail
    transporter.sendMail(mailOptions);

    res.status(200).json({ success: 'OTP sent successfully' });

    // check if email: otp already exists
    usersOtp.forEach((element, index) => {
        if (element.email == req.body.email) {
            usersOtp.splice(index, 1);
        }
    });

    // add email: otp to array
    const userOtp = {
        email: req.body.email,
        otp: otp
    };

    usersOtp.push(userOtp);
    console.log(usersOtp);

    // remove email: otp from array after timeout
    setTimeout(() => {
        usersOtp.forEach((element, index) => {
            if (element.email == req.body.email) {
                usersOtp.splice(index, 1);
            }
        });
        console.log('After timeout:');
        console.log(usersOtp);
    }, 180 * 1000);
});

router.post('/register', (req, res) => {
    flag = 0

    // validate OTP
    usersOtp.forEach(async (element) => {
        if (element.email == req.body.email) {
            flag = 1;
            if (element.otp == req.body.otp) {
                // hash the password
                const hashedPassword = await bcrypt.hash(req.body.password, 10);

                // save the user
                try {
                    const user = new User({
                        usertype: req.body.usertype,
                        username: req.body.username,
                        email: req.body.email,
                        password: hashedPassword
                    });
                    const result = await user.save();
                    console.log(result);
                    // res.status(201).json(result);
                    res.status(201).json({ success: 'Registered' });
                } catch (err) {
                    console.log(err);
                }
            }
            else {
                res.status(400).json({ error: 'Incorrect OTP' });
            }
        }
    });

    if (flag == 0) {
        res.status(400).json({ error: 'Timeout' });
    }
});

router.post('/login', async (req, res) => {
    // Validate request, if invalid return 400 Bad Request
    const result = loginValidation(req.body);
    if (result.error)
    {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    // Check if the user exists in the database
    const user = await User.findOne({ username: req.body.username });
    if (!user)
    {
        res.status(400).json({ error: 'Invalid username' });
        return;
    }
    
    // const user = await User.findOne({ email: req.body.email });
    // if (!user)
    // {
    //     res.status(400).send('Email does not exist.');
    //     return;
    // }

    const pass = await bcrypt.compare(req.body.password, user.password);
    if (!pass)
    {
        res.status(400).json({ error: 'Invalid password' });
        return;
    }

    // If user details are correct
    res.status(200).json({ success: 'Logged In' });
});

module.exports = router;