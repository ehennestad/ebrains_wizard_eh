const {get_page, get_page_content, replace_page, create_page} = require("./wikiUtil.js");


const pagePromise = get_page_content('eivihe-sandbox', '/test1/test11');
pagePromise.then((str) => {console.log(str) }
)