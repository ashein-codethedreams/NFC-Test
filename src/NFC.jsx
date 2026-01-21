import { useState, useEffect } from "react";

const NfcReader = () => {
  const [status, setStatus] = useState("Idle");
  const [serialNumber, setSerialNumber] = useState("—");
  const [message, setMessage] = useState("—");

  const startScanning = async () => {
    // Check NFC only in browser
    if (typeof window === "undefined" || !("NDEFReader" in window)) {
      alert("Web NFC is not supported on this device/browser.");
      return;
    }

    try {
      const ndef = new window.NDEFReader();
      await ndef.scan();
      setStatus("Scanning… Tap NFC card");

      ndef.onreading = (event) => {
        const { serialNumber, message } = event;
        setSerialNumber(serialNumber || "Not available");
        setMessage("No NDEF data (secure card)");
        alert("NFC card detected!");
        setStatus("Detected");
      };

      ndef.onreadingerror = () => {
        setStatus("Card detected but cannot be read");
      };
    } catch (err) {
      console.error(err);
      setStatus("NFC permission denied or failed");
    }
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>NFC Tap Demo</h2>
      <p>Status: {status}</p>
      <p>Serial: {serialNumber}</p>
      <p>Message: {message}</p>

      <button onClick={startScanning} style={{ fontSize: 18 }}>
        Start NFC Scan
      </button>
    </div>
  );
};

export default NfcReader;
