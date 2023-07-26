const {get_page, get_page_content, replace_page, create_page} = require("./wikiUtil.js");
const getTokenFromServiceAccount = require("../iam-ebrains/getToken.js")


// const { update_front_page, update_sub_page } = require("./datasharing/updatePageStatus.js");

// let collab_name = 'd-3e106eb9-1193-4693-813f-a80ad4fd937c'
// let key = "submit-metadata"

// update_front_page(collab_name, key, true)
// update_sub_page(collab_name, key, true)


// const pagePromise = get_page_content('eivihe-sandbox', '/test1/test11');
// pagePromise.then((str) => {console.log(str) }
// )


const onMetadataSubmitted = require("./datasharing/onMetadataSubmitted.js");

//const pagePromise = get_page_content('eivihe-sandbox', '/test1/test11');
//const pagePromise2 = get_page_content('d-06775046-9ef8-4a79-bfed-651677e1c6c8', '/');

//pagePromise.then((str) => {console.log(str) })
//pagePromise2.then((str) => {console.log(str) })

onMetadataSubmitted("d-06775046-9ef8-4a79-bfed-651677e1c6c8")