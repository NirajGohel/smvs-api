require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Qrcode = require("./models/Qrcode");

const { PORT } = process.env;
const { MONGODB_URL } = process.env;

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URL);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// mongoose
//   .connect(MONGODB_URL, { useUnifiedTopology: true, useNewUrlParser: true })
//   .then(() => {
//     console.log("DB connected!!");
//     app.listen(PORT, () => console.log(`Server up and running`));
//   })
//   .catch((err) => {
//     console.log(Error, err.message);
//   });

app.use(express.json());

app.get("/", (req, res) => res.status(200).send(`API working`));

//#region QRCodes
app.post("/qrcode/generate", async (req, res) => {
  const qrcode = new Qrcode(req.body);
  qrcode.present = [];

  try {
    const savedQrcode = await qrcode.save();
    res.send(savedQrcode);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/qrcode/scan", async (req, res) => {
  //   const user1 = await User.findOne({ username: req.body.username });
  //   if (user1) {
  //     const data = {
  //       date: req.body.date,
  //       isPresent: true,
  //     };
  //     if (!user1.present) {
  //       user1.present = [];
  //     }
  //     user1.present.push(data);
  //     try {
  //       const savedUser = await user1.save();
  //       res.status(200).send(savedUser);
  //     } catch (err) {
  //       console.log(err);
  //       res.status(400).send(err);
  //     }
  //   }
  //   const d = new Date(req.body.date);
  //   console.log(d);

  const qrcode = await Qrcode.findOne({ date: req.body.date });
  if (!qrcode) res.status(404).send(`QR code not found`);

  if (qrcode) {
    if (!qrcode.present.includes(req.body.userid)) {
      qrcode.present.push(req.body.userid);
    }

    try {
      const savedQrcode = await qrcode.save();
      res.send(savedQrcode);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
});

app.post("/qrcode/get", async (req, res) => {
  const qrcode = await Qrcode.findOne({ date: req.body.date })
  if (!qrcode) res.status(404).send(`QR code not found`);

  if (qrcode) {
    try {
      const presentUsers = await User.find({ _id: { $in: qrcode.present } })
      const absentUsers = await User.find({ _id: { $nin: qrcode.present } })

      res.json({ qrcode, presentUsers, absentUsers });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
})

app.post("/qrcode/getall", async (req, res) => {
  const qrcodes = await Qrcode.find()

  if (!qrcodes) {
    return res.status(404).send(`QRCodes does not exist!`);
  }

  return res.send(qrcodes)
})
//#endregion

//#region User
app.post("/user/signup", async (req, res) => {
  const user = new User(req.body)
  user.password = await bcrypt.hash(user.password, 10);
  user.isAdmin = false;

  try {
    const savedUser = await user.save();
    res.send(savedUser);
  }
  catch (err) {
    res.status(400).send(err)
  }
})

app.post("/user/login", async (req, res) => {
  const { mobileNo, password } = req.body;
  const user = await User.findOne({ mobileNo })

  if (!user) {
    return res.status(404).json({ message: "User does not exist!", success: false });
  }

  if (!await bcrypt.compare(password, user.password)) {
    return res.status(400).json({ message: "Password is incorrect!", success: false });
  }

  res.status(200).json({ user, success: true });

})

app.post("/user/get", async (req, res) => {
  const user = await User.findById({ _id: req.body.id })

  if (!user) {
    return res.status(404).send(`User does not exist!`);
  }

  user.attendanceData.totalQrCode = await Qrcode.countDocuments();
  user.attendanceData.presentQrCode = await Qrcode.countDocuments({ present: req.body.id });
  user.attendanceData.presentDates = await Qrcode.find({ present: { $in: [req.body.id] } }, { date: 1 });
  user.attendanceData.absentDates = await Qrcode.find({ present: { $nin: [req.body.id] } }, { date: 1 });

  return res.send(user)
})

app.post("/user/getall", async (req, res) => {
  const users = await User.find()

  if (!users) {
    return res.status(404).send(`Users does not exist!`);
  }

  return res.send(users)
})
//#endregion

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server up and running`);
  });
});
