
import _  from "lodash-uuid";


const OPENMINDS_VOCAB = "https://openminds.ebrains.eu/vocab/";
const EBRAINS_VOCAB = "https://kg.ebrains.eu/api/instances/";


export const setProperty = (object, name, value) => {
    if (Array.isArray(value)) {
        if (value.length) {
            object[`${OPENMINDS_VOCAB}${name}`] = value;
        }
    } else if (value !== null && value !== undefined && value !== "") {
        object[`${OPENMINDS_VOCAB}${name}`] = value;
    }
};

export const setPropertyWithLinks = (object, name, value) => {
    if (Array.isArray(value)) {
        const values = value.map(id => ({"@id": id}));
        setProperty(object, name, values);
    } else if (value !== null && value !== undefined && value !== "") {
        setProperty(object, name, {"@id": value})
    }
};

export const setPropertyWithLinksCreation = (documents, object, name, source, documentGenerator) => {
    const ids = createDocuments(documents, source, documentGenerator);
    setPropertyWithLinks(object, name, ids);
};

export const createDocument = (documents, type, key) => {
    if (key && documents.keys[type] && documents.keys[type][key]) {
        console.log("Reusing document", type, key);
        console.log(documents.keys)
        return documents.keys[type][key];
    }
    console.log("Creating document", type, key);
    const id = `${EBRAINS_VOCAB}${_.uuid()}`;
    const doc = {
        "@id": id,
        "@type": [type]
    }
    documents.ids[id] = doc;
    if (key) {
        if (!documents.keys[type]) {
            documents.keys[type] = {};
        }
        documents.keys[type][key] = id;
    }
    return id;
};

const createDocuments = (documents, source, documentGenerator) => {
    if (source === null || source === undefined) {
        return [];
    }

    const sourceList = Array.isArray(source)?source:[source];
    if (!sourceList.length) {
        return [];
    }

    const ids = sourceList
        .filter(item => item !== null && item !== undefined)
        .map(item => documentGenerator(documents, item));
    return ids;
};
