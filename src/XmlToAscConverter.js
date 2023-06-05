import React, { useState } from 'react';
import { parseString, Builder } from 'xml2js';
import './XmlToAscConverter.css';

const XmlToAscConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedContent, setConvertedContent] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleConvert = () => {
    if (!selectedFile) {
      alert('Please select an XML file.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const xmlContent = event.target.result;

      parseString(xmlContent, (err, result) => {
        if (err) {
          console.error(err);
          alert('Error parsing XML file.');
          return;
        }

        modifyXmlTags(result);

        const builder = new Builder();
        const modifiedXml = builder.buildObject(result);

        const ascContent = new Blob([modifiedXml], { type: 'text/plain' });
        setConvertedContent(URL.createObjectURL(ascContent));
      });

    };

    reader.readAsText(selectedFile);
  };

  const modifyXmlTags = (xmlObject) => {
    const xmlString = JSON.stringify(xmlObject)
    console.log(xmlString)
    const modifiedXmlString = xmlString.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '');

    // Add additional texts
    const additionalText = '<AdditionalTag>Additional Text</AdditionalTag>';
    const finalXmlString = modifiedXmlString.replace('</Root>', additionalText + '</Root>');

    // Add line breaks
    const formattedXmlString = finalXmlString.replace(/><(?!\?)/g, '>\n<');

    console.log(formattedXmlString);
  };

  return (
    <div className="container">
      <input type="file" onChange={handleFileUpload} />
      <button onClick={handleConvert}>Convert</button>
      {convertedContent && (
        <a href={convertedContent} download="converted.asc">
          Download Converted ASC File
        </a>
      )}
    </div>
  );
};

export default XmlToAscConverter;





