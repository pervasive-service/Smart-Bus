//The common validator file which uses promise-style async function for validation
//Patterns used for server-side validation same as the ones used for client-side validation

//Importing patterns framework and loggers - Plain (old)
// const patterns = require("../provisioning-ui_frontend/src/assets/patterns.json");
const patterns = require("./public/assets/patterns.json");
// const dropdowns = require("../provisioning-ui_frontend/src/assets/dropdowns.json");
const dropdowns = require("./public/assets/dropdowns.json");
const utility = require("./utility");
const constValues = require("./Constants.json");
var Logger = require('bunyan');

//Creating a stream for logging
var log = new Logger({
  name: 'validator',
  streams: [
    {
      stream: utility.wrappedStdout(constValues.logbasedir + 'common-validator.log')
    }
  ],
});

//Patterns converted and stored as RegEx
const firstName = RegExp(patterns.customerfirstname.pattern);
const lastName = RegExp(patterns.customerlastname.pattern);
const custAccId = RegExp(patterns.customeraccountid.pattern);
const regionId = RegExp(patterns.regionid.pattern);
const serviceId = RegExp(patterns.serviceid.pattern);
const newVoip = RegExp(patterns.newvoip.pattern);
const portedVoip = RegExp(patterns.portedvoip.pattern);
const cpeMac = RegExp(patterns.cpemac.pattern);
const maxCpe = RegExp(patterns.maxnumberofcpes.pattern);
const staticIp = RegExp(patterns.staticip.pattern);
const ontSerial = RegExp(patterns.ontserialnumber.pattern);
const oltPortname = RegExp(patterns.oltportname.pattern);
const vlanId = RegExp(patterns.vlanid.pattern);
const vpnId = RegExp(patterns.vpnid.pattern);
const voipLine = RegExp(patterns.voipline.pattern);
const stbSerial = RegExp(patterns.stbserialnumber.pattern);
const chargeId = RegExp(patterns.chargeid.pattern);
const networkId = RegExp(patterns.networkid.pattern);
// const cpeSerial = RegExp(patterns.cpeserialnumber.pattern);
const emtaMac = RegExp(patterns.emtamac.pattern);
const scSerial = RegExp(patterns.scserialnumber.pattern);
const stbCasId = RegExp(patterns.stbcasid.pattern);
const platformPackageId = RegExp(patterns.platformpackageid.pattern);
const templateName = RegExp(patterns.templatename.pattern);
const targetNumber = RegExp(patterns.targetnumber.pattern);
const productFamilyInstanceId = RegExp(patterns.serviceid.pattern);
const ProductSpecificationRefId = RegExp(patterns.ProductSpecificationRefId.pattern);
const OrderType = RegExp(patterns.OrderType.pattern);
const woNumber = RegExp(patterns.woNumber.pattern);
const bandwidthPattern = RegExp(patterns.bandwidthValidation.pattern);
const batchNo = RegExp(patterns.batchNo.pattern);

//Creating a Map and storing the values of regex on server start
const patternMap = new Map();
patternMap.set('Customer_First_Name', firstName)
  .set('Customer_Last_Name', lastName)
  .set('Maximum_CPE', maxCpe)
  .set('Static_Ip_Address', staticIp)
  .set('Cpe_Mac', cpeMac)
  .set('New_Cpe_Mac', cpeMac)
  .set('Ont_Serial', ontSerial)
  .set('Olt_Port', oltPortname)
  .set('Phone_Number_1', voipLine)
  .set('Phone_Number_2', voipLine)
  .set('Maximum_CPE_VPN', maxCpe)
  .set('Vpn_Id', vpnId)
  .set('Vlan_Id', vlanId)
  .set('Phone_Number', voipLine)
  .set('ServiceId', serviceId)
  .set('ACS_ServiceId', serviceId)
  .set('New_Phone_Number', newVoip)
  .set('Ported_Phone_Number', portedVoip)
  .set('Charge_Id', chargeId)
  .set('Network_Id', networkId)
  .set('Region_Id', regionId)
  .set('ProductId', platformPackageId)
  .set('Stb_Serial_Number', stbSerial)
  .set('New_Cpe_Stb_Serial', stbSerial)
  .set('StbCasId', stbCasId)
  .set('Voip_Number', voipLine)
  .set('targetphonenumber', targetNumber)
  .set('macId', cpeMac)
  .set('emtaId', cpeMac)
  .set('customerId', custAccId)
  .set('templatename', templateName)
  .set('maxcpes', maxCpe)
  .set('productFamilyInstanceID', productFamilyInstanceId)
  .set('productSpecificationRefID', ProductSpecificationRefId)
  .set('ORDER_TYPE', OrderType)
  .set('woNumber', woNumber)
  .set('batchNo', batchNo)
  .set('Upstream_Bandwidth_Nominal', bandwidthPattern)
  .set('Downstream_Bandwidth_Nominal', bandwidthPattern)
  .set('Downstream_Bandwidth_Guaranteed', bandwidthPattern)
  .set('Upstream_Bandwidth_Nominal_VPN', bandwidthPattern)
  .set('Downstream_Bandwidth_Nominal_VPN', bandwidthPattern)
  .set('Downstream_Bandwidth_Guaranteed_VPN', bandwidthPattern);

//Dropdown values
const nominalDownstreamNum = dropdowns.internethfc_l2vpn.nominaldownstreambw;
var nominalDownstream = []; for (let code in nominalDownstreamNum) nominalDownstream.push(nominalDownstreamNum[code].toString());
const nominalUpstreamNum = dropdowns.internethfc_l2vpn.nominalupstreambw;
var nominalUpstream = []; for (let code in nominalUpstreamNum) nominalUpstream.push(nominalUpstreamNum[code].toString());
const guaranteedDownstreamNum = dropdowns.internethfc_l2vpn.guaranteeddownstreambw;
var guaranteedDownstream = []; for (let code in guaranteedDownstreamNum) guaranteedDownstream.push(guaranteedDownstreamNum[code].toString());
const b2bService = dropdowns.internethfc_producttemplate.b2bservice;
const ipAddressType = dropdowns.internethfc_fixedip_producttemplate.selectipaddresstype;
const portInportOutMobileBackUP = dropdowns.internethfc_internetgpon_voiphfc_voipgpon.staticiprequired_mobilebackuprequired_portin_portout;
const areaCodeNum = dropdowns.voiphfc_voipgpon_voipbarrings.enterareacode;
var areaCode = []; for (let code in areaCodeNum) areaCode.push(areaCodeNum[code].toString());
const stbType = dropdowns.tvhfc_voipgpon_queryoperations.selectstbtype;
const noOfStbNum = dropdowns.tvhfc_voipgpon.numberofstbs;
var noOfStb = []; for (let code in noOfStbNum) noOfStb.push(noOfStbNum[code].toString());
// const ncos = ["1","2","3","5","6","7","8","0"];
const optrControlled = dropdowns.voipbarrings.operatorcontrolledbarrings;
var ncos = []; for (let i in optrControlled) ncos.push(optrControlled[i][0].toString());
// const sctv = ["1","2","3","4","5","6","7","8","0"];
const custControlled = dropdowns.voipbarrings.customercontrolledbarrings;
var sctv = []; for (let i in custControlled) sctv.push(custControlled[i][0].toString());
const supplmentaryServiceArr = dropdowns.voipsupplementary.SupplmentaryService;
var supplmentaryService = []; for(let i in supplmentaryServiceArr) supplmentaryService.push(supplmentaryServiceArr[i].toString());
const mustCarry = dropdowns.producttemplate.mustcarry;
const productType = dropdowns.producttemplate.producttype;
const productName = dropdowns.producttemplate.selectproduct;
const selectAction = dropdowns.producttemplate.selectaction;
const lineNumber = dropdowns.voiphfc_voipgpon.selectsubaction.voiplinenumber;
const CreateOrderProductTypeArr = dropdowns.createorderstandard.ProductType;
var CreateOrderProductType = []; for(let i in CreateOrderProductTypeArr) CreateOrderProductType.push(CreateOrderProductTypeArr[i].toString());
const ProductSubTypeArr = dropdowns.createorderstandard.ProductSubType;
var ProductSubType = []; for(let i in ProductSubTypeArr) ProductSubType.push(ProductSubTypeArr[i].toString());
const productStatusArr = dropdowns.createorderstandard.ProductStatus;
var ProductStatus = []; for(let i in productStatusArr) ProductStatus.push(productStatusArr[i].toString());
const ProductCategoryArr = dropdowns.createorderstandard.ProductCategory;
var ProductCategory = []; for(let i in ProductCategoryArr) ProductCategory.push(ProductCategoryArr[i].toString());

//Creating a hashmap for dropdown values
const dropdownMap = new Map();
dropdownMap.set('B2B', b2bService)
  .set('IP_Address_Type', ipAddressType)
  .set('Static_IP_Address_Type', ipAddressType)
  .set('Mobile_BackUp', portInportOutMobileBackUP)
  .set('Area_Code', areaCode)
  .set('Port_In', portInportOutMobileBackUP)
  .set('Port_Out', portInportOutMobileBackUP)
  .set('Stb_Type', stbType)
  .set('No_Of_Stbs', noOfStb)
  .set('Line_Number', lineNumber)
  .set('Must_Carry', mustCarry)
  .set('Product_Type', productType)
  .set('Supplementary_Service', supplmentaryService)
  .set('Specific_Call_Type_Value', sctv)
  .set('ncos', ncos)
  .set('area_code', areaCode)
  .set('Areacode', areaCode)
  .set('productname', productName)
  .set('selectaction', selectAction)
  .set('nominalupstream', nominalUpstreamNum)
  .set('guaranteeddownstream', guaranteedDownstreamNum)
  .set('nominaldownstream', nominalDownstreamNum)
  .set('b2bservice', b2bService)
  .set('ipaddresstype', ipAddressType)
  .set('productType', CreateOrderProductType )
  .set('productSubType', ProductSubType)
  .set("productStatus", ProductStatus)
  .set("productCategory", ProductCategory);
//Generic payload-type validation
// async function serverSideValidator(payload, payloadType, endpoint) {
//   return new Promise((successResolve, errorReject) => {
//     success = false, total = 0, inValid = 0, notValidated = 0, erroredElements = [], notValidatedElements = [], validatedList = [], valid = 0;

//     //Assigning logic based on payload-type
//     if (payloadType == "query") {

//     } else if (payloadType == "json") {
//       _recursiveJsonSolver(payload);
//       if (inValid == 0 && total > 0) success = true;
//     }

//     if (success == true) {
//       var result = { "statusCode": '0000', "message": `Server side validation successful for ${endpoint} call`, "ssvstatus": 'ERROR' };
//       log.info(result, payload);
//       successResolve(result);
//     } else {
//       var result = { "statusCode": '1111', "message": `Error occured during Server side validation for ${endpoint} call`, "ssvstatus": 'ERROR' };
//       log.error(result, payload);
//       errorReject(result);
//     }

//   });
// }

//Middleware function
function validator(req, res, next) {
  var failure = false, pathname = req.path, payload;
  total = 0, inValid = 0, notValidated = 0, erroredElements = [], notValidatedElements = [], validatedList = [], valid = 0, empty = 0, emptyList = [];
  if (req.query.cpeid) {
    let cpeId = req.query.cpeid;
    payload = cpeId;
    if (cpeMac.test(cpeId)) {
      log.info(`Server side validation success for ${pathname} call with ${payload}`);
      next();
    } else failure = true;
  } else if (req.query.macid) {
    let macId = req.query.macid;
    payload = macId;
    if (cpeMac.test(macId)) {
      log.info(`Server side validation success for ${pathname} call with ${payload}`);
      next();
    } else failure = true;
  } else if (req.query.stbserialno) {
    let stbSerialNo = req.query.stbserialno;
    payload = stbSerialNo;
    if (stbSerial.test(stbSerialNo)) {
      log.info(`Server side validation success for ${pathname} call with ${payload}`);
      next();
    } else failure = true;
  } else if (req.query.tn) {
    let number = req.query.tn;
    payload = number;
    if (voipLine.test(number)) {
      log.info(`Server side validation success for ${pathname} call with ${payload}`);
      next();
    } else failure = true;
  } else if (req.query.tk) {
    let techkey = req.query.tk;
    payload = techkey;
    if (cpeMac.test(techkey)) {
      log.info(`Server side validation success for ${pathname} call with ${payload}`);
      next();
    } else failure = true;
  } else if (req.body) {
    let payloadJson = req.body;
    payload = JSON.stringify(payloadJson);
    _recursiveJsonSolver(payloadJson);
    if (inValid == 0 && total > 0 && erroredElements.length == 0) {
      log.info(`Server side validation success for ${pathname}, Total elements: ${total}, Valid elements: ${validatedList} - ${valid}, Errored elements: ${erroredElements} - ${inValid}, Skipped elements: ${notValidatedElements} - ${notValidated}, Empty elements: ${emptyList} - ${empty}`);
      next();
    } else failure = true;
  }

  if (failure == true) {
    if (req.body) log.error(`Error occured during Server side validation for ${pathname} call with ${payload}, Total elements: ${total}, Valid elements: ${validatedList} - ${valid}, Errored elements: ${erroredElements} - ${inValid}, Skipped elements: ${notValidatedElements} - ${notValidated}, Empty elements: ${emptyList} - ${empty}`);
    else log.error(`Error occured during Server side validation for ${pathname} call with ${payload}`);
    return res.status(422).send(`Error occured during Server side validation for ${pathname} call`);
  }
}



//A private recursive function that will loop through payload and validates the elements
function _recursiveJsonSolver(json, key = undefined) {
  if (typeof json == "string" || typeof json == "number") {
    total++;
    if (json != "" && json != " ") {
      if (patternMap.get(key) != undefined) {
        if (patternMap.get(key).test(json) != true) {
          inValid++;
          erroredElements.push(key);
        } else {
          valid++;
          validatedList.push(key);
        }
      } else if (dropdownMap.get(key) != undefined) {
        if (dropdownMap.get(key).includes(json) != true) {
          inValid++;
          erroredElements.push(key);
        } else {
          valid++;
          validatedList.push(key);
        }
      } else {
        notValidated++;
        notValidatedElements.push(key);
      }
    } else {
      empty++;
      emptyList.push(key);
    }
  } else if (typeof json == "object") for (var i in json) _recursiveJsonSolver(json[i], i);
}


// module.exports.serverSideValidator = serverSideValidator;
module.exports.validator = validator;