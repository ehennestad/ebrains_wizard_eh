// Import the getToken function and the printUserInfo function from getToken.js
//
const getToken = require('./getToken.js')
const printUserInfo = getToken.printUserInfo

async function main() {
    let access_token = await getToken()
    // Call the printUserInfo function
    printUserInfo(access_token)
}

main()

