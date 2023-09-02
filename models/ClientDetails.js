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

    andoridUrl: {
        type: String,
        required: true
    },

    iosUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("clientdetails", clientDetailsSchema);
