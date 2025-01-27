import { 
  createSignal, 
  createEffect, 
  Component,
  onMount
} from "solid-js";
import QRCode from "qrcode";
import styles from "./QRCodeCreator.module.css";

interface QRGeneratorProps {
  placeholder?: string
}

const QRGenerator: Component<QRGeneratorProps> = ({placeholder}) => {
  const [text, setText] = createSignal("");
  const [qrCode, setQrCode] = createSignal("");
  // Automatically generate QR Code whenever text changes
  createEffect(async () => {
    if (text()) {
      const qrData = await QRCode.toDataURL(text(), { width: 200 });
      
      setQrCode(qrData);
    } else {
      const qrData = await QRCode.toDataURL(placeholder ?? "", { width: 200 })
      
      setQrCode(qrData); // Clear QR Code if input is empty
    }
  });

  return (
    <div class={styles.QRCodeCreator}>
      <h1>Create a QR Code</h1>
      <input
        type="text"
        placeholder={`${placeholder ?? 'Enter text or URL'}`}
        value={text()}
        onInput={(e) => setText(e.target.value)}
      />
      {qrCode() && (
        <div class={styles.QRCodeWrapper}>
          <img src={qrCode()} alt="QR Code" />
        </div>
      )}
    </div>
  );
}

export default QRGenerator;