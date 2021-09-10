const express = require("express");
const app = express();
const port = 3000;

const routes = require("./routes");

app.use(express.urlencoded({ extended: false }));

app.use("/", routes);

app.set("view engine", "pug");

app.listen(port, () => {
  console.log(`Superheroes API is listening at http://localhost:${port}`);
});
