const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    max: 255,
    min: 3,
  },

  password: {
    type: String,
    required: true,
    min: 5,
    max: 255,
  },

  present: [
    {
      date: {
        type: Date,
        required: true,
      },
      isPresent: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("users", userSchema);
