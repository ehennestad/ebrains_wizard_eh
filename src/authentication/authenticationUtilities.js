
function getCodeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      return code;
    } else {
      console.error('Code parameter not found in URL');
      return null;
    }
  }

  
async function getToken() {
    
    //const code = getCodeFromURL();
    //const url = `api/auth/token?code=${code}`;
    
    const urlParams = new URLSearchParams(window.location.search);
    let url = 'api/auth/token'
    url += '?' + urlParams.toString();

    try {
      const tokenResponse = await fetch(url)
      if (!tokenResponse.ok) {
        // Handle non-2xx status codes
        throw new Error(`Failed to fetch token. Status: ${tokenResponse.status}`);
      }
      return tokenResponse.text();
    } catch (error) {
      // Handle network errors or other errors during fetch
      console.error('Error occurred while fetching token:', error.message);
    }
}

export default getToken;