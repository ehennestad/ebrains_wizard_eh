
const fetch = require("node-fetch")

const getTokenFromServiceAccount = require("../iam-ebrains/getToken.js")

const SERVER_URL = "https://drive.ebrains.eu"


async function get_request_header() {

  let token = await getDriveToken();

  const headers = {
    "Authorization": `Token ${token}`,
    "Accept": "application/json"
  };
  return headers;
}


async function getDriveToken() {
  let collab_access_token = await getTokenFromServiceAccount()

  const API_URL = "https://drive.ebrains.eu/api2/account/token/"

  const headers = {
    "Authorization": `Bearer ${collab_access_token}`,
  };

  const response = await fetch(API_URL, { headers });

  if (response.ok) {
    const driveToken = await response.text();
    return driveToken;
  } else {
    console.log('Request failed:', response.status)
    //const errors = await response.error();
    //console.log(errors)
    //throw new Error(`${errors.code} ${errors.reasonPhrase}: ${errors.description}`);
  }
}

async function ping() {
    //let token = await getTokenFromServiceAccount()

    let token = await getDriveToken();

    console.log(token)

    const ping_endpoint = '/api2/auth/ping/'

    const headers = {
      "Authorization": `Token ${token}`,
      "Accept": "application/json"
    };

    const url = SERVER_URL + ping_endpoint;

    const response = await fetch(url, { headers });
    //console.log('drive_token:', response.text())
    if (response.ok) {
      return response;
    } else {
      console.log(`Request failed:, ${response.status} (${response.statusText})`)
      return response;

      // const errors = await response.error();
      // console.log(errors)
      // throw new Error(`${errors.code} ${errors.reasonPhrase}: ${errors.description}`);
    }
  }

  async function getLibraries(type="") {

    api_endpoint = '/api2/repos/'

    if (type != "") {
      api_endpoint += `?type=${type}`
    }

    const headers = await get_request_header();

    const api_url = SERVER_URL + api_endpoint;
    
    const response = await fetch(api_url, { headers });

    repoList = await response.json();

    return repoList
  }

  async function getRepoByName(repoName) {
    const response = getLibraries();
    repoList = await response

    const repo = repoList.find(repo => repo.name === repoName);
    return repo
  }

  async function getFile(repoName, path="/") {
    const repo = await getRepoByName(repoName);
    const repoId = repo.id;
    const api_endpoint = `/api2/repos/${repoId}/file/?p=${path}`;
    
    const api_url = SERVER_URL + api_endpoint;

    const headers = await get_request_header();

    const response = await fetch(api_url, { headers });

    if (response.ok) {
      const file = await response.json();
      console.log(file)
      return file;
    }

  }

  async function getWikiStatusFile(repoName) {

    const path = `collab_scripts/${repoName}_dataset_variables.json`;

    const file = await getFile(repoName, path);
    
    filePath = await file;
    return filePath
  }

  module.exports = {ping, getDriveToken, getLibraries, getRepoByName, getWikiStatusFile};