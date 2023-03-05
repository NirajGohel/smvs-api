require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const User = require("./models/User");
const Qrcode = require("./models/Qrcode");

const { PORT } = process.env;
const { MONGODB_URL } = process.env;

mongoose.set("strictQuery", false);

mongoose
  .connect(MONGODB_URL, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("DB connected!!");
  })
  .catch((err) => {
    console.log(Error, err.message);
  });

app.use(express.json());

app.get("/", (req, res) => res.status(200).send(`API working`));

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
    qrcode.present.push(req.body.userid);

    try {
      const savedQrcode = await qrcode.save();
      res.send(savedQrcode);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
});

app.listen(PORT, () => console.log(`Server up and running`));
