var fetchControlledTerms = require('../kg-util/fetchControlledTerms');
var fetchCoreSchemaInstances = require('../kg-util/fetchCoreSchemaInstances'); //   Todo?

configObject = [
    {
        openMindsType: "Person",
        typeProperties: ["familyName", "givenName"]
    },
    {
        openMindsType: "Organization",
        typeProperties: ["fullName"]
    },
    {
        openMindsType: "Consortium",
        typeProperties: ["fullName"]
    },
    {
        openMindsType: "Funding",
        typeProperties: ["awardTitle", "awardNumber", "funder"]
    },
]

    // Temporary to retrieve strains for the workbench:
    // configObject = {
    //     openMindsType: "Strain",
    //     typeProperties: ["name", "description"],
    //     space: "dataset"
    // }


module.exports = fetchDataFromKg;

async function fetchDataFromKg() {
    console.log('Fetching data from KG')
    await Promise.all( [fetchCoreSchemaInstances(configObject), fetchControlledTerms()] )
}