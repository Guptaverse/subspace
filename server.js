const express = require("express");
const route = require("./routes/route");

const app = express();
const port = 3000;

app.use("/api", route);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
