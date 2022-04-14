const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Operator = require('../models/Operator');
const { registerValidation, loginValidation } = require('../validation/user_val');
const { generateOTP, transporter, mailOptions, generateUHID } = require('../utility/utility');

const usersOtp = [];

router.post('/verification', async (req, res) => {

    // Validate request, if invalid return 400 Bad Request
    // var result = registerValidation(req.body);
    // if (result.error)
    // {
    //     res.status(400).json({ error: result.error.details[0].message });
    //     return;
    // }

    // Check if the user is already in the database
    if (req.body.usertype == 'patient')
    {
        result = await Patient.findOne({ email: req.body.email });
        if (result)
            return res.status(400).json({ error: 'Email already exists' });
    }
    else if (req.body.usertype == 'doctor')
    {
        result = await Doctor.findOne({ email: req.body.email });
        if (result)
            return res.status(400).json({ error: 'Email already exists' });
    }
    else if (req.body.usertype == 'operator')
    {
        result = await Operator.findOne({ email: req.body.email });
        if (result)
            return res.status(400).json({ error: 'Email already exists' });
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

    // check if { email: otp } already exists
    usersOtp.forEach((element, index) => {
        if (element.email == req.body.email) {
            usersOtp.splice(index, 1);
        }
    });

    // add { email: otp } to array
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
                if (req.body.usertype == 'patient')
                {
                    try {
                        var uhid;
                        var uhidResult;
                        do {
                            // generate a UHID
                            uhid = generateUHID();
                            // check if UHID is unique or not
                            uhidResult = await Patient.findOne({ uhid: uhid });
                        } while (uhidResult);
                        const patient = new Patient({
                            username: req.body.username,
                            gender: req.body.gender,
                            dob: req.body.dob,
                            bloodgroup: req.body.bloodgroup,
                            mobile: req.body.mobile,
                            email: req.body.email,
                            password: hashedPassword,
                            uhid: uhid
                        });
                        const result = await patient.save();
                        console.log(result);
                        mailOptions.to = req.body.email;
                        mailOptions.subject = 'Registration successful';
                        mailOptions.text = `You have successfully registered to MedAssist.
                        \nYour Unique Health ID (UHID) is: ${uhid}`;

                        // send mail
                        transporter.sendMail(mailOptions);
                        // res.status(201).json(result);
                        res.status(201).json({ success: 'Registered' });
                    } catch (err) {
                        console.log(err);
                    }
                }
                else if (req.body.usertype == 'doctor')
                {
                    try {
                        const doctor = new Doctor({
                            username: req.body.username,
                            degree: req.body.degree,
                            specialisation: req.body.specialisation,
                            email: req.body.email,
                            password: hashedPassword
                        });
                        const result = await doctor.save();
                        console.log(result);
                        // res.status(201).json(result);
                        res.status(201).json({ success: 'Registered' });
                    } catch (err) {
                        console.log(err);
                    }
                }
                else if (req.body.usertype == 'operator')
                {
                    try {
                        const operator = new Operator({
                            username: req.body.username,
                            email: req.body.email,
                            password: hashedPassword
                        });
                        const result = await operator.save();
                        console.log(result);
                        // res.status(201).json(result);
                        res.status(201).json({ success: 'Registered' });
                    } catch (err) {
                        console.log(err);
                    }
                }
                // try {
                //     const user = new User({
                //         usertype: req.body.usertype,
                //         username: req.body.username,
                //         email: req.body.email,
                //         password: hashedPassword
                //     });
                //     const result = await user.save();
                //     console.log(result);
                //     // res.status(201).json(result);
                //     res.status(201).json({ success: 'Registered' });
                // } catch (err) {
                //     console.log(err);
                // }
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
