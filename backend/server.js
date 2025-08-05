require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/db/db");

connectToDB();

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the backend server!",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
