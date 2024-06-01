// require("dotenv").config();
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");

// const { PORT } = process.env;
// const { MONGODB_URL } = process.env;

// const qrcodeRouter = require("../routes/QrcodeRoute");
// const userRouter = require("../routes/UserRoute");
// const centerRouter = require("../routes/CenterRoute");
// const clientDetailsRouter = require("../routes/ClientDetailsRoute");

// mongoose.set("strictQuery", false);

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(MONGODB_URL);
//     console.log(`MongoDB Connected`);
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// };

// app.use(express.json());

// app.get("/", (req, res) => res.status(200).send(`API working`));

// app.use("/qrcode", qrcodeRouter)
// app.use("/user", userRouter)
// app.use("/center", centerRouter)
// app.use("/client", clientDetailsRouter)

// app.listen(PORT, () => {
//   console.log(`Server up and running`);
// });

// // connectDB().then(() => {
// //   app.listen(PORT, () => {
// //     console.log(`Server up and running`);
// //   });
// // });

// module.exports = app;

const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;