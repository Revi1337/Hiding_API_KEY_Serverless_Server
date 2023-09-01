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


// Reference
// https://velog.io/@bigsaigon333/Client-Side%EC%97%90%EC%84%9C-Youtube-API-Key-%EC%88%A8%EA%B8%B0%EA%B8%B0#2-netlify-functions%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%B4-%EB%82%98%EB%A7%8C%EC%9D%98-redirect-server%EB%A5%BC-%EB%A7%8C%EB%93%A4%EC%96%B4%EB%B3%B4%EC%9E%90
// https://365kim.tistory.com/93
// https://formason.tistory.com/13