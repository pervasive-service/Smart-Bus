
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const config=require('../config/config.json')


function generateToken(payload, expiresIn = '1h') {
  const key=config.secretKey;
  logToFile(`Generate Token:  Payload:${payload} , key : ${key} `, 'jwt.log');
  return jwt.sign(payload,key, { expiresIn });
}

// const generateTemplateFromModel = (EntityModel) => {
//   const template = {};
//   const modelFields = EntityModel.schema.paths;
//   Object.keys(modelFields).forEach((field) => {
//     if (field !== '__v' && field !== '_id') {
//       // Exclude internal Mongoose fields like '__v' and '_id'
//       template[field] = undefined; // Set each field to undefined
//     }
//   });
//   return template;
// };


const generateTemplateFromModel = (EntityModel) => {
  const template = {};
  const modelFields = EntityModel.schema.paths;

  for (let fieldName in modelFields) {
    if (fieldName !== '__v' && fieldName !== '_id') {
      template[fieldName] = undefined; // Set each field to undefined
    }
  }

  return template;
};


function logToFile(message, logFileName) {
  try {
    // Ensure the logs directory exists
    const logDirectory = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, { recursive: true });
    }

    // Construct the full path to the log file
    const logFilePath = path.join(logDirectory, logFileName);

    // Create the log file if it doesn't exist
    if (!fs.existsSync(logFilePath)) {
      fs.writeFileSync(logFilePath, ''); // Create an empty file
    }

    // Append the message to the log file
    fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${message}\n`);
  } catch (error) {
    console.error('Error writing to log file:', error);
  }
}

async function sendMail(options) {
  try {
    const transporter = nodemailer.createTransport(options.transport);

    const mailOptions = {
      from: options.from,
      to: options.to,
      subject: options.subject,
      text: options.text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    logToFile(`Email sent: ${info.response}`, 'email.log');
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    logToFile(`Error sending email: ${error}`, 'email.log');
    return { success: false, error: 'Error sending email' };
  }
}



const validateJSONData = (EntityModel, jsonData) => {
  const validationErrors = [];
  let validCount = 0;
  const modelFields = EntityModel.schema.paths;

  // Generate validation rules based on the model schema
  const validationRules = {};
  for (let fieldName in modelFields) {
    if (fieldName !== '__v' && fieldName !== '_id') {
      const fieldSchema = modelFields[fieldName];
      validationRules[fieldName] = {};
      if (fieldSchema.isRequired) {
        validationRules[fieldName].required = true;
      }
      // Add more validation rules based on your schema (e.g., regex, min, max, etc.)
    }
  }

  // Validate each row of the uploaded JSON data
  jsonData.forEach((row, index) => {
    const errors = {};
    let isValid = true;
    for (let field in row) {
      const fieldValue = row[field];
      const fieldValidation = validationRules[field];
      if (fieldValidation) {
        if (fieldValidation.required && !fieldValue) {
          errors[field] = 'Field is required';
          isValid = false;
        }
        // Add more validation checks based on the validation rules
      }
    }
    if (Object.keys(errors).length > 0) {
      validationErrors.push({ row: index + 1, errors });
    } else {
      validCount++;
    }
  });

  return { validationErrors, validCount };
};

module.exports = {
  sendMail,
  logToFile,
  generateToken,
  generateTemplateFromModel,
  validateJSONData
};








// function wrappedStdout(filePath) {
//     const fs = require('fs');
//     const fileStream = fs.createWriteStream(filePath, {
//         flags: 'a',
//         encoding: 'utf8'
//     });

//     return {
//         write: entry => {
//             //JSON Logging using bunyan
//             var Logger = require('bunyan');
//             // to simplify StackDriver UX, use severity and timestamp fields
//             var logObject = JSON.parse(entry)
//             logObject["@timestamp"] = new Date().toString();
//             logObject["@version"] = logObject.v;
//             logObject.level = Logger.nameFromLevel[logObject.level].toUpperCase();
//             logObject.logger_name = logObject.name;
//             logObject.message = logObject.msg;
//             logObject.threadname = logObject.threadname;
           
//             delete logObject.v;
//             delete logObject.time;
//             delete logObject.msg;
//             delete logObject.hostname;
//             delete logObject.name;
//             delete logObject.pid;
//             var logLine = JSON.stringify(logObject, Logger.safeCycles()) + '\n';

//             fileStream.write(logLine);
//         }
//     };
// };
// function wrappedStdout1(filePath) {
//     const fs = require('fs');
//     const fileStream = fs.createWriteStream(filePath, {
//         flags: 'a',
//         encoding: 'utf8'
//     });

//     return {
//         write: entry => {
//             //JSON Logging using bunyan
//             var Logger = require('bunyan');
//             // to simplify StackDriver UX, use severity and timestamp fields
//             var logObject = JSON.parse(entry)
// 			//logObject.user = logObject.brtoken;
//             //logObject["@timestamp"] = logObject.time;
//             logObject["@timestamp"] = new Date().toString();
//             logObject["@version"] = logObject.v;
//             logObject.level = Logger.nameFromLevel[logObject.level].toUpperCase();
//             logObject.logger_name = logObject.name;
//             logObject.message = logObject.msg;
//             logObject.threadname = logObject.threadname;
			
//             delete logObject.v;
//             delete logObject.time;
//             delete logObject.msg;
//             delete logObject.hostname;
//             delete logObject.name;
//             delete logObject.pid;
//             var logLine = JSON.stringify(logObject, Logger.safeCycles()) + '\n';

//             fileStream.write(logLine);
//         }
//     };
// };
// module.exports.wrappedStdout = wrappedStdout;

// module.exports.wrappedStdout1 = wrappedStdout1;

