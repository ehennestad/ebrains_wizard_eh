
function buildPath (collabId, relPath) {

    let url = `https://wiki.ebrains.eu/rest/wikis/xwiki/spaces/Collabs/spaces/${collabId}`;
    let relPathParts = relPath.split("/").filter(p => p);
    for (let i = 0; i < relPathParts.length; i++) {
    url += `/spaces/${relPathParts[i]}`;
    }
    url += "/pages/WebHome";
    return url;
}

module.exports = buildPath;