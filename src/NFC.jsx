import React, { useState, useEffect } from 'react';

const NfcReader = () => {
  const [status, setStatus] = useState("Idle");
  const [serialNumber, setSerialNumber] = useState("");
  const [message, setMessage] = useState("");

  // Check if browser supports Web NFC
  const isNfcSupported = "NDEFReader" in window;

  const startScanning = async () => {
    if (!isNfcSupported) {
      alert("NFC is not supported on this browser/device. Try Chrome on Android.");
      return;
    }

    try {
      // 1. Create the reader
      const ndef = new window.NDEFReader();

      // 2. Start scanning (triggers permission prompt on first use)
      await ndef.scan();
      setStatus("Scanning... Tap an NFC card now.");
      
      // 3. Listen for reading errors
      ndef.onreadingerror = () => {
        setStatus("Error reading NFC tag. Please try again.");
      };

      // 4. Listen for the 'reading' event
      ndef.onreading = ({ message, serialNumber }) => {
        // Log the raw data
        console.log("> Serial Number: ", serialNumber);
        console.log("> Records: ", message.records);

        // Update state
        setSerialNumber(serialNumber);
        
        // Decode the text message if present
        if (message.records.length > 0) {
          const record = message.records[0];
          const textDecoder = new TextDecoder(record.encoding);
          const text = textDecoder.decode(record.data);
          setMessage(text);
        } else {
            setMessage("No NDEF records found on card.");
        }

        // Trigger the alert as requested
        alert(`NFC Card Detected!\nSerial: ${serialNumber}`);
        setStatus("Read successful!");
      };

    } catch (error) {
      console.error("Error: " + error);
      setStatus("Scan failed: " + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>NFC Tap Demo</h1>
      
      {!isNfcSupported && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Your browser does not support Web NFC. Please use Chrome on Android.
        </div>
      )}

      <div style={{ 
        border: '1px solid #ccc', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Serial Number:</strong> {serialNumber || "--"}</p>
        <p><strong>Message Data:</strong> {message || "--"}</p>
      </div>

      <button 
        onClick={startScanning} 
        disabled={!isNfcSupported}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isNfcSupported ? 'pointer' : 'not-allowed',
          opacity: isNfcSupported ? 1 : 0.6
        }}
      >
        Start NFC Scan
      </button>
    </div>
  );
};

export default NfcReader;