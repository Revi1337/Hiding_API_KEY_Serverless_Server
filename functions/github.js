const fetch = require("node-fetch");
const querystring = require("querystring");
const stringify = require("../utils/stringify.js");

// https://candid-sorbet-07dfa9.netlify.app/graphql

const GIT_ORIGIN = "https://api.github.com";
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json; charset=utf-8",
};

exports.handler = async (event) => {
  const {
    path,  
  } = event;

  const query = `query($userName:String!) {
    user(login: $userName){
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            } 
          }
        }
      }
    }
  }`

  const variables = `
  {
    "userName": "Revi1337"
  }
  `;

  const url = new URL(path, GIT_ORIGIN);
  console.log(path);
  
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ query, variables }),
      headers: { 
        "Content-Type": "application/json; charset=utf-8",
        "Authorization" : `Bearer ${process.env.GIT_API_KEY}`
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

// fetch('https://api.github.com/graphql', {
//   method: "POST",
//   body: JSON.stringify({ query, variables }),
//   headers: { 
//     "Content-Type": "application/json; charset=utf-8",
//     "Authorization" : 'Bearer KEY'
//   }
// })
// .then(res => res.json())
// .then(json => console.log(JSON.stringify(json.data, null, 2)))