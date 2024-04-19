
const {get_page, get_page_content, replace_page, create_page} = require("../wikiUtil.js");


const get_status_message_dict = () => {
    
    let msg = {
        "appoint-contact-person": {
            'on': 'Contact person approved',
            'off': 'The custodian has not yet officially approved the contact person'
            },
        "ethics": {
            'on': 'Ethics approved',
            'off': 'You have not yet submitted the survey or it has not yet been approved'
        },
        "human-data-considerations": {
            'on': 'Consent for HDG received',
            'off': 'You have not yet submitted your consent for sharing data via the HDG'
        },
        "submit-metadata": {
            'on': 'Metadata submitted',
            'off': 'You have not yet submitted metadata'
        },
        "submit-data": {
            'on': 'Data submitted and data organization approved',
            'off': 'You have not yet submitted data or it has not yet been approved'
        },
        "submit-data-descriptor": {
            'on': 'Data descriptor approved',
            'off': 'You have not yet submitted a data descriptor or it has not yet been approved'
        },
        "approve-dataset-release": {
            'on': 'Dataset approved for release',
            'off': 'You have not yet approved the release of your dataset'
        }
    }

    for (let page_name in msg) {
        msg[page_name]['on'] = "{{success}}\nStatus: " + msg[page_name]['on'] +  "\n{{/success}}"
        msg[page_name]['off'] = "{{error}}\nStatus: " + msg[page_name]['off'] + "\n{{/error}}"
        //msg[page_name]['on'] = "{{success}}\r\nimage:icon:accept " + msg[page_name]['on'] +  "\r\n{{/success}}"
        //msg[page_name]['off'] = "{{error}}\r\nimage:icon:cancel " + msg[page_name]['off'] + "\r\n{{/error}}"
    }
    
    return msg
}

const get_fp_status_message_dict = () => {
    
    let msg = {
        "appoint-contact-person": {
            'on': 'Appoint a contact person',
        },
        "ethics": {
            'on': 'Ethics',
        },
        "human-data-considerations": {
            'on': 'Considerations for human data',
        },
        "submit-metadata": {
            'on': 'Submit metadata',
        },
        "submit-data": {
            'on': 'Submit data',
        },
        "submit-data-descriptor": {
            'on': 'Submit a data descriptor',
        },
        "approve-dataset-release": {
            'on': 'Preview your dataset prior to release',
        }
    }

    for (let page_name in msg) {
        msg[page_name]['off'] = "[[image:icon:cancel]] " + msg[page_name]['on']
        msg[page_name]['on'] = "[[image:icon:accept]] " + msg[page_name]['on']
    }
    
    return msg
}


async function update_front_page(collab_name, key, value) {

    return new Promise(async (resolve, reject) => {
        key = key.replace('_', '-')

        let msg_dict = get_fp_status_message_dict()

        let page_content = await get_page_content(collab_name, "")
        console.log('updating front page')
    
        if (value) {
            page_content = page_content.replace(msg_dict[key]['off'], msg_dict[key]['on'])
        } else {
            page_content = page_content.replace(msg_dict[key]['on'], msg_dict[key]['off'])
        }

        await replace_page(collab_name, page_content, path="")
        resolve()
    })
}


async function update_sub_page(collab_name, key, value) {
    return new Promise(async (resolve, reject) => {

        key = key.replace('_', '-')
        console.log('updating sub page')

        let msg_dict = get_status_message_dict()
        
        let page_path = "/" + key

        let page_content = await get_page_content(collab_name, page_path)
        

        // Get rid of /r which is added when editing and saving from source mode on wiki page
        page_content = page_content.replace( '{{error}}\r\n', '{{error}}\n' )
        page_content = page_content.replace( '\r\n{{/error}}', '\n{{/error}}' )
        page_content = page_content.replace( '{{success}}\r\n', '{{success}}\n' )
        page_content = page_content.replace( '\r\n{{/success}}', '\n{{/success}}' )
            
        if (value){
            page_content = page_content.replace(msg_dict[key]['off'], msg_dict[key]['on'])
        }
        else{
            page_content = page_content.replace(msg_dict[key]['on'], msg_dict[key]['off'])
        }
        
        await replace_page(collab_name, page_content, path=page_path)
        
        resolve()
    })
}

module.exports = { update_front_page, update_sub_page }