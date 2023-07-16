const router = require('express').Router();
const ClientDetails = require("../models/ClientDetails");

router.post("/version", async (req, res) => {
    const clientDetails = await ClientDetails.findOne()

    if (!clientDetails) {
        return res.status(404).send(`Client does not exist!`);
    }

    return res.send(clientDetails)
})

module.exports = router;