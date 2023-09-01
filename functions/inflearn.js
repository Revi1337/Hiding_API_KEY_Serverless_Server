const fetch = require("node-fetch");
const querystring = require("querystring");
const stringify = require("../utils/stringify.js");

const INFLEARN_ORIGIN = "https://account.inflearn.com";
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json; charset=utf-8",
};

exports.handler = async (event) => {
  const {
    path,  
    queryStringParameters,
  } = event;

  const url = new URL(path, INFLEARN_ORIGIN);
  console.log(path);
  const parameters = querystring.stringify({
    ...queryStringParameters
  });

  // year=${year}
  url.search = parameters;
  
  try {
    const response = await fetch(url, {
      headers: { 
        "Content-Type": "application/json; charset=utf-8",
        "Cookie": `${process.env.INFLEARN_SECRET_COOKIE}`
      },
      credentials: 'include'
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
