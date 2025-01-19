import { 
  createSignal, 
  createEffect, 
  Component 
} from "solid-js";
import QRCode from "https://esm.sh/qrcode";
import styles from "./QRCodeCreator.module.css";

function QRGenerator() {
const [text, setText] = createSignal("");
const [qrCode, setQrCode] = createSignal("");

// Automatically generate QR Code whenever text changes
createEffect(async () => {
  if (text()) {
    const qrData = await QRCode.toDataURL(text(), { width: 200 });
    setQrCode(qrData);
  } else {
    setQrCode(""); // Clear QR Code if input is empty
  }
});

return (
  <div class={styles.QRCodeCreator}>
    <h1>Create a QR Code</h1>
    <input
      type="text"
      placeholder="Enter text or URL"
      value={text()}
      onInput={(e) => setText(e.target.value)}
    />
    {qrCode() && (
      <div>
        <img src={qrCode()} alt="QR Code" />
      </div>
    )}
  </div>
);
}

export default QRGenerator;