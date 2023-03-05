const mongoose = require("mongoose");

const qrcodeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },

  present: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("qrcodes", qrcodeSchema);
