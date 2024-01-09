const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  mobileNo: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: function (val) {
        return val.toString().length == 10
      },
      message: val => `${val.value} is not a valid mobile number`
    }
  },

  password: {
    type: String,
    required: true,
  },

  isAdmin: {
    type: Boolean,
  },

  email: {
    type: String,
    required: true,
  },

  dob: {
    type: Date,
    required: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  middleName: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  education: {
    type: String,
    required: true,
  },

  occupation: {
    type: String
  },

  occupationDetails: {
    type: String
  },

  attendanceData: {
    totalQrCode: {
      type: Number
    },

    presentQrCode: {
      type: Number
    },

    presentDates: [
      {
        _id: {
          type: mongoose.Types.ObjectId,
        },

        date: {
          type: Date
        }
      }
    ],

    absentDates: [
      {
        _id: {
          type: mongoose.Types.ObjectId,
        },

        date: {
          type: Date
        }
      }
    ],
  },

  globalId: {
    type: String
  },

  centerId: {
    type: mongoose.Types.ObjectId
  },

  centerName: {
    type: String
  },

  callBy: {
    type: String
  }

});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("users", userSchema);
