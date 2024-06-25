const axios = require("axios");
const c = require("chalk");

async function containsProfanity(text) {
  try {
    const response = await axios.get(
      `https://www.purgomalum.com/service/containsprofanity?text=${encodeURIComponent(text)}`,
    );

    if (response.data === "true") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(c.red(error));
    console.log(c.gray(error.stack));
    return false;
  }
}

module.exports = containsProfanity;
