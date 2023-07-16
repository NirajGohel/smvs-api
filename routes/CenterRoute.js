const router = require('express').Router();

const Center = require("../models/Center")

router.post("/add", async (req, res) => {
    try {
        const center = new Center(req.body)
        center.name = center.name.charAt(0).toUpperCase() + center.name.slice(1)

        const savedCenter = await center.save()
        res.send(savedCenter)
    } catch (error) {
        res.status(400).send(err)
    }
})

router.post("/getall", async (req, res) => {
    try {
        const centers = await Center.find()
        res.send(centers)
    } catch (error) {
        res.send(error)
    }
})

router.put("/update", async (req, res) => {
    try {
        const { id, name, email } = req.body

        let center = await Center.findById({ _id: id })
        if (!center) return res.status(404).send("Center does not exist!")

        if (center) {
            if (name && email) {
                center.name = name.charAt(0).toUpperCase() + name.slice(1)
                center.email = email

                const updatedCenter = await center.save();
                if (updatedCenter) {
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