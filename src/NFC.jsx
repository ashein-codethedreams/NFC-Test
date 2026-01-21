import { useState } from "react";

export default function NfcReader() {
  const [status, setStatus] = useState("Idle");

  const startScanning = async () => {
    if (typeof window === "undefined") {
      alert("Not running in browser");
      return;
    }

    if (!("NDEFReader" in window)) {
      alert("Web NFC not supported");
      return;
    }

    try {
      const ndef = new window.NDEFReader();
      await ndef.scan();
      setStatus("Scanning… Tap card");

      ndef.onreading = () => {
        alert("NFC card detected!");
        setStatus("Detected");
      };
    } catch (err) {
      setStatus("Failed: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>NFC Tap Demo</h2>
      <p>Status: {status}</p>
      <button onClick={startScanning}>Start Scan</button>
    </div>
  );
}
