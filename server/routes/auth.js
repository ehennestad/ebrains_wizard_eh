// Express is a framework for creating web 
const express = require('express'); 
const axios = require('axios')

const EBRAINS_IAM_SERVER = "https://iam.ebrains.eu/auth/realms/hbp";
const TOKEN_ENDPOINT = EBRAINS_IAM_SERVER + "/protocol/openid-connect/token";
const AUTH_ENDPOINT = EBRAINS_IAM_SERVER + "/protocol/openid-connect/auth";
const LOGOUT_ENDPOINT = EBRAINS_IAM_SERVER + "/protocol/openid-connect/logout";
const USERINFO_ENDPOINT = EBRAINS_IAM_SERVER + "/protocol/openid-connect/userinfo";

// Create a router to handle requests
const router = express.Router();

// Export the router so it can be used in the main app
module.exports = router;

router.get('/requesturl', getAuthRequestUrl);
router.get('/loginurl', getLoginUrl)
router.get('/logouturl', getLogOutUrl)
router.get('/user', getUser)
router.get('/token', getToken);



async function getToken(req, res) {

    try {      
      // Extract required parameters
      const authorizationCode = req.query.code; 
      let redirectUrl = process.env.WIZARD_OIDC_CLIENT_REDIRECT_URL;
      const clientId = process.env.WIZARD_OIDC_CLIENT_ID;
      const clientSecret = process.env.WIZARD_OIDC_CLIENT_SECRET;

      // Validate input parameters
      if (!authorizationCode || !redirectUrl || !clientId || !clientSecret) {
        throw new Error('Missing required parameters.');
      }

      if (req.query && Object.keys(req.query).length > 0) {
        // extract potential url parameters from the request and add them to the redirect url, but ignore code, session_state and iss
        delete req.query.code;
        delete req.query.session_state;
        delete req.query.iss;
        
        const searchParamString = new URLSearchParams(req.query).toString();
        if (searchParamString) {
          redirectUrl += '?' + searchParamString;
        }
      }

      // Construct request parameters
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code: authorizationCode,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUrl,
      });
  
      // Make POST request to get token
      const tokenResponse = await axios.post(TOKEN_ENDPOINT, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
  
      // Send token response to client
      res.status(tokenResponse.status).send(tokenResponse.data["access_token"]);
    } catch (error) {
      console.error('Error occurred while fetching token:', error.message);
      res.status(500).send('Internal server error');
    }
  }

async function getUser(req, res) {
    try {
      // Extract token from request
      const token = req.headers.authorization;
        
      // Validate input parameters
      if (!token) {
        throw new Error('Missing required parameters.');
      }
  
      // Make GET request to get user info
      const userResponse = await axios.get(USERINFO_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });

        // Get name, preferred_username, given_name, family_name, email from userResponse
        const userInfo = {
            name: userResponse.data.name,
            preferred_username: userResponse.data.preferred_username,
            given_name: userResponse.data.given_name,
            family_name: userResponse.data.family_name,
            email: userResponse.data.email,
        };
  
      // Send user response to client
      res.status(userResponse.status).send(userInfo);
    } catch (error) {
      console.error('Error occurred while fetching user:', error.message);
      res.status(500).send('Internal server error');
    }
  }

  async function getAuthRequestUrl(req, res) {

    try {
      // Extract required parameters
      const clientId = process.env.WIZARD_OIDC_CLIENT_ID;
      let redirectUrl = process.env.WIZARD_OIDC_CLIENT_REDIRECT_URL;
  
      // Validate environment parameters
      if (!redirectUrl || !clientId) {
        throw new Error('Missing required parameters.');
      }

      // Extract potential url parameters from the request and add them to the redirect url
      if (req.query && Object.keys(req.query).length > 0) {
            redirectUrl += '?' + new URLSearchParams(req.query).toString();
        }

      // Construct request parameters
      const params = new URLSearchParams({
        prompt: 'none',
        login: 'true',
        response_type: 'code',
        client_id: clientId,
        scope: 'openid',
        redirect_uri: redirectUrl,
      });

      // Send auth request to client
      res.status(200).send(AUTH_ENDPOINT + '?' + params.toString());
    } catch (error) {
      console.error('Error occurred while fetching auth request:', error.message);
      res.status(500).send('Internal server error');
    }
  }

async function getLoginUrl(req, res) {

    try {
      // Extract required parameters
      const clientId = process.env.WIZARD_OIDC_CLIENT_ID;
      let redirectUrl = process.env.WIZARD_OIDC_CLIENT_REDIRECT_URL;
  
      // Validate environment parameters
      if (!redirectUrl || !clientId) {
        throw new Error('Missing required parameters.');
      }

      // Extract potential url parameters from the request and add them to the redirect url
      if (req.query && Object.keys(req.query).length > 0) {
        const searchParamString = new URLSearchParams(req.query).toString();
        if (searchParamString) {
          redirectUrl += '?' + searchParamString;
        }
      }

      // Construct request parameters
      const params = new URLSearchParams({
        login: 'true',
        response_type: 'code',
        client_id: clientId,
        scope: 'openid',
        redirect_uri: redirectUrl,
      });
      
      // Send auth request to client
      res.status(200).send(AUTH_ENDPOINT + '?' + params.toString());
    } catch (error) {
      console.error('Error occurred while fetching auth request:', error.message);
      res.status(500).send('Internal server error');
    }
}

async function getLogOutUrl(req, res) {
    try {
      // Extract required parameters
      let redirectUrl = process.env.WIZARD_OIDC_CLIENT_REDIRECT_URL;
  
      // Validate environment parameters
      if (!redirectUrl) {
        throw new Error('Missing required parameters.');
      }

      // Extract potential url parameters from the request and add them to the redirect url
      if (req.query && Object.keys(req.query).length > 0) {
        const searchParamString = new URLSearchParams(req.query).toString();
        if (searchParamString) {
          redirectUrl += '?' + searchParamString;
        }
      }
  
      // Construct request parameters
      const params = new URLSearchParams({
        redirect_uri: redirectUrl,
      });
  
      // Send logout request to client
      const logoutUrl = LOGOUT_ENDPOINT + '?' + params.toString();
      
      res.status(200).send(logoutUrl);
    } catch (error) {
      console.error('Error occurred while fetching logout url:', error.message);
      res.status(500).send('Internal server error');
    }
  }