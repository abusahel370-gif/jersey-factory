require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/jerseys", require("./routes/jerseyRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/custom-requests", require("./routes/customRoutes"));

const { notFound, errorHandler } = require("./middleware/errorHandler");

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});