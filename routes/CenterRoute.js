const router = require('express').Router();

const Center = require("../models/Center")

router.post("/add", async (req, res) => {
    try {
        //const savedCenter = 
    } catch (error) {

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

    } catch (error) {

    }
})

module.exports = router;