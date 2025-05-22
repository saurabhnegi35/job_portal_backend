const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const PORT = 3000;

dotenv.config();
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Your App is Up and Running at PORT ${PORT}`);
});
