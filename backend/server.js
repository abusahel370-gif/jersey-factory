require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/jerseys", require("./routes/jerseyRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/custom-requests", require("./routes/customRoutes"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});