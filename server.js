const app = require('./src/app');
const https = require("https");
const fs = require("fs");
const port = process.env.PORT || 3002;
 
const httpsOptions = {
  pfx: fs.readFileSync("mycert.pfx"),
  passphrase: process.env.SSL_PASS
};
 
https.createServer(httpsOptions, app).listen(3552, () => {
  console.log(`Server running on port ${port}`);
});