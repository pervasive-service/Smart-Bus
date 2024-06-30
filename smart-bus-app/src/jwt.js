var jwt = require('jsonwebtoken');
var fs = require('fs');
var http = require("https");
const axios = require('axios');
var bearervalidity = 0;
var resbearertoken;
//JSON Logging using bunyan
var Logger = require('bunyan');
//var log = new Logger({ name: 'ProvUI' /*, ... */ });

const utility = require("./utility");
const constValues = require("./Constants.json");
//var strftime = require('strftime');

var log = new Logger({ name: 'JWT', streams: [{ stream: utility.wrappedStdout(constValues.logbasedir + 'jwt.log') }] });
var errorlog = new Logger({ name: 'JWT', streams: [{ stream: utility.wrappedStdout1(constValues.logbasedir + 'jwt.log') }] });

//var log = Logger.createLogger({ name: 'JWT', streams: [{ type: 'rotating-file', path: constValues.logbasedir + 'JWT.log', period: '1d' }] });
//var errorlog = Logger.createLogger({ name: 'JWT', streams: [{ type: 'rotating-file', path: constValues.logbasedir + 'JWT.log', period: '1d' }] });

function manageApigeeBearer(callback) {
    log = log.child({ threadname: "/manageApigeeBearer" });
    errorlog = errorlog.child({ threadname: "/manageApigeeBearer" });
    try {
        if (process.env.token) {
            log.info("process.env.token :", process.env.token);
            const bearertoken = JSON.parse(process.env.token);
            log.info("bearertoken :", bearertoken);
            bearervalidity = bearertoken.issued_at + (bearertoken.expires_in * 1000);
            resbearertoken = bearertoken.access_token;
            log.info("bearervalidity:", bearervalidity);
            log.info("Available Token Issued at:", new Date(bearertoken.issued_at), Date.now());
            log.info("Available Token VALID UPTO:", new Date(bearervalidity), Date.now());
            if (bearervalidity) {
                log.info("Inside bearervalidity:", bearervalidity);
            } else {
                log.info("Inside bearervalidity else:", bearervalidity);
                bearervalidity = 0;
            }
        }
        if (process.env.token && bearervalidity - Math.floor(new Date().getTime()) > 25000) {
            log.info("No Need to Generate APIGEE Bearer, Existing Bearer is valid");
            log.info("Returning Bearer Token=", resbearertoken);
            callback(resbearertoken);
        } else {
            //var CLIENT_ID = "6Utkmf08PPOyqjejn4rVoThDJUW6uG1Z" //SPE CLIENT ID
            // var CLIENT_ID = "IB2ybK8ADw9RbnU6K7mNaZoTfYAoZmwh"
            //  var APIGEE_URL = "https://int.apibsit.vodafone.hu"

            var CLIENT_ID = constValues.apigee_clientId
            var APIGEE_URL = constValues.apigeeurl

            function getJsonDetails() {
                item = {}
                item["sub"] = CLIENT_ID;
                item["exp"] = (Math.floor(new Date().getTime() / 1000) + 250);
                item["iss"] = CLIENT_ID;
                item["aud"] = APIGEE_URL;
                return item;
            }
            var req_body = JSON.stringify(getJsonDetails())

            // sign with RSA SHA256
            //var privateKey = fs.readFileSync('./keys/privateKey_SPEApp.key');
            var privateKey = process.env.PROVAPP_PRIVKEY;
            var token = jwt.sign(req_body, privateKey, { algorithm: 'RS256' });

            log.info("Generating a new Token");

            const agent = new http.Agent({ ca: process.env.API_CERT });
            var options = {
                "method": "POST",
                "httpsAgent": agent,
                "port": 443,
                "url": constValues.apigeeurl + "/oauth2/token",
                "data": "grant_type=client_credentials&client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer&client_assertion=" + token,
                "headers": {
                    "content-type": "application/x-www-form-urlencoded",
                    "cache-control": "no-cache"
                }
            };
            axios(options).then(function (response) {
                bearer_new = response.data;
                log.info("BODY:", bearer_new);
                resbearertoken = bearer_new.access_token;
                log.info("GENERATED NEW BEARER TOKEN VALID FROM:", new Date(bearer_new.issued_at));
                log.info("Generated Bearer Token=", resbearertoken);
                log.info("Writing Token into File");
                process.env.token = JSON.stringify(bearer_new);
                log.info(process.env.token);
                callback(resbearertoken);
            }).catch(function (error) {
                errorlog = errorlog.child({ stack_trace: error.stack });
                errorlog.error("Error in Apigee token generation:", error.message);
            });
        }
    } catch (err) {
        errorlog = errorlog.child({ stack_trace: error.stack });
        errorlog.error("Error parsing JSON string:", err);
    }
}

module.exports.manageApigeeBearer = manageApigeeBearer;
