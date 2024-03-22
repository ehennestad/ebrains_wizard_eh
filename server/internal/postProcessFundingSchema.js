const fs = require('fs');
const path = require('path');

const fundingSchema = require('../../src/modules/Wizard/Schemas/funding.json');

const awardSchema = require('../../templates/source_schemas/special/awardDetails.json');
const fundingOfFunderSchema = require('../../templates/source_schemas/special/fundingOfFunder.json');


const fundingInstances = require('../data/kg-instances/Funding.json');
const organizationInstances = require('../data/kg-instances/Organization.json');

//console.log(fundingOfFunderSchema)
//console.log(fundingOfFunderSchema.dependencies.fundingMissing.oneOf[0].properties.existingFunding.examples)
//fundingSchema.definitions.funding.items.properties.funder.dependencies.term.oneOf[0].properties.instance.dependencies.organizationMissing.oneOf[0].properties.existingOrganization.dependencies
// postProcessFundingSchema()

module.exports = postProcessFundingSchema;
async function postProcessFundingSchema() {

    let oneOfList = [];

    // Loop through organization instances
    for (let org of organizationInstances) {
        // Add organization to funder options

        // Find funding instances matching the organization id
        let orgFundingInstances = fundingInstances.filter(funding => funding.funder['@id'] === org.identifier);
        //console.log(org.fullName)
        //console.log(orgFundingInstances)

        if (orgFundingInstances.length > 0) {
            // create list of ids for orgFundingInstances
            let orgFundingIds = orgFundingInstances.map(funding => funding.identifier);

            // create list of labels for orgFundingInstances
            let orgFundingLabels = orgFundingInstances.map(funding => {
                let label = "";

                if (funding.awardTitle) {
                    label = funding.awardTitle;
                } else {
                    label = "<no title>";
                }

                if (funding.awardNumber) {
                    label += " (" + funding.awardNumber + ")";
                }
                return label;
            });

            // copy fundingOfFunderSchema to new variable
            let thisFundingOfFunderSchema = JSON.parse(JSON.stringify(fundingOfFunderSchema));
            thisFundingOfFunderSchema.dependencies.fundingMissing.oneOf[0].properties.existingFunding.examples = orgFundingLabels;
            thisFundingOfFunderSchema.dependencies.fundingMissing.oneOf[0].properties.existingFunding.exampleIDs = orgFundingIds;

            // add thisFundingOfFunderSchema to oneOfList
            let oneOfItem = {
                "properties": {
                  "existingOrganization": {
                    "enum": [
                        org.fullName
                    ]
                  },
                  "funding" : thisFundingOfFunderSchema
                }
            }


            oneOfList.push(oneOfItem);

        } else {
            let thisAwardSchema = JSON.parse(JSON.stringify(awardSchema));

            let oneOfItem = {
                "properties": {
                  "existingOrganization": {
                    "enum": [
                        org.fullName
                    ]
                  },
                  "funding" : thisAwardSchema
                }
            }

            // remove funder from funder options

            oneOfList.push(oneOfItem);
        }
    }

    // Add one off list to fundingSchema
    fundingSchema.definitions.funding.items.properties.funder.dependencies.term.oneOf[0].properties.instance.dependencies.organizationMissing.oneOf[0].dependencies = {"existingOrganization": {"oneOf": oneOfList}};

    // Write fundingSchema to file
    const jsonStr = JSON.stringify(fundingSchema, null, 2);
    const filePath = path.join(__dirname, '../../src/modules/Wizard/Schemas/funding.json');
    fs.writeFile(filePath, jsonStr, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('File written successfully');
        }
    });

    //return fundingSchema;
}