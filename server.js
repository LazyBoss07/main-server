// const express = require("express");
// const axios = require("axios");
// const puppeteer = require("puppeteer");
// const fs = require("fs");
// const path = require("path");
// const app = express();
// app.set('view engine', 'ejs');
// app.use(express.static('public'));

// const { 
//   extractNavigator, extractHTMLElementUsingEvaluate, extractCSSMediaQueriesUsingEvaluate, 
//   extractWindowUsingEvaluate, extractComputedStyleUsingEvaluate, extractWebRTCUsingSelectors, 
//   extractIntlUsingSelectors, extractTimezoneUsingSelectors, extractHeadlessUsingSelectors, 
//   extractWorkerUsingSelectors, extractResistanceUsingSelectors, extractScreenUsingSelectors, 
//   extractWebGLUsingSelectors, extractCanvas2DUsingSelectors, extractFontsUsingSelectors, 
//   extractSvgRectUsingSelectors, extractDOMRectUsingSelectors, extractAudioUsingSelectors, 
//   extractMediaUsingSelectors, extractSpeechUsingEvaluate, extractCSSUsingEvaluate 
// } = require("./creepjsExtract");

// app.use(express.json());

// console.log("Server Triggered");

// app.get("/", (req, res) => {
//   console.log("Main Server Up");
//   res.json({ message: "Main Server Up" });
// });

// const Commandurl = "https://abrahamjuliot.github.io/creepjs/";
// const decoyData = [];
// const decoyEP = {
//   1: "http://localhost:4000/html1",
//   2: "http://localhost:3000/html1",
// };

// // Directory to store received files
// const outputDir = path.join(__dirname, "output_files");
// if (!fs.existsSync(outputDir)) {
//   fs.mkdirSync(outputDir, { recursive: true });
// }

// // Function to download and save a file
// const downloadFile = async (url, key) => {
//   try {
//     console.log(`Fetching file from Decoy ${key}: ${url}`);

//     // Generate unique filename
//     const filename = `file_${key}_${Date.now()}.html`; // Change extension if needed
//     const filePath = path.join(outputDir, filename);

//     // Request file as stream
//     const response = await axios({
//       method: "post",
//       url,
//       responseType: "stream",
//       timeout: 60000,
//       data: { url: Commandurl },
//     });

//     // Pipe the stream to a file
//     const writer = fs.createWriteStream(filePath);
//     response.data.pipe(writer);

//     return new Promise((resolve, reject) => {
//       writer.on("finish", () => {
//         console.log(`File saved: ${filePath}`);
//         resolve(filename);
//       });
//       writer.on("error", (err) => {
//         console.error("Error saving file:", err);
//         reject(err);
//       });
//     });

//   } catch (err) {
//     console.error(`Error fetching from Decoy ${key}:`, err.message);
//     return null;
//   }
// };

// // API to send commands and download files
// app.get("/send_cmd", async (req, res) => {
//   console.log("Calling All Decoy Servers...");
//   let filenames = [];

//   const requests = Object.keys(decoyEP).map(async (key) => {
//     const filename = await downloadFile(decoyEP[key], key);
//     if (filename) {
//       filenames.push(filename);
//       decoyData.push({ decoy: key, filename });
//     }
//   });

//   await Promise.all(requests);
//   res.json({ filenames });
// });





// const getFilteredFiles = (filter) => {
//   const allFiles = fs.readdirSync(outputDir);
//   return allFiles.filter(file => file.startsWith(`file_${filter}_`)); // Matches format: file_<id>_timestamp
// };

// // Function to process files using Puppeteer
// const processFileWithPuppeteer = async (filePath) => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
  
//   await page.goto(`file://${filePath}`, { waitUntil: "domcontentloaded" });

//   // Apply all extraction functions
//   const extractedData = {
//     Navigator: await extractNavigator(page),
//     HTMLElement: await extractHTMLElementUsingEvaluate(page),
//     CSSMediaQueries: await extractCSSMediaQueriesUsingEvaluate(page),
//     Window: await extractWindowUsingEvaluate(page),
//     ComputedStyle: await extractComputedStyleUsingEvaluate(page),
//     WebRTC: await extractWebRTCUsingSelectors(page),
//     Intl: await extractIntlUsingSelectors(page),
//     Timezone: await extractTimezoneUsingSelectors(page),
//     Headless: await extractHeadlessUsingSelectors(page),
//     Worker: await extractWorkerUsingSelectors(page),
//     Resistance: await extractResistanceUsingSelectors(page),
//     Screen: await extractScreenUsingSelectors(page),
//     WebGL: await extractWebGLUsingSelectors(page),
//     Canvas2D: await extractCanvas2DUsingSelectors(page),
//     Fonts: await extractFontsUsingSelectors(page),
//     SvgRect: await extractSvgRectUsingSelectors(page),
//     DOMRect: await extractDOMRectUsingSelectors(page),
//     Audio: await extractAudioUsingSelectors(page),
//     Media: await extractMediaUsingSelectors(page),
//     Speech: await extractSpeechUsingEvaluate(page),
//     CSS: await extractCSSUsingEvaluate(page),
//   };

//   await browser.close();
//   return extractedData;
// };

// // Route to render dashboard with extracted data
// app.get("/dashboard/:id", async (req, res) => {
//   const { id } = req.params;
//   if (!["1", "2"].includes(id)) {
//     return res.status(400).json({ error: "Invalid ID. Use 1 or 2." });
//   }

//   const files = getFilteredFiles(id);
//   const extractedResults = [];

//   for (const file of files) {
//     const filePath = path.join(outputDir, file);
//     const extractedData = await processFileWithPuppeteer(filePath);
//     extractedResults.push({ file, extractedData });
//   }

//   res.render("index", { extractedResults, filterId: id });
// });


// // Start server
// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
const express = require("express");
const axios = require("axios");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const diff = require('diff');
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

const {
  extractNavigator, extractHTMLElementUsingEvaluate, extractCSSMediaQueriesUsingEvaluate,
  extractWindowUsingEvaluate, extractComputedStyleUsingEvaluate, extractWebRTCUsingSelectors,
  extractIntlUsingSelectors, extractTimezoneUsingSelectors, extractHeadlessUsingSelectors,
  extractWorkerUsingSelectors, extractResistanceUsingSelectors, extractScreenUsingSelectors,
  extractWebGLUsingSelectors, extractCanvas2DUsingSelectors, extractFontsUsingSelectors,
  extractSvgRectUsingSelectors, extractDOMRectUsingSelectors, extractAudioUsingSelectors,
  extractMediaUsingSelectors, extractSpeechUsingEvaluate, extractCSSUsingEvaluate
} = require("./creepjsExtract");

app.use(express.json());

console.log("Server Triggered");

app.get("/", (req, res) => {
  console.log("Main Server Up");
  res.json({ message: "Main Server Up" });
});

const Commandurl = "https://abrahamjuliot.github.io/creepjs/";
const decoyData = [];
const decoyEP = {
  1: "http://localhost:4000/html1",
  2: "http://localhost:3000/html1",
};

// Directory to store received files
const outputDir = path.join(__dirname, "output_files");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to download and save a file
const downloadFile = async (url, key) => {
  try {
    console.log(`Fetching file from Decoy ${key}: ${url}`);

    // Generate unique filename
    const filename = `file_${key}_${Date.now()}.html`;
    const filePath = path.join(outputDir, filename);

    // Request file as stream
    const response = await axios({
      method: "post",
      url,
      responseType: "stream",
      timeout: 60000,
      data: { url: Commandurl },
    });

    // Pipe the stream to a file
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        console.log(`File saved: ${filePath}`);
        resolve(filename);
      });
      writer.on("error", (err) => {
        console.error("Error saving file:", err);
        reject(err);
      });
    });

  } catch (err) {
    console.error(`Error fetching from Decoy ${key}:`, err.message);
    return null;
  }
};

// API to send commands and download files
app.get("/send_cmd", async (req, res) => {
  console.log("Calling All Decoy Servers...");
  let filenames = [];

  const requests = Object.keys(decoyEP).map(async (key) => {
    const filename = await downloadFile(decoyEP[key], key);
    if (filename) {
      filenames.push(filename);
      decoyData.push({ decoy: key, filename });
    }
  });

  await Promise.all(requests);
  res.json({ filenames });
});

// Function to get files for all IDs
const getAllFiles = () => {
  const allFiles = fs.readdirSync(outputDir);
  return allFiles.filter(file => file.startsWith("file_")); // Matches format: file_<id>_timestamp
};


function highlightDifferences(reference, target) {
    let diffResult = diff.diffWords(reference, target);
    return diffResult.map(part => {
        if (part.added) {
            return `<span class="text-diff">${part.value}</span>`;
        } else if (part.removed) {
            return `<del>${part.value}</del>`;
        }
        return part.value;
    }).join('');
}
// Function to process files using Puppeteer
const processFileWithPuppeteer = async (filePath) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(`file://${filePath}`, { waitUntil: "domcontentloaded" });

  // Apply all extraction functions
  const extractedData = {
    Navigator: await extractNavigator(page),
    HTMLElement: await extractHTMLElementUsingEvaluate(page),
    CSSMediaQueries: await extractCSSMediaQueriesUsingEvaluate(page),
    Window: await extractWindowUsingEvaluate(page),
    ComputedStyle: await extractComputedStyleUsingEvaluate(page),
    WebRTC: await extractWebRTCUsingSelectors(page),
    Intl: await extractIntlUsingSelectors(page),
    Timezone: await extractTimezoneUsingSelectors(page),
    Headless: await extractHeadlessUsingSelectors(page),
    Worker: await extractWorkerUsingSelectors(page),
    Resistance: await extractResistanceUsingSelectors(page),
    Screen: await extractScreenUsingSelectors(page),
    WebGL: await extractWebGLUsingSelectors(page),
    Canvas2D: await extractCanvas2DUsingSelectors(page),
    Fonts: await extractFontsUsingSelectors(page),
    SvgRect: await extractSvgRectUsingSelectors(page),
    DOMRect: await extractDOMRectUsingSelectors(page),
    Audio: await extractAudioUsingSelectors(page),
    Media: await extractMediaUsingSelectors(page),
    Speech: await extractSpeechUsingEvaluate(page),
    CSS: await extractCSSUsingEvaluate(page),
  };

  await browser.close();
  return extractedData;
};

// Route to render a single dashboard with all data
app.get("/dashboard", async (req, res) => {
  const files = getAllFiles();
  const extractedResults = [];

  for (const file of files) {
    const filePath = path.join(outputDir, file);
    const extractedData = await processFileWithPuppeteer(filePath);
    extractedResults.push({ file, extractedData });
  }

  res.render("index", { extractedResults });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
