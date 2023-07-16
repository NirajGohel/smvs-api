const router = require('express').Router();
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const Qrcode = require("../models/Qrcode");
const User = require("../models/User");

const { EMAIL } = process.env;
const { PASSWORD } = process.env;

router.post("/signup", async (req, res) => {
    try {
        const user = new User(req.body)
        user.password = await bcrypt.hash(user.password, 10);
        user.isAdmin = false;
        user.globalId = "0";

        const savedUser = await user.save();
        res.send(savedUser);
    }
    catch (err) {
        res.status(400).send(err)
    }
})

router.post("/login", async (req, res) => {
    const { mobileNo, password } = req.body;
    const user = await User.findOne({ mobileNo })

    if (!user) {
        return res.status(404).json({ message: "User does not exist!", success: false });
    }

    if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).json({ message: "Password is incorrect!", success: false });
    }

    res.status(200).json({ user, success: true });

})

router.post("/get", async (req, res) => {
    const user = await User.findById({ _id: req.body.id })

    if (!user) {
        return res.status(404).send(`User does not exist!`);
    }

    user.attendanceData.totalQrCode = await Qrcode.countDocuments();
    user.attendanceData.presentQrCode = await Qrcode.countDocuments({ present: req.body.id });
    user.attendanceData.presentDates = await Qrcode.find({ present: { $in: [req.body.id] } }, { date: 1 }).sort({ date: -1 });
    user.attendanceData.absentDates = await Qrcode.find({ present: { $nin: [req.body.id] } }, { date: 1 }).sort({ date: -1 });

    return res.status(200).json({ user })
})

router.post("/getall", async (req, res) => {
    let users = await User.find()
    const totalQrCode = await Qrcode.countDocuments();

    for (let user of users) {
        user.attendanceData.presentQrCode = await Qrcode.countDocuments({ present: user._id });
    }

    if (!users) {
        return res.status(404).send(`Users does not exist!`);
    }

    return res.json({ totalQrCode, users })
})

router.post("/forgot-password", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send("User does not exist!");

        var digits = "0123456789";
        let otp = "";
        for (let i = 0; i < 6; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
        var message = `Your OTP for Attendance app is ${otp}`;

        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: EMAIL,
                pass: PASSWORD,
            },
            port: 465,
            host: 'smtp.gmail.com'
        });

        // var transporter = nodemailer.createTransport({
        //   host: 'mail.frontendz.in',
        //   port: 465,
        //   secure: true,
        //   auth: {
        //     user: EMAIL,
        //     pass: PASSWORD,
        //   },
        // });

        var mailOptions = {
            from: EMAIL,
            to: req.body.email,
            subject: "Forgot password - SMVS Attendance App",
            text: message,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return res.send(error);
            } else {
                return res.json({ otp });
            }
        });
    } catch (error) {
        return res.status(400).send(error);
    }
})

router.put("/change-password", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send("User does not exist!");

        user.password = await bcrypt.hash(req.body.password, 10);
        const savedUser = await user.save();
        if (savedUser) {
            res.json({ isSuccess: true });
        }
        else {
            res.json({ isSuccess: false });
        }
    } catch (err) {
        res.status(400).send(err);
    }
})

router.put("/update", async (req, res) => {
    try {
        const { id, mobileNo, email, dob, firstName, lastName, middleName, address, education, occupationDetails, globalId } = req.body;

        let user = await User.findById({ _id: id });
        if (!user) return res.status(404).send("User does not exist!");

        if (user) {
            if (mobileNo && email && dob && firstName && lastName && middleName && address && education && occupationDetails) {
                user.mobileNo = mobileNo;
                user.email = email;
                user.dob = dob;
                user.firstName = firstName;
                user.lastName = lastName;
                user.middleName = middleName;
                user.address = address;
                user.education = education;
                user.occupationDetails = occupationDetails;
                user.globalId = globalId;

                const updatedUser = await user.save();
                if (updatedUser) {
                    res.json({ isSuccess: true });
                }
                else {
                    res.json({ isSuccess: false });
                }
            }
            else {
                res.json({ isSuccess: false, message: 'Insufficient Parameters' })
            }
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router;