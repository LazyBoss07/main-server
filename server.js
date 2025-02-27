const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());
console.log("Server Triggered");
app.get("/", (req, res) => {
  console.log("Main Server Up");
  res.json({ message: "Main Server Up" });
});
const Commandurl = "https://abrahamjuliot.github.io/creepjs/";
const decoyData = [];
const decoyEP = {
  1: "http://localhost:3001/html1",
  2: "http://localhost:3002/html1",
};
app.get("/send_cmd", (req, res) => {
  console.log("Calling All Decoy");

  for (const key in decoyEP) {
    //decoy 1
    axios
      .post(decoyEP[key], {
        url: Commandurl,
        timeout: 60000,
      })
      .then((response) => {
        decoyData.push({ data: response.data.html });
        console.log(`Decoy ${key} Pushed`);
      })
      .catch((err) => console.log(err));
  }

  // //decoy 2
  // axios
  //     .post("http://localhost:3002/html1", {
  //       url: Commandurl,
  //       timeout: 60000,
  //     })
  //     .then((response) => {
  //       decoyData.push({"data":response.data.html});
  //       console.log("Decoy 2 Pushed");
  //     })
  //     .catch((err) => console.log(err));

  new Promise((r) => {
    setTimeout(r, 10000);
  });
  res.json({ decoyData: decoyData });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
