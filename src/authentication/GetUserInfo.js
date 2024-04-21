function getUser(token) {
  return new Promise((resolve, reject) => {
    const url = 'api/auth/user'
    
    fetch(url, {
      headers: {
        Authorization: token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          // Handle non-2xx status codes
          reject(new Error(`Failed to get user. Status: ${response.status}`));
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        // Handle network errors or other errors during fetch
        reject(error);
      });
  });
}

export default getUser;