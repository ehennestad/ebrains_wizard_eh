const getRequestOptions = require("./getRequestOptions")
const fetch = require("node-fetch")


let BASE_URL = "https://support.humanbrainproject.eu"

let requestOptions = getRequestOptions();

let apiQueryUrl = BASE_URL + "/api/v1/tickets/15715";

fetch(apiQueryUrl, requestOptions)
.then( response => response.json() )
.catch( error => console.log(error.status) )

let myUpdate = {
    "title": "No help for you",
    "group": "Share data, models and software",
    "state": "open",
    "priority": "3 high",
    "article": {
       "subject": "Update via API",
       "body": "{\"number\":\"4815677\",\"title\":\"[Wizard Metadata Submission] Dorsal cortical mapping of angular head velocity tuning in mice\",\"group_id\":\"4\",\"owner_id\":\"202\",\"customer_id\":6708,\"state_id\":\"7\",\"priority_id\":\"2\",\"article\":{\"from\":\"Harry Carey\",\"to\":\"\",\"cc\":\"\",\"subject\":\"\",\"body\":\"testing from wizard\",\"content_type\":\"text/html\",\"ticket_id\":\"15715\",\"type_id\":10,\"sender_id\":1,\"internal\":false,\"in_reply_to\":\"\",\"form_id\":\"758967692\",\"subtype\":\"\"},\"updated_at\":\"2023-01-26T18:48:49.861Z\",\"preferences\":{\"channel_id\":11,\"escalation_calculation\":{\"first_response_at\":\"2022-10-10T08:38:29.458Z\",\"last_update_at\":\"2022-10-18T09:04:02.416Z\",\"close_at\":\"2022-11-01T07:02:18.293Z\",\"sla_id\":1,\"sla_updated_at\":\"2018-11-22T07:52:45.676Z\",\"calendar_id\":1,\"calendar_updated_at\":\"2023-01-15T02:23:27.386Z\",\"escalation_disabled\":false}},\"pending_time\":\"2023-02-01T07:00:00.000Z\",\"id\":15715}",
       "internal": true
    }
 };

requestOptions = {"method": "PUT", "body": JSON.stringify(myUpdate), "headers": requestOptions.headers, "referrer": "https://support.humanbrainproject.eu/", "mode": "cors"};

fetch(apiQueryUrl, requestOptions)
    .then( response => response.json() )
    .then( data => console.log('ticket_update:', data) )
    .catch( error => console.log(error.status) )
