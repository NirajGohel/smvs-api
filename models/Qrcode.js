const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const qrcodeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },

  present: [
    {
      type: mongoose.Types.ObjectId,
    },
  ],
});

qrcodeSchema.plugin(uniqueValidator);
module.exports = mongoose.model("qrcodes", qrcodeSchema);
