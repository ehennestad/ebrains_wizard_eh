import * as biologicalOrderModule from '../controlledTerms/biologicalOrder';
import * as biologicalSexModule from '../controlledTerms/biologicalSex';
import * as breedingTypeModule from '../controlledTerms/breedingType';
import * as cellCultureTypeModule from '../controlledTerms/cellCultureType';
import * as cellTypeModule from '../controlledTerms/cellType';
import * as contributionTypeModule from '../controlledTerms/contributionType';
import * as datasetLicenseModule from '../controlledTerms/datasetLicense';
import * as diseaseModule from '../controlledTerms/disease';
import * as diseaseModelModule from '../controlledTerms/diseaseModel';
import * as experimentalApproachModule from '../controlledTerms/experimentalApproach';
import * as geneticStrainTypeModule from '../controlledTerms/geneticStrainType';
import * as handednessModule from '../controlledTerms/handedness';
import * as molecularEntityModule from '../controlledTerms/molecularEntity';
import * as organModule from '../controlledTerms/organ';
import * as preparationTypeModule from '../controlledTerms/preparationType';
import * as semanticDataTypeModule from '../controlledTerms/semanticDataType';
import * as speciesModule from '../controlledTerms/species';
import * as studyTargetTermGroupModule from '../controlledTerms/studyTargetTermGroup';
import * as subcellularEntityModule from '../controlledTerms/subcellularEntity';
import * as techniqueModule from '../controlledTerms/technique';
import * as uBERONParcellationModule from '../controlledTerms/uBERONParcellation';

const biologicalOrder = biologicalOrderModule.default;
const biologicalSex = biologicalSexModule.default;
const breedingType = breedingTypeModule.default;
const cellCultureType = cellCultureTypeModule.default;
const cellType = cellTypeModule.default;
const contributionType = contributionTypeModule.default;
const datasetLicense = datasetLicenseModule.default;
const disease = diseaseModule.default;
const diseaseModel = diseaseModelModule.default;
const experimentalApproach = experimentalApproachModule.default;
const geneticStrainType = geneticStrainTypeModule.default;
const handedness = handednessModule.default;
const molecularEntity = molecularEntityModule.default;
const organ = organModule.default;
const preparationType = preparationTypeModule.default;
const semanticDataType = semanticDataTypeModule.default;
const species = speciesModule.default;
const studyTargetTermGroup = studyTargetTermGroupModule.default;
const subcellularEntity = subcellularEntityModule.default;
const technique = techniqueModule.default;
const uBERONParcellation = uBERONParcellationModule.default;

const instanceArray = [ biologicalOrder, biologicalSex, breedingType, cellCultureType, cellType, contributionType, datasetLicense, disease, diseaseModel, experimentalApproach, geneticStrainType, handedness, molecularEntity, organ, preparationType, semanticDataType, species, studyTargetTermGroup, subcellularEntity, technique, uBERONParcellation ];

const allInstances = [].concat(...instanceArray);
export default allInstances;