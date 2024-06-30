import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TemplateList = () => {
  const [templates, setTemplates] = useState({});

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('http://localhost:8080/template/get-templates');
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <div>
      {Object.entries(templates).map(([modelName, templateData]) => (
        <div key={modelName}>
          <h2>{modelName}</h2>
          <div>
            {Object.entries(templateData.template).map(([field, value]) => (
              <div key={field}>
                <strong>{field}:</strong> {value}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateList;
