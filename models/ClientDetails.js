const mongoose = require("mongoose");

const clientDetailsSchema = new mongoose.Schema({
    currentVersion: {
        type: String,
        required: true
    },

    nextVersion: {
        type: String,
        required: true
    },

    andorid_url: {
        type: String,
        required: true
    },

    ios_url: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("clientdetails", clientDetailsSchema);
