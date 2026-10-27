import { 
  createSignal, 
  createEffect, 
  Component
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
  createEffect(() => {(async () => {
      const qrData = await QRCode.toDataURL(text() || placeholder || "", { width: 240, margin: 1 })
      setQrCode(qrData);
    })()
  })

  return (
    <div class={styles.QRCodeCreator}>
      <label class="label" for="qr-input">Text or URL</label>
      <input
        id="qr-input"
        type="text"
        placeholder={`${placeholder ?? 'Enter text or URL'}`}
        value={text()}
        onInput={(e) => setText(e.target.value)}
      />
      {qrCode() && (
        <div class={styles.QRCodeWrapper}>
          <img src={qrCode()} alt={`QR code for ${text() || placeholder}`} width="240" height="240" />
          <a class="btn" href={qrCode()} download="qrcode.png">Download PNG</a>
        </div>
      )}
    </div>
  );
}

export default QRGenerator;
