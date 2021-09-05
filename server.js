import path from "path";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import bodyParser from "body-parser";
import axios from "axios";

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

const apiURL = "https://vpic.nhtsa.dot.gov/api/vehicles";

app.get("/", async (req, res) => {
  const result = await axios.get(`${apiURL}/GetAllManufacturers?format=json`);
  // console.log(result.data.Results)
  res.render("home", { result: result.data.Results, msg: "msgggg" });

  // res.render("home", { msg: "msgggg"});
});

// const vinNumbers = ['11111', '22222', '33333'];
const data = [
  { model: "Toyota", year: "2000" },
  { model: "Audi", year: "2021" },
];
//route to post a form request
app.post("/submit", async (req, res) => {
  //get vin number
  const { vinValue } = req.body;

  const {
    data: { Results },
  } = await axios.get(
    `${apiURL}/decodevinvaluesextended/${vinValue}?format=json`
  );
  res.send({ Results });

  // const validateVin = vinNumbers.includes(vinValue)

  // if(!validateVin) { console.log("invalid") }
  // else { res.send({data})}
});

//render home page
app.get("/vin", function (req, res) {
  res.render("carDetails");
});

app.post("/carMake", async function (req, res) {
  //get vin number
  const { value } = req.body;

  const {
    data: { Results },
  } = await axios.get(`${apiURL}/GetModelsForMake/${value}?format=json`);
  // console.log(Results)
  res.send({ Results });
});
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode  on port ${PORT}`.yellow
      .bold
  )
);
