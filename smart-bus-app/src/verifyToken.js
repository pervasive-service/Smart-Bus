var http = require("https");
const fs = require("fs");
const axios = require('axios');
//JSON Logging using bunyan
var Logger = require('bunyan');
//var log = new Logger({ name: 'ProvUI' /*, ... */ });

const utility = require("./utility");
const constValues = require("./Constants.json");
//var strftime = require('strftime');
//const e = require('express');
var log = new Logger({ name: 'VerfiyToken', streams: [{ stream: utility.wrappedStdout(constValues.logbasedir + 'verify-token.log') }] });
var errorlog = new Logger({ name: 'VerfiyToken', streams: [{ stream: utility.wrappedStdout(constValues.logbasedir + 'verify-token.log') }] });

//var log = Logger.createLogger({ name: 'verifyToken', streams: [{ type: 'rotating-file', path: constValues.logbasedir + 'verifyToken.log', period: '1d' }] });
//var errorlog = Logger.createLogger({ name: 'verifyToken', streams: [{ type: 'rotating-file', path: constValues.logbasedir + 'verifyToken.log', period: '1d' }] });

const agent = new http.Agent({ ca: process.env.SGW_CERT });
//const agent = new http.Agent({ rejectUnauthorized: false });

function verify(req, res, next) {
  if (!req.headers.authorization) {
    log.info("Unauthorized request: authorization header not available");
    return res.status(401).send('Unauthorized request');
  }
  let token = req.headers.authorization.split(' ')[1];
  let pagename = req.headers.pagename;
  log.info(`Request from ${pagename}`);
  if (token == null) {
    log.info("Unauthorized request: token not available");
    return res.status(401).send('Unauthorized request');
  } else {
    var options = {
      "method": "GET",
      "httpsAgent": agent,
      "url": constValues.sgw_url + "/oxauth/restv1/userinfo",
      "headers": {
        "Authorization": "Bearer " + token,
      }
    };
    axios(options).then(function (response) {
      res.locals.user = response.data.user_name;
      res.locals.traceid = response.data.user_name + token;

      log = log.child({ user: res.locals.user });
      log = log.child({ traceid: res.locals.traceid });
      log = log.child({ threadname: "/verifyToken" });
      log.info("Response:", response.data);
      log.info("User:", response.data.user_name);
      if (response.data.user_name && Array.isArray(response.data.member_of)) {
        const groups = response.data.member_of.map(a => {
          return a.split(",").filter(b => {
            return b.indexOf("CN") > -1
          })[0].split("=")[1];
        });
        let flag = 0;
        if (pagename == "refreshtoken"){
          flag++;
        } else if (pagename == "/voip-supplementry") {
          groups.forEach(element => {
            if (element === "appProvisioningUI_Admin" || element === "appProvisioningUI_General" || element === "appProvisioningUI_VOIP" || element === "appProvisioningUI_VOIPSupplementary")
              flag++;
          });
        } else if (pagename == "/voip-barrings") {
          groups.forEach(element => {
            if (element === "appProvisioningUI_Admin" || element === "appProvisioningUI_General" || element === "appProvisioningUI_VOIP" || element === "appProvisioningUI_VOIPSupplementary")
              flag++;
          });
        } else if (pagename == "/internet-hfc") {
          groups.forEach(element => {
            if (element === "appProvisioningUI_Admin" || element === "appProvisioningUI_General" || element === "appProvisioningUI_Internet")
              flag++;
          });
        } else if (pagename == "/voip-hfc") {
          groups.forEach(element => {
            if (element === "appProvisioningUI_Admin" || element === "appProvisioningUI_General" || element === "appProvisioningUI_VOIP")
              flag++;
          });
        } else if (pagename == "/tv-hfc") {
          groups.forEach(element => {
            if (element === "appProvisioningUI_Admin" || element === "appProvisioningUI_General" || element === "appProvisioningUI_TV")
              flag++;
          });
        } else if (pagename == "/l2vpn-hfc") {
          groups.forEach(element => {
            if (element === "appProvisioningUI_Admin" || element === "appProvisioningUI_General" || element === "appProvisioningUI_Internet")
              flag++;
          });
        } else if (pagename == "/fixed-ip") {
          groups.forEach(element => {
            if (element === "appProvisioningUI_Admin" || element === "appProvisioningUI_General" || element === "appProvisioningUI_Internet")
              flag++;
          });
        } else if (pagename == "/mobile-backup-hfc"){
          groups.forEach(element => {
            if (element === "appProvisioningUI_Admin" || element === "appProvisioningUI_General" || element === "appProvisioningUI_Internet")
            flag++;
          });
        } else if (pagename == "/cpe-inventory") {
          groups.forEach(element => {
            if (element === "appProvisioningUI_Admin" || element === "appProvisioningUI_General" || element === "appProvisioningUI_Internet" || element === "appProvisioningUI_TV" || element === "appProvisioningUI_VOIP")
              flag++;
          });
        } else if (pagename == "/product-template") {
          groups.forEach(element => {
            if (element === "appProvisioningUI_Admin" || element === "appProvisioningUI_Special")
              flag++;
          });
        } else if (pagename == "/query-operations"){
          flag++;
        }

        if (flag == 0){
          log.info("User not authorized for requested service");
          return res.status(403).send('User not authorized for requested service');
        } else {
          next();
        }
        // next();
      } else {
        log.info("No user details found");
        return res.status(401).send('Unauthorized Request');
      }
    }).catch(function (error) {
      errorlog = errorlog.child({ user: res.locals.user });
      errorlog = errorlog.child({ traceid: res.locals.traceid });
      errorlog = errorlog.child({ threadname: "/verifyToken" });
      errorlog = errorlog.child({ stack_trace: error.stack });
      errorlog.error("Unauthorized Request");
      return res.status(401).send('Unauthorized Request');
    });
  }
}
module.exports.verify = verify;