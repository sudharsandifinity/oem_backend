const axios = require('axios');
const https = require('https');

exports.getBusinessPartners = async (req, res) => {
  try {
    const sessionId = req.cookies.B1SESSION;
    const routeId = req.cookies.ROUTEID;

    const response = await axios.get("https://192.168.100.82:50000/b1s/v2/BusinessPartners?$filter=CardType eq 'C'", {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      headers: {
        'Cookie': `B1SESSION=${sessionId}; ROUTEID=${routeId}`
      }
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching BusinessPartners', error: err.message });
  }
};
