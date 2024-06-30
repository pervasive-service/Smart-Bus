import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import "./BulkUploadPage.css";
function BulkUploadPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedRecord, setRecord] = useState("");
  const [jsonData, setJsonData] = useState(null);
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [templates, setTemplates] = useState({});
  const [insertionResponse, setInsertionResponse] = useState(null);

  const [finalJson,setFinalJson]=useState(null);

//   const [jsonData, setJsonData] = useState(null);


  //   const [templates, setTemplates] = useState({});
  //   const [selectedTemplate, setSelectedTemplate] = useState('');
  //   const [availableTemplates, setAvailableTemplates] = useState([]);
  //   const [selectedFileType, setSelectedFileType] = useState('');
  const [convertedFile, setConvertedFile] = useState(null);
  //   const [fileTypes, setFileTypes] = useState({
  //     xlsx: false,
  //     xls: false,
  //     csv: false
  //   });
  const [selectedFileType, setSelectedFileType] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/bulk/get-templates"
        );
        setTemplates(response.data);
        setAvailableTemplates(
          Object.keys(response.data).map((modelName) => modelName + " Record")
        );
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchTemplates();
  }, []);
  // Function to fetch available templates from the server
  //   const fetchAvailableTemplates = () => {
  //     // Simulated fetch, replace with actual fetch from server
  //     const templates = ['Bus Records', 'Employee Records', 'Trips'];
  //     setAvailableTemplates(templates);
  //     setSelectedTemplate(templates[0]); // Select the first template by default
  //   };

  // Function to handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      if (file.name.endsWith(".csv")) {
        // For CSV files
        const data = csvToJSON(bstr);
        setJsonData(data);
      } else {
        // For Excel files
        const workbook = XLSX.read(bstr, { type: "binary" });
        const sheetName = workbook.SheetNames[0]; // Assuming data is in first sheet
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        setJsonData(data);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Function to convert CSV data to JSON
  const csvToJSON = (csv) => {
    const lines = csv.split("\n");
    const result = [];
    const headers = lines[0].split(",");
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split(",");
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return result;
  };

  // Function to convert JSON data to Excel file
  //   const convertJsonToExcel = (json) => {
  //     const worksheet = XLSX.utils.json_to_sheet(json);
  //     const workbook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  //     const excelBuffer = XLSX.write(workbook, {
  //       bookType: "xlsx",
  //       type: "array",
  //     });
  //     return excelBuffer;
  //   };
  const convertJsonToExcel = (json) => {
    const worksheet = XLSX.utils.json_to_sheet(json);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    return excelBuffer;
  };

  // Function to send JSON data to server
  const sendDataToServer = () => {
    // Code to send JSON data to server goes here
  };

  const handleRecordChange = (e) => {
    setRecord(e.target.value);
  };

  //   const handleFileTypeChange = (e) => {
  //     setSelectedFileType(e.target.value);
  //     // Reset converted file when file type changes
  //     setConvertedFile(null);
  //   };

  // const handleFileTypeChange = (e) => {
  //     setSelectedFileType(e.target.value);
  //     setConvertedFile(null);
  //     if (selectedTemplate && e.target.value) {
  //       handleConvert(e.target.value, selectedTemplate);
  //     }
  //   };

  //   const handleTemplateChange = (e) => {
  //     setSelectedTemplate(e.target.value);
  //     if (selectedFileType && e.target.value) {
  //       handleConvert(selectedFileType, e.target.value);
  //     }
  //   };

  const convertJsonToCsv = (json) => {
    const csv = Papa.unparse(json);
    return csv;
  };

  const handleConvert = (fileType, templateName) => {
    const actualTemplateName = templateName.replace(" Record", "");
    const templateData = templates[actualTemplateName]?.template;
    if (!templateData) {
      alert("Template data not found");
      return;
    }

    const jsonData = [templateData];

    let fileData;
    if (fileType === "xlsx" || fileType === "xls") {
      fileData = convertJsonToExcel(jsonData);
    } else if (fileType === "csv") {
      fileData = convertJsonToCsv(jsonData);
    }

    setConvertedFile(fileData);
  };

  const handleFileTypeChange = (e) => {
    const newFileType = e.target.value;
    setSelectedFileType(newFileType);
    setConvertedFile(null);

    if (selectedTemplate && newFileType) {
      handleConvert(newFileType, selectedTemplate);
    }
  };

  const handleTemplateChange = (e) => {
    const newTemplate = e.target.value;
    setSelectedTemplate(newTemplate);

    if (selectedFileType && newTemplate) {
      handleConvert(selectedFileType, newTemplate);
    }
  };

  const handleDownload = () => {
    if (!convertedFile) {
      alert("No file to download");
      return;
    }

    let blob;
    let filename;
    if (selectedFileType === "xlsx" || selectedFileType === "xls") {
      blob = new Blob([convertedFile], { type: "application/octet-stream" });
      filename = `${selectedTemplate}.${selectedFileType}`;
    } else if (selectedFileType === "csv") {
      blob = new Blob([convertedFile], { type: "text/csv" });
      filename = `${selectedTemplate}.csv`;
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

//   const BulkFileJsonConvert = (file) => {
//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       const bstr = evt.target.result;
//       let data;
//       if (file.name.endsWith(".csv")) {
//         // For CSV files
//         data = csvToJSON(bstr);
//       } else {
//         // For Excel files
//         const workbook = XLSX.read(bstr, { type: "binary" });
//         const sheetName = workbook.SheetNames[0]; // Assuming data is in first sheet
//         const worksheet = workbook.Sheets[sheetName];
//         data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//       }
//       setJsonData(data);
//     };
//     reader.readAsBinaryString(file);
//   };

//   const handleUpload =async () => {
//     if (!jsonData || !selectedRecord) {
//       alert("Please select a file and a record");
//       return;
//     }
//     // const formData = new FormData();
//     // formData.append('file', file);
  

//      // Adjust the URL according to your backend route
//   const url = `http://localhost:8080/${selectedRecord}/bulk-add`;
  

//   try {
//     const response = await axios.post(url, jsonData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     console.log('Response from server:', response.data);
//     // Handle the response from the server as needed
//   } catch (error) {
//     console.error('Error uploading and converting file:', error);
//     // Handle the error
//   }

//   };



    const transformData = (keys, values) => {
      return values.map((item) => {
        const obj = {};
        keys.forEach((key, index) => {
          const value = item[index];
          if (value !== null && value !== undefined) {
            if (key === "dateOfBirth" || key === "dateOfJoining") {
              obj[key] = value.split('T')[0]; // Formatting the date to YYYY-MM-DD
            } else {
              obj[key] = value;
            }
          }
        });
        return obj;
      });
    };

const handleFileUploadAndConvert = () => {
  if (!jsonData || !selectedRecord) {
   
    console.error('Error: JSON data or selected record is missing.');
    return;
  }
  // console.log((jsonData.length-1))

  //  console.log(jsonData[0]);
  //  console.log(jsonData[1]);
    const keys = jsonData[0];
    const values = jsonData.slice(1);
    setFinalJson(transformData(keys, values))
    // if(!finalJson)
    //   {
    //     console.error("issue while converting Excel to Json !!!")
    //   }


  handleJsonUploadAndConvert(finalJson, selectedRecord);
};
const handleJsonUploadAndConvert = async (finalJson, selectedRecord) => {
  if (!finalJson || !selectedRecord) {
    console.error('Error: JSON data or selected record is missing.');
    return;
  }

  // Adjust the URL according to your backend route
  // const url = `http://localhost:8080/bulk/${selectedRecord.toLowerCase()}/bulk-add`;
 // Adjust the URL according to your backend route
 const formattedRecord = selectedRecord.toLowerCase().replace(/ record/g, "").replace(/\s+/g, "");
 const url = `http://localhost:8080/bulk/${formattedRecord}/bulk-add`;
  console.log(url);

  try {
    const response = await axios.post(url, finalJson);
    console.log('Response from server:', response.data);
    setInsertionResponse(response.data); // Update state with insertion response

  } catch (error) {
    console.error('Error uploading and converting JSON data:', error);
    // Handle the error
  }
};

const renderDynamicTable = () => {
  if (!insertionResponse || !insertionResponse.insertedRecords || insertionResponse.insertedRecords.length === 0) {
    return null;
  }

  const headers = Object.keys(insertionResponse.insertedRecords[0]);

  return (
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {insertionResponse.insertedRecords.map((record, index) => (
          <tr key={index} style={{ backgroundColor: record.__v === 0 ? 'green' : 'red' }}>
            {headers.map((header) => (
              <td key={header}>{record[header]}</td>
            ))}
            <td>{record.__v === 0 ? 'Success' : 'Error'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
// Render the toast for Bulk Insertion Completed message
const renderBulkInsertionToast = () => {
  if (!insertionResponse || !insertionResponse.message) {
    return null;
  }

  return (
    <div className="toast">{insertionResponse.message}</div>
  );
};
  return (
    <div className="container">
      <div className="template-list">
        <div className="form-container">
          <div className="form-group">
            <label htmlFor="template" className="form-label">
              Template:
            </label>
            <select
              id="template"
              className="form-select"
              value={selectedTemplate}
              onChange={handleTemplateChange}
            >
              <option value="">Select</option>
              {availableTemplates.map((template, index) => (
                <option key={index} value={template}>
                  {template}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="fileType" className="form-label">
              File Type:
            </label>
            <select
              id="fileType"
              className="form-select"
              value={selectedFileType}
              onChange={handleFileTypeChange}
            >
              <option value="">Select</option>
              <option value="xlsx">xlsx</option>
              <option value="xls">xls</option>
              <option value="csv">csv</option>
            </select>
          </div>
        </div>

        <div className="button-group">
          <button
            className="button"
            onClick={handleDownload}
            disabled={!convertedFile}
          >
            Download
          </button>
        </div>
      </div>
      <label htmlFor="file" id="selectFileLabel" className="form-label">
        Select File:
      </label>
      <input
        type="file"
        id="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
      />

      <label htmlFor="record" id="selectRecordLabel" className="form-label">
        Record:
      </label>
      <select
        id="record"
        className="form-select"
        value={selectedRecord}
        onChange={handleRecordChange}
      >
        <option value="">Select</option>
        {availableTemplates.map((template, index) => (
          <option key={index} value={template}>
            {template}
          </option>
        ))}
      </select>

      <button onClick={handleFileUploadAndConvert}>Upload</button>
      {finalJson && (
        <div>
          <h2>Converted JSON Data</h2>
          <pre>
            {JSON.stringify(finalJson, null, 2)}
           {/* Render the insertion response table */}
            {renderDynamicTable()}

             {/* Render the Bulk Insertion Completed toast */}
            {renderBulkInsertionToast()}
          </pre>
        </div>
      )}
    </div>
  );
}

export default BulkUploadPage;
