import React, { useState } from 'react';
import { parseString, Builder } from 'xml2js';
import './XmlToAscConverter.css';

const XmlToAscConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedContent, setConvertedContent] = useState('');

  const reloadPage = () => {
    window.location.reload()
  }

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

        const modifiedXmlObj = modifyXmlTag(result);

        const builder = new Builder();
        const modifiedXml = builder.buildObject(modifiedXmlObj);

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

  const modifyXmlTag = (xmlObject) => {
    const traverse = (node) => {
      if (Array.isArray(node)) {
        return node.map(traverse).join('\n');
      } else if (typeof node === 'object' && node !== null) {
        const keys = Object.keys(node);
        return keys.map((key) => `${traverse(node[key])}`).join('\n');
      } else if (typeof node === 'string') {
        // Remove the XML tags and add a new line after each tag
        return node.replace(/<[^>]*>/g, '') + '\n';
      } else {
        return '';
      }
    };
  
    const ascContent = traverse(xmlObject);

    console.log(ascContent)
  
    return ascContent;
  };
  

  return (
    <div className="container">
      <input type="file" onChange={handleFileUpload} />
     
      {!convertedContent ?
      (
        <button onClick={handleConvert}>Convert</button>
      ) :
      (
        <div className='output'>
         <a href={convertedContent} download="converted.asc">
          <button>
          Download Converted ASC File
          </button>
        </a>
        <button onClick={() => {reloadPage()}}>
          Convert a new file
          </button>
        </div>
       
      )}
    </div>
  );
};

export default XmlToAscConverter;





