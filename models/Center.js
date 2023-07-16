const mongoose = require("mongoose")

const centerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("center", centerSchema);
