const mongoose = require("mongoose");

const clientDetailsSchema = new mongoose.Schema({
    currentVersion: {
        type: Number,
        required: true,
    },

    nextVersion: {
        type: Number,
        required: true,
    },

    url: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("clientdetails", clientDetailsSchema);
