async function extractNavigator(page) {
 
  const strongElements = await page.$$("strong");
  let navigatorElement = null;

  for (const el of strongElements) {
      const text = await page.evaluate(el => el.textContent?.trim() || "", el);
      if (text.includes("Navigator")) {
          navigatorElement = el;
          break;
      }
  }

  if (!navigatorElement) return null;

  // Find the closest parent div
  const parentDiv = await page.evaluateHandle(el => el.closest("div"), navigatorElement);
  if (!parentDiv) return null;

  // Locate all direct child divs (ignoring deeply nested ones)
  const propertyDivs = await parentDiv.$$(":scope > div");
  if (!propertyDivs.length) return null;

  const properties = {}; // Object to store extracted properties

  for (const propertyDiv of propertyDivs) {
      // Extract the full text content of the property div (cleaned)
      let keyValueText = await page.evaluate(el => {
          // Remove <style> elements
          el.querySelectorAll("style").forEach(style => style.remove());

          return el.textContent
              .replace(/\s+/g, " ")  // Replace multiple spaces/newlines with a single space
              .replace(/[\n\t\r]/g, "") 
              .replace("×", "") // Remove special close characters
              .trim();
      }, propertyDiv);
      
      if (!keyValueText) continue; // Skip empty values

      // Extract the hash value if available
      const hashElement = await propertyDiv.$("span.hash");
      let hashValue = hashElement ? await page.evaluate(el => el.textContent?.trim() || null, hashElement) : null;

      // Extract key and main value
      let key, value;
      if (keyValueText.includes(":")) {
          let [tempKey, ...valueParts] = keyValueText.split(":");
          key = tempKey?.trim() || "Unknown Property";
          value = valueParts.join(":").trim() || null;
      } else {
          key = keyValueText.trim();
          value = null;
      }
      properties[key] =  value;
  }

  return { Navigator: properties };
}

async function extractHTMLElementUsingEvaluate(page) {
  return await page.evaluate(() => {
    const element = [...document.querySelectorAll("strong")].find((el) =>
      el.innerText.includes("HTMLElement")
    );
    if (!element) return null;

    const parentDiv = element.closest("div");
    if (!parentDiv) return null;

    const properties = {};
    parentDiv.querySelectorAll("div").forEach((div) => {
      const [key, ...value] = div.innerText.split(":");
      if (key && value.length > 0) {
        properties[key.trim()] = value.join(":").trim();
      }
    });

    return { "HTML Element": properties };
  });
}

//key
async function extractWindowUsingEvaluate(page) {
  return await page.evaluate(() => {
    const element = [...document.querySelectorAll("strong")].find((el) =>
      el.innerText.includes("Window")
    );
    if (!element) return null;

    const parentDiv = element.closest("div");
    if (!parentDiv) return null;

    const properties = {};
    parentDiv.querySelectorAll("div").forEach((div) => {
      const [key, ...value] = div.innerText.split(":");
      if (key && value.length > 0) {
        properties[key.trim()] = value.join(":").trim();
      }
    });

    return { Windows: properties };
  });
}
async function extractCSSMediaQueriesUsingEvaluate(page) {
  return await page.evaluate(() => {
    const element = [...document.querySelectorAll("strong")].find((el) =>
      el.innerText.includes("CSS Media Queries")
    );
    if (!element) return null;

    const parentDiv = element.closest("div");
    if (!parentDiv) return null;

    // Click on expandable details sections
    parentDiv.querySelectorAll("details").forEach((detail) => {
      detail.open = true;
    });

    const properties = {};
    parentDiv.querySelectorAll("div").forEach((div) => {
      const [key, ...value] = div.innerText.split(":");
      if (key && value.length > 0) {
        properties[key.trim()] = value.join(":").trim();
      }
    });

    return { CSSMedia: properties };
  });
}

async function extractComputedStyleUsingEvaluate(page) {
  return await page.evaluate(() => {
    const element = [...document.querySelectorAll("strong")].find((el) =>
      el.innerText.includes("Computed Style")
    );
    if (!element) return null;

    const parentDiv = element.closest("div");
    if (!parentDiv) return null;

    // Click on all expandable details elements
    parentDiv.querySelectorAll("details").forEach((detail) => {
      detail.open = true;
    });

    // Click on elements with hash-like identifiers
    parentDiv.querySelectorAll(".hash, .expandable").forEach((hash) => {
      hash.click();
    });

    const properties = {};
    parentDiv.querySelectorAll("div").forEach((div) => {
      const [key, ...value] = div.innerText.split(":");
      if (key && value.length > 0) {
        properties[key.trim()] = value.join(":").trim();
      }
    });

    return properties;
  });
}

async function extractCSSUsingEvaluate(page) {
  return await page.evaluate(() => {
    const element = [...document.querySelectorAll("strong")].find((el) =>
      el.innerText.includes("CSS")
    );
    if (!element) return null;

    const parentDiv = element.closest("div");
    if (!parentDiv) return null;

    // Click on all expandable details elements
    parentDiv.querySelectorAll("details").forEach((detail) => {
      detail.open = true;
    });

    // Click on elements with hash-like identifiers
    parentDiv.querySelectorAll(".hash, .expandable").forEach((hash) => {
      hash.click();
    });

    const properties = {};
    parentDiv.querySelectorAll("div").forEach((div) => {
      const [key, ...value] = div.innerText.split(":");
      if (key && value.length > 0) {
        properties[key.trim()] = value.join(":").trim();
      }
    });

    return properties;
  });
}

async function extractSpeechUsingEvaluate(page) {
  return await page.evaluate(() => {
    const element = [...document.querySelectorAll("strong")].find((el) =>
      el.innerText.includes("Speech")
    );
    if (!element) return null;

    const parentDiv = element.closest("div");
    if (!parentDiv) return null;

    // Click on all expandable details elements
    parentDiv.querySelectorAll("details").forEach((detail) => {
      detail.open = true;
    });

    // Click on elements with hash-like identifiers
    parentDiv.querySelectorAll(".hash, .expandable").forEach((hash) => {
      hash.click();
    });

    const properties = {};
    parentDiv.querySelectorAll("div").forEach((div) => {
      const [key, ...value] = div.innerText.split(":");
      if (key && value.length > 0) {
        properties[key.trim()] = value.join(":").trim();
      }
    });

    return properties;
  });
}

async function extractMediaUsingSelectors(page) {
  const elements = await page.$$("strong");

  let mediaElement = null;
  for (const el of elements) {
    const text = await page.evaluate((el) => el.innerText, el);
    if (text.includes("Media")) {
      mediaElement = el;
      break;
    }
  }

  if (!mediaElement) return null;

  const parentDivHandle = await mediaElement.evaluateHandle((el) =>
    el.closest("div")
  );
  if (!parentDivHandle) return null;

  // Click on all expandable details elements
  const detailsElements = await page.$$(
    `${await parentDivHandle.evaluate((el) =>
      el.tagName.toLowerCase()
    )} details`
  );
  for (const detail of detailsElements) {
    await detail.click();
  }

  // Click on elements with hash-like identifiers
  const hashElements = await page.$$(
    `${await parentDivHandle.evaluate((el) =>
      el.tagName.toLowerCase()
    )} .hash, .expandable`
  );
  for (const hash of hashElements) {
    await hash.click();
  }

  // Extract properties
  const properties = await page.evaluate((parent) => {
    const data = {};
    parent.querySelectorAll("div").forEach((div) => {
      const [key, ...value] = div.innerText.split(":");
      if (key && value.length > 0) {
        data[key.trim()] = value.join(":").trim();
      }
    });
    return data;
  }, parentDivHandle);

  return properties;
}
async function extractAudioUsingSelectors(page) {
  const elements = await page.$$("strong");

  let audioElement = null;
  for (const el of elements) {
    const text = await page.evaluate((el) => el.innerText, el);
    if (text.includes("Audio")) {
      audioElement = el;
      break;
    }
  }

  if (!audioElement) return null;

  const parentDivHandle = await audioElement.evaluateHandle((el) =>
    el.closest("div")
  );
  if (!parentDivHandle) return null;

  // Click on all expandable details elements
  const detailsElements = await page.$$(
    `${await parentDivHandle.evaluate((el) =>
      el.tagName.toLowerCase()
    )} details`
  );
  for (const detail of detailsElements) {
    await detail.click();
  }

  // Click on elements with hash-like identifiers
  const hashElements = await page.$$(
    `${await parentDivHandle.evaluate((el) =>
      el.tagName.toLowerCase()
    )} .hash, .expandable`
  );
  for (const hash of hashElements) {
    await hash.click();
  }

  // Extract properties
  const properties = await page.evaluate((parent) => {
    const data = {};
    parent.querySelectorAll("div").forEach((div) => {
      const [key, ...value] = div.innerText.split(":");
      if (key && value.length > 0) {
        data[key.trim()] = value.join(":").trim();
      }
    });
    return data;
  }, parentDivHandle);

  return properties;
}
async function extractDOMRectUsingSelectors(page) {
  const elements = await page.$$("strong");

  let domRectElement = null;
  for (const el of elements) {
    const text = await page.evaluate((el) => el.innerText, el);
    if (text.includes("DOMRect")) {
      domRectElement = el;
      break;
    }
  }

  if (!domRectElement) return null;

  const parentDivHandle = await domRectElement.evaluateHandle((el) =>
    el.closest("div")
  );
  if (!parentDivHandle) return null;

  // Click on all expandable details elements
  const detailsElements = await page.$$(
    `${await parentDivHandle.evaluate((el) =>
      el.tagName.toLowerCase()
    )} details`
  );
  for (const detail of detailsElements) {
    await detail.click();
  }

  // Click on elements with hash-like identifiers
  const hashElements = await page.$$(
    `${await parentDivHandle.evaluate((el) =>
      el.tagName.toLowerCase()
    )} .hash, .expandable`
  );
  for (const hash of hashElements) {
    await hash.click();
  }

  // Extract properties
  const properties = await page.evaluate((parent) => {
    const data = {};
    parent.querySelectorAll("div").forEach((div) => {
      const [key, ...value] = div.innerText.split(":");
      if (key && value.length > 0) {
        data[key.trim()] = value.join(":").trim();
      }
    });
    return data;
  }, parentDivHandle);

  return properties;
}

async function extractSvgRectUsingSelectors(page) {
  const elements = await page.$$("strong");

  let svgRectElement = null;
  for (const el of elements) {
    const text = await page.evaluate(
      (el) => el.innerText.trim().toLowerCase(),
      el
    );
    if (text.includes("svgrect")) {
      // Ensuring lowercase match
      svgRectElement = el;
      break;
    }
  }

  if (!svgRectElement) return null;

  const parentDivHandle = await svgRectElement.evaluateHandle((el) =>
    el.closest("div")
  );
  if (!parentDivHandle) return null;

  // Click on all expandable details elements
  const detailsElements = await page.$$(
    `${await parentDivHandle.evaluate((el) =>
      el.tagName.toLowerCase()
    )} details`
  );
  for (const detail of detailsElements) {
    await detail.click();
  }

  // Click on elements with hash-like identifiers
  const hashElements = await page.$$(
    `${await parentDivHandle.evaluate((el) =>
      el.tagName.toLowerCase()
    )} .hash, .expandable`
  );
  for (const hash of hashElements) {
    await hash.click();
  }

  // Extract properties
  const properties = await page.evaluate((parent) => {
    const data = {};
    parent.querySelectorAll("div").forEach((div) => {
      const [key, ...value] = div.innerText.split(":");
      if (key && value.length > 0) {
        data[key.trim()] = value.join(":").trim();
      }
    });
    return data;
  }, parentDivHandle);

  return properties;
}

async function extractFontsUsingSelectors(page) {
  const elements = await page.$$("strong");

  let fontsElement = null;
  for (const el of elements) {
    const text = await page.evaluate(
      (el) => el.innerText.trim().toLowerCase(),
      el
    );
    if (text.includes("fonts")) {
      fontsElement = el;
      break;
    }
  }

  if (!fontsElement) return null;

  const parentDivHandle = await fontsElement.evaluateHandle((el) =>
    el.closest("div")
  );
  if (!parentDivHandle) return null;

  // Click on all expandable details elements
  const detailsElements = await page.$$(
    `${await parentDivHandle.evaluate((el) =>
      el.tagName.toLowerCase()
    )} details`
  );
  for (const detail of detailsElements) {
    await detail.click();
  }

  // Click on elements with hash-like identifiers
  const hashElements = await page.$$(
    `${await parentDivHandle.evaluate((el) =>
      el.tagName.toLowerCase()
    )} .hash, .expandable`
  );
  for (const hash of hashElements) {
    await hash.click();
  }

  // Extract properties
  const properties = await page.evaluate((parent) => {
    const data = {};
    parent.querySelectorAll("div").forEach((div) => {
      const [key, ...value] = div.innerText.split(":");
      if (key && value.length > 0) {
        data[key.trim()] = value.join(":").trim();
      }
    });
    return data;
  }, parentDivHandle);

  return properties;
}

async function extractCanvas2DUsingSelectors(page) {
  const elements = await page.$$("strong");

  let canvas2DElement = null;
  for (const el of elements) {
    const text = await page.evaluate(
      (el) => el.innerText.trim().toLowerCase(),
      el
    );
    if (text.includes("canvas 2d")) {
      canvas2DElement = el;
      break;
    }
  }

  if (!canvas2DElement) return null;

  const parentDivHandle = await canvas2DElement.evaluateHandle((el) =>
    el.closest("div")
  );
  if (!parentDivHandle) return null;

  // Click on all expandable details elements
  const detailsElements = await page.$$(
    `${await parentDivHandle.evaluate((el) =>
      el.tagName.toLowerCase()
    )} details`
  );
  for (const detail of detailsElements) {
    await detail.click();
  }

  // Click on elements with hash-like identifiers
  const hashElements = await page.$$(
    `${await parentDivHandle.evaluate((el) =>
      el.tagName.toLowerCase()
    )} .hash, .expandable`
  );
  for (const hash of hashElements) {
    await hash.click();
  }

  // Extract properties
  const properties = await page.evaluate((parent) => {
    const data = {};
    parent.querySelectorAll("div").forEach((div) => {
      const [key, ...value] = div.innerText.split(":");
      if (key && value.length > 0) {
        data[key.trim()] = value.join(":").trim();
      }
    });
    return data;
  }, parentDivHandle);

  return properties;
}

async function extractWebGLUsingSelectors(page) {
  const elements = await page.$$("strong");

  let webGLElement = null;
  for (const el of elements) {
    const text = await page.evaluate(
      (el) => el.innerText.trim().toLowerCase(),
      el
    );
    if (text.includes("webgl")) {
      webGLElement = el;
      break;
    }
  }

  if (!webGLElement) return null;

  const parentDivHandle = await webGLElement.evaluateHandle((el) =>
    el.closest("div")
  );
  if (!parentDivHandle) return null;

  // Click on all expandable details elements
  const detailsElements = await page.$$(
    `${await parentDivHandle.evaluate((el) =>
      el.tagName.toLowerCase()
    )} details`
  );
  for (const detail of detailsElements) {
    await detail.click();
  }

  // Click on elements with hash-like identifiers
  const hashElements = await page.$$(
    `${await parentDivHandle.evaluate((el) =>
      el.tagName.toLowerCase()
    )} .hash, .expandable`
  );
  for (const hash of hashElements) {
    await hash.click();
  }

  // Extract properties
  const properties = await page.evaluate((parent) => {
    const data = {};
    parent.querySelectorAll("div").forEach((div) => {
      const [key, ...value] = div.innerText.split(":");
      if (key && value.length > 0) {
        data[key.trim()] = value.join(":").trim();
      }
    });
    return data;
  }, parentDivHandle);

  return properties;
}

async function extractScreenUsingSelectors(page) {
  const elements = await page.$$("strong");

  let screenElement = null;
  for (const el of elements) {
    const text = await page.evaluate(
      (el) => el.innerText.trim().toLowerCase(),
      el
    );
    if (text.includes("screen")) {
      screenElement = el;
      break;
    }
  }

  if (!screenElement) return null;

  const parentDivHandle = await screenElement.evaluateHandle((el) =>
    el.closest("div")
  );
  if (!parentDivHandle) return null;

  // Click on all expandable details elements
  const detailsElements = await page.$$(
    `${await parentDivHandle.evaluate((el) =>
      el.tagName.toLowerCase()
    )} details`
  );
  for (const detail of detailsElements) {
    await detail.click();
  }

  // Click on elements with hash-like identifiers
  const hashElements = await page.$$(
    `${await parentDivHandle.evaluate((el) =>
      el.tagName.toLowerCase()
    )} .hash, .expandable`
  );
  for (const hash of hashElements) {
    await hash.click();
  }

  // Extract properties
  const properties = await page.evaluate((parent) => {
    const data = {};
    parent.querySelectorAll("div").forEach((div) => {
      const [key, ...value] = div.innerText.split(":");
      if (key && value.length > 0) {
        data[key.trim()] = value.join(":").trim();
      }
    });
    return data;
  }, parentDivHandle);

  return properties;
}

async function extractResistanceUsingSelectors(page) {
  const elements = await page.$$("strong");

  let resistanceElement = null;
  for (const el of elements) {
    const text = await page.evaluate(
      (el) => el.innerText.trim().toLowerCase(),
      el
    );
    if (text.includes("resistance")) {
      resistanceElement = el;
      break;
    }
  }

  if (!resistanceElement) return null;

  const parentDivHandle = await resistanceElement.evaluateHandle((el) =>
    el.closest("div")
  );
  if (!parentDivHandle) return null;

  // Click on all expandable details elements
  const detailsElements = await parentDivHandle.$$(`details`);
  for (const detail of detailsElements) {
    await detail.click();
  }

  // Click on elements with hash-like identifiers
  const hashElements = await parentDivHandle.$$(`.hash, .expandable`);
  for (const hash of hashElements) {
    await hash.click();
  }

  // Extract properties, ensuring headings and answers are correctly paired
  const properties = await page.evaluate((parent) => {
    const data = {};
    const divs = [...parent.querySelectorAll("div")];

    for (let i = 0; i < divs.length - 1; i++) {
      const key = divs[i].innerText.trim();
      const value = divs[i + 1].innerText.trim();

      // Ensure key-value format is correct
      if (key && value && !data[key]) {
        data[key] = value;
      }
    }

    return data;
  }, parentDivHandle);

  return properties;
}

async function extractWorkerUsingSelectors(page) {
  const elements = await page.$$("strong");

  let workerElement = null;
  for (const el of elements) {
    const text = await page.evaluate(
      (el) => el.innerText.trim().toLowerCase(),
      el
    );
    if (text.includes("worker")) {
      workerElement = el;
      break;
    }
  }

  if (!workerElement) return null;

  const parentDivHandle = await workerElement.evaluateHandle((el) =>
    el.closest("div")
  );
  if (!parentDivHandle) return null;

  // Click on all expandable details elements
  const detailsElements = await parentDivHandle.$$(`details`);
  for (const detail of detailsElements) {
    await detail.click();
  }

  // Click on elements with hash-like identifiers
  const hashElements = await parentDivHandle.$$(`.hash, .expandable`);
  for (const hash of hashElements) {
    await hash.click();
  }

  // Extract properties, ensuring headings and answers are correctly paired
  const properties = await page.evaluate((parent) => {
    const data = {};
    const divs = [...parent.querySelectorAll("div")];

    for (let i = 0; i < divs.length - 1; i++) {
      const key = divs[i].innerText.trim();
      const value = divs[i + 1].innerText.trim();

      // Ensure key-value format is correct
      if (key && value && !data[key]) {
        data[key] = value;
      }
    }

    return data;
  }, parentDivHandle);

  return properties;
}

async function extractHeadlessUsingSelectors(page) {
  const elements = await page.$$("strong");

  let headlessElement = null;
  for (const el of elements) {
    const text = await page.evaluate(
      (el) => el.innerText.trim().toLowerCase(),
      el
    );
    if (text.includes("headless")) {
      headlessElement = el;
      break;
    }
  }

  if (!headlessElement) return null;

  const parentDivHandle = await headlessElement.evaluateHandle((el) =>
    el.closest("div")
  );
  if (!parentDivHandle) return null;

  // Click on all expandable details elements
  const detailsElements = await parentDivHandle.$$(`details`);
  for (const detail of detailsElements) {
    await detail.click();
  }

  // Click on elements with hash-like identifiers
  const hashElements = await parentDivHandle.$$(`.hash, .expandable`);
  for (const hash of hashElements) {
    await hash.click();
  }

  // Extract properties, dynamically handling different formats
  const properties = await page.evaluate((parent) => {
    const data = {};
    const divs = [...parent.querySelectorAll("div")];

    for (let i = 0; i < divs.length; i++) {
      const text = divs[i].innerText.trim();

      // If the div contains a key-value pair in a single line
      if (text.includes(":")) {
        const [key, ...value] = text.split(":");
        if (key && value.length > 0) {
          data[key.trim()] = value.join(":").trim();
        }
      }
      // If the structure is one div for the question and another for the answer
      else if (i < divs.length - 1) {
        const nextText = divs[i + 1].innerText.trim();
        if (nextText && !nextText.includes(":")) {
          data[text] = nextText;
        }
      }
    }

    return data;
  }, parentDivHandle);

  return properties;
}

async function extractTimezoneUsingSelectors(page) {
  const elements = await page.$$("strong");

  let timezoneElement = null;
  for (const el of elements) {
    const text = await page.evaluate(
      (el) => el.innerText.trim().toLowerCase(),
      el
    );
    if (text.includes("timezone")) {
      timezoneElement = el;
      break;
    }
  }

  if (!timezoneElement) return null;

  const parentDivHandle = await timezoneElement.evaluateHandle((el) =>
    el.closest("div")
  );
  if (!parentDivHandle) return null;

  // Click on all expandable details elements
  const detailsElements = await parentDivHandle.$$(`details`);
  for (const detail of detailsElements) {
    await detail.click();
  }

  // Click on elements with hash-like identifiers
  const hashElements = await parentDivHandle.$$(`.hash, .expandable`);
  for (const hash of hashElements) {
    await hash.click();
  }

  // Extract properties where <strong> is the title and the next <div> (skipping <span>) is the answer
  const properties = await page.evaluate((parent) => {
    const data = {};
    const strongElements = [...parent.querySelectorAll("strong")];

    strongElements.forEach((strong) => {
      const title = strong.innerText.trim();
      let nextElement = strong.nextElementSibling;

      // Skip <span> elements and find the next <div>
      while (nextElement && nextElement.tagName.toLowerCase() === "span") {
        nextElement = nextElement.nextElementSibling;
      }

      const answer =
        nextElement && nextElement.tagName.toLowerCase() === "div"
          ? nextElement.innerText.trim()
          : "N/A";

      if (title) {
        data[title] = answer;
      }
    });

    return data;
  }, parentDivHandle);

  return properties;
}

async function extractIntlUsingSelectors(page) {
  const elements = await page.$$("strong");

  let intlElement = null;
  for (const el of elements) {
    const text = await page.evaluate(
      (el) => el.innerText.trim().toLowerCase(),
      el
    );
    if (text.includes("intl")) {
      intlElement = el;
      break;
    }
  }

  if (!intlElement) return null;

  const parentDivHandle = await intlElement.evaluateHandle((el) =>
    el.closest("div")
  );
  if (!parentDivHandle) return null;

  // Click on all expandable details elements
  const detailsElements = await parentDivHandle.$$(`details`);
  for (const detail of detailsElements) {
    await detail.click();
  }

  // Click on elements with hash-like identifiers
  const hashElements = await parentDivHandle.$$(`.hash, .expandable`);
  for (const hash of hashElements) {
    await hash.click();
  }

  // Extract properties where <strong> is the title and the next <div> (skipping <span>) is the answer
  const properties = await page.evaluate((parent) => {
    const data = {};
    const strongElements = [...parent.querySelectorAll("strong")];

    strongElements.forEach((strong) => {
      const title = strong.innerText.trim();
      let nextElement = strong.nextElementSibling;

      // Skip <span> elements and find the next <div>
      while (nextElement && nextElement.tagName.toLowerCase() === "span") {
        nextElement = nextElement.nextElementSibling;
      }

      const answer =
        nextElement && nextElement.tagName.toLowerCase() === "div"
          ? nextElement.innerText.trim()
          : "N/A";

      if (title) {
        data[title] = answer;
      }
    });

    return data;
  }, parentDivHandle);

  return properties;
}

async function extractWebRTCUsingSelectors(page) {
  const elements = await page.$$("strong");

  let webrtcElement = null;
  for (const el of elements) {
    const text = await page.evaluate(
      (el) => el.innerText.trim().toLowerCase(),
      el
    );
    if (text.includes("webrtc")) {
      webrtcElement = el;
      break;
    }
  }

  if (!webrtcElement) return null;

  const parentDivHandle = await webrtcElement.evaluateHandle((el) =>
    el.closest("div.relative.col-six")
  );
  if (!parentDivHandle) return null;

  // Click on all expandable details elements
  const detailsElements = await parentDivHandle.$$(`details`);
  for (const detail of detailsElements) {
    await detail.click();
  }

  // Click on elements with hash-like identifiers
  const hashElements = await parentDivHandle.$$(`.hash, .expandable`);
  for (const hash of hashElements) {
    await hash.click();
  }

  // Extract key-value pairs
  const properties = await page.evaluate((parent) => {
    const data = {};
    const divs = [...parent.querySelectorAll("div")];

    for (let i = 0; i < divs.length; i++) {
      const key = divs[i].innerText.trim();
      let value = "N/A";

      // If next element is a block-text div, extract inside it
      if (
        divs[i].nextElementSibling &&
        divs[i].nextElementSibling.classList.contains("block-text")
      ) {
        value = divs[i].nextElementSibling.innerText.trim();
      }
      // If next element is a direct div, use its content
      else if (divs[i].nextElementSibling) {
        value = divs[i].nextElementSibling.innerText.trim();
      }

      if (key) {
        data[key] = value;
      }
    }

    return data;
  }, parentDivHandle);

  return properties;
}

module.exports = {
  extractNavigator,
  extractHTMLElementUsingEvaluate,
  extractCSSMediaQueriesUsingEvaluate,
  extractWindowUsingEvaluate,
  extractComputedStyleUsingEvaluate,
  extractWebRTCUsingSelectors,
  extractIntlUsingSelectors,
  extractTimezoneUsingSelectors,
  extractHeadlessUsingSelectors,
  extractWorkerUsingSelectors,
  extractResistanceUsingSelectors,
  extractScreenUsingSelectors,
  extractWebGLUsingSelectors,
  extractCanvas2DUsingSelectors,
  extractFontsUsingSelectors,
  extractSvgRectUsingSelectors,
  extractDOMRectUsingSelectors,
  extractAudioUsingSelectors,
  extractMediaUsingSelectors,
  extractSpeechUsingEvaluate,
  extractCSSUsingEvaluate,
};
