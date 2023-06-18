const { update_front_page, update_sub_page } = require("./datasharing/updatePageStatus.js");


function onMetadataSubmitted (collab_name) {
    
    // testing
    let collab_name = 'd-3e106eb9-1193-4693-813f-a80ad4fd937c'

    let key = "submit-metadata"

    update_front_page(collab_name, key, true)
    update_sub_page(collab_name, key, true)

    // Todo:
    // Error handling, retrying on 401.
    // Update the collab status json on the drive. Check out seafile-js
}

