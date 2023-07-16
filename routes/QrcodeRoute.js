const router = require('express').Router();

const Qrcode = require("../models/Qrcode");
const User = require("../models/User");

router.post("/generate", async (req, res) => {
    try {
        const qrcodeExists = await Qrcode.findOne({ date: req.body.date })

        if (qrcodeExists) {
            res.send(qrcodeExists);
        }
        else {
            const qrcode = new Qrcode(req.body);
            qrcode.present = [];

            const savedQrcode = await qrcode.save();
            res.send(savedQrcode);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post("/scan", async (req, res) => {
    const qrcode = await Qrcode.findOne({ date: req.body.date });
    if (!qrcode) res.status(404).send(`QR code not found`);

    if (qrcode) {
        if (!qrcode.present.includes(req.body.userid)) {
            qrcode.present.push(req.body.userid);

            try {
                const savedQrcode = await qrcode.save();
                res.status(200).json({ savedQrcode, isPresent: 1 });
            } catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        } else {
            res.status(200).json({ message: "You have already scaned this QR code!!!" })
        }
    }
});

router.post("/get", async (req, res) => {
    const qrcode = await Qrcode.findOne({ date: req.body.date })
    if (!qrcode) res.status(404).send(`QR code not found`);

    if (qrcode) {
        try {
            const presentUsers = await User.find({ _id: { $in: qrcode.present } })
            const absentUsers = await User.find({ _id: { $nin: qrcode.present } })

            res.json({ qrcode, presentUsers, absentUsers });
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    }
})

router.post("/getall", async (req, res) => {
    const qrcodes = await Qrcode.find().sort({ date: -1 })

    if (!qrcodes) {
        return res.status(404).send(`QRCodes does not exist!`);
    }

    return res.send(qrcodes)
})

module.exports = router;