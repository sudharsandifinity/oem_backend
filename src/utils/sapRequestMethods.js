const { callSAP } = require("./sapRequest");

const sapGetRequest = async (req, endpoint, payload, headers, options = { responseType: "json" } ) => {
  const data = await callSAP(req, 'GET', endpoint, payload, headers, options);
  return data;
};

const sapPostRequest = async (req, endpoint, payload) => {
  const data = await callSAP(req, 'POST', endpoint, payload);
  return data;
};

const sapPatchRequest = async (req, endpoint, payload) => {
    const data = await callSAP(req, 'PATCH', endpoint, payload);
    return data;
};

const sapDeleteRequest = async (req, endpoint, payload) => {
    const data = await callSAP(req, 'DELETE', endpoint, payload);
    return data;
};

module.exports = { sapGetRequest, sapPostRequest, sapPatchRequest, sapDeleteRequest }