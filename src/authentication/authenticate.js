async function authenticate() {
    
    const urlParams = new URLSearchParams(window.location.search);

    let url = 'api/auth/requesturl'
    url += '?' + urlParams.toString();
    
    try {
        const urlResponse = await fetch(url)
        if (!urlResponse.ok) {
            // Handle non-2xx status codes
            throw new Error(`Failed to get auth request url. Status: ${urlResponse.status}`);
        }
        window.location.href = await urlResponse.text();
    } catch (error) {
        // Handle network errors or other errors during fetch
        console.error('Error occurred while fetching auth request url:', error.message);
    }
}

async function login() {

    const urlParams = new URLSearchParams(window.location.search);

    try {
        let url = 'api/auth/loginurl'
        url += '?' + urlParams.toString();

        const urlResponse = await fetch(url)
        if (!urlResponse.ok) {
            // Handle non-2xx status codes
            throw new Error(`Failed to login. Status: ${urlResponse.status}`);
        }
        window.location.href = await urlResponse.text();
    } catch (error) {
        // Handle network errors or other errors during fetch
        console.error('Error occurred while logging in:', error.message);
    }
}

async function logout() {
    const urlParams = new URLSearchParams(window.location.search);

    try {
        let url = 'api/auth/logouturl'
        url += '?' + urlParams.toString();
        
        const logoutResponse = await fetch(url)
        if (!logoutResponse.ok) {
            // Handle non-2xx status codes
            throw new Error(`Failed to logout. Status: ${logoutResponse.status}`);
        }
        window.location.href = await logoutResponse.text();
    } catch (error) {
        // Handle network errors or other errors during fetch
        console.error('Error occurred while logging out:', error.message);
    }
}

export default authenticate;
export { login, logout };
