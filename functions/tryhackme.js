const fetch = require("node-fetch");
const querystring = require("querystring");
const stringify = require("../utils/stringify.js");

const TRY_HACK_ME_ORIGIN = "https://tryhackme.com";
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json; charset=utf-8",
};

exports.handler = async (event) => {
  const {
    path,  
    queryStringParameters,
  } = event;

  const url = new URL(path, TRY_HACK_ME_ORIGIN);
  console.log(path);
  const parameters = querystring.stringify({
    ...queryStringParameters
  });

  // username=${username}
  url.search = parameters;
  
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
