const {get_page, get_page_content, replace_page, create_page} = require("./wikiUtil.js");

const onMetadataSubmitted = require("./datasharing/onMetadataSubmitted.js");

//const pagePromise = get_page_content('eivihe-sandbox', '/test1/test11');
//const pagePromise2 = get_page_content('d-06775046-9ef8-4a79-bfed-651677e1c6c8', '/');

//pagePromise.then((str) => {console.log(str) })
//pagePromise2.then((str) => {console.log(str) })

onMetadataSubmitted("d-06775046-9ef8-4a79-bfed-651677e1c6c8")