// These functions are adapted to javascript from Andrews python code
// https://gitlab.ebrains.eu/cnrs-neuroinformatics/kg-scripts/-/blob/main/xwiki.py

const fetch = require("node-fetch")

// Create an HTTP Agent to enable connection reuse
const http = require('http');
const https = require('https');

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });
const agent = (_parsedURL) => _parsedURL.protocol == 'http:' ? httpAgent : httpsAgent;

//const getTokenFromServiceAccount = require("../iam-ebrains/getToken.js")
let token = process.env.EBRAINS_ACCESS_TOKEN
token.trim()
console.log('token:', token)


const _build_url = require("./buildPath.js")

async function get_page(collab_id, path="/") {
    //let token = await getTokenFromServiceAccount()

    const headers = {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json"
    };
    const url = _build_url(collab_id, path);
    const response = await fetch(url, { headers, agent });
    if (response.ok) {
      return response.json();
    } else {
      const errors = await response.json();
      throw new Error(`${errors.code} ${errors.reasonPhrase}: ${errors.description}`);
    }
  }
  
  async function get_page_content(collab_id, path="/") {
    const page = await get_page(collab_id, path);
    return page.content;
  }
  
  async function replace_page(collab_id, new_content, path="/") {
    //let token = await getTokenFromServiceAccount()

    const url = _build_url(collab_id, path);
    const headers = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "text/plain",
      "Accept": "application/json"
    };
    //assert(typeof new_content === "string");
    //assert(new_content.length < 1e6);

    const response = await fetch(url, { headers, method: "PUT", body: new_content, agent });
    if (![201, 202].includes(response.status)) {
      const errors = await response.json();
      throw new Error(`${errors.code} ${errors.reasonPhrase}: ${errors.description}`);
    }
  }

  // function replace_page(collab_id, new_content, path = "/") {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       //let token = await getTokenFromServiceAccount()
  
  //       const url = _build_url(collab_id, path);
  //       const headers = {
  //         "Authorization": `Bearer ${token}`,
  //         "Content-Type": "text/plain",
  //         "Accept": "application/json"
  //       };
  //       //assert(typeof new_content === "string");
  //       const response = await fetch(url, { headers, method: "PUT", body: new_content });
  
  //       if (![201, 202].includes(response.status)) {
  //         const errors = await response.json();
  //         reject(errors)
  //         // throw new Error(`${errors.code} ${errors.reasonPhrase}: ${errors.description}`);
  //       }
  
  //       resolve(); // Resolve the Promise if everything is successful
  //     } catch (error) {
  //       reject(error); // Reject the Promise if there's an error
  //     }
  //   });
  // }
  

  async function create_page(collab_id, path, title, content) {
    //let token = await getTokenFromServiceAccount()

    assert(path.startsWith("/"));
    assert(path.length > 2);
    const url = _build_url(collab_id, path);
    const headers = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    };
    const data = {
      "title": title,
      "content": content
    };
    const response = await fetch(url, { headers, method: "PUT", body: JSON.stringify(data), agent });
    if (response.status !== 201) {
      const errors = await response.json();
      throw new Error(`${errors.code} ${errors.reasonPhrase}: ${errors.description}`);
    }
  }

  module.exports = {get_page, get_page_content, replace_page, create_page};