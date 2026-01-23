const { callSAP } = require("./sapRequest");

const sapGetRequest = async (req, endpoint, payload, headers, options = { responseType: "json" } ) => {
  const userId = req.user.id;
  const data = await callSAP(userId, 'GET', endpoint, payload, headers, options);
  return data;
};

const sapPostRequest = async (req, endpoint, payload) => {
  const userId = req.user.id;
  const data = await callSAP(userId, 'POST', endpoint, payload);
  return data;
};

const sapPatchRequest = async (req, endpoint, payload) => {
    const userId = req.user.id;
    const data = await callSAP(userId, 'PATCH', endpoint, payload);
    return data;
};

const sapDeleteRequest = async (req, endpoint, payload) => {
    const userId = req.user.id;
    const data = await callSAP(userId, 'DELETE', endpoint, payload);
    return data;
};

module.exports = { sapGetRequest, sapPostRequest, sapPatchRequest, sapDeleteRequest }