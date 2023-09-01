const fetch = require("node-fetch");
const querystring = require("querystring");
const stringify = require("../utils/stringify.js");

const HACK_THE_BOX_ORIGIN = "https://www.hackthebox.com";
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json; charset=utf-8",
};

exports.handler = async (event) => {
  const {
    path,  
  } = event;

  const url = new URL(path, HACK_THE_BOX_ORIGIN);
  console.log(path);
  
  try {
    const response = await fetch(url, {
      headers: { 
        "Content-Type": "application/json; charset=utf-8",
      }
    });

    const body = await response.json();

    if (body.error) {
      return {
        statusCode: body.error.code,
        ok: false,
        headers,
        body: stringify(body),
      };
    }

    return {
      statusCode: 200,
      ok: true,
      headers,
      body: stringify(body),
    };
  } catch (error) {
    return {
      statusCode: 400,
      ok: false,
      headers,
      body: stringify(error),
    };
  }
};

// fetch('https://www.hackthebox.com/api/v4/profile/activity/1002993', {
//   headers: { 
//     "Content-Type": "application/json; charset=utf-8",
//   }
// })  
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.json();  
//   })
//   .then(data => {
//     console.log(data);  
//   })
//   .catch(error => {
//     console.error('There was a problem with the fetch operation:', error);
//   });