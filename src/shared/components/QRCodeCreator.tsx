import { 
  createSignal, 
  createEffect, 
  Component,
  onMount
} from "solid-js";
import QRCode from "qrcode";
import styles from "./QRCodeCreator.module.css";
import contStyles from "./HToolsContainer.module.css"

interface QRGeneratorProps {
  placeholder?: string
}

const QRGenerator: Component<QRGeneratorProps> = ({placeholder}) => {
  const [text, setText] = createSignal("");
  const [qrCode, setQrCode] = createSignal("");
  // Automatically generate QR Code whenever text changes
  createEffect(() => {(async () => {
      const qrData = await QRCode.toDataURL(text() || placeholder || "", { width: 200 })
      setQrCode(qrData);
    })()
  })

  return (
    <div>
      <b class={contStyles.title}>Create a QRCode</b>
      <div class={styles.QRCodeCreator}>
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
    </div>
  );
}

export default QRGenerator;