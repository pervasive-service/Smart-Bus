const app = require('./src/app');
const config = require('./config/config.json');

// Start the server
const PORT = process.env.PORT || config.server.port;
const HOST = config.server.host;

app.listen(PORT, HOST, () => {
  console.log(`Server ${config.server.name} is running on ${HOST}:${PORT}`);
});


// const https = require('https');
// const fs = require('fs');
// const app = require('./src/app');

// const privateKey = fs.readFileSync('./config/privateKey.key', 'utf8');
// const certificate = fs.readFileSync('./config/certificate.crt', 'utf8');
// const credentials = { key: privateKey, cert: certificate };

// const httpsServer = https.createServer(credentials, app);
// const PORT = process.env.PORT || 443;

// httpsServer.listen(PORT, () => {
//   console.log(`HTTPS server running on port ${PORT}`);
// });