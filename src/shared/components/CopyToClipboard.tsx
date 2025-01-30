import { 
    Component,
    createSignal
} from 'solid-js'

import styles from './CopyToClipboard.module.css'

interface CopyToClipboardProps{
    text: string
}

const new_clipboard_svg = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="blue"
    >
        <path d="M16 2H8c-1.1 0-2 .9-2 2v1H5c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-1V4c0-1.1-.9-2-2-2zm0 3v1H8V5h8zm3 15H5V7h14v13z"/>
    </svg>
)

const copied_clipboard_svg = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="gray"
    >
        <path d="M16 2H8c-1.1 0-2 .9-2 2v1H5c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-1V4c0-1.1-.9-2-2-2zm0 3v1H8V5h8zm3 15H5V7h14v13z"/>
    </svg>
)


const CopyToClipboard: Component<CopyToClipboardProps> = ({text}) => {
    const [copied, setCopied] = createSignal(false);
    
    const copyUrl = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 10000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };
    
    return (
        <div class={styles.copyToClipboard}>
            <a class={styles.urlText}>{text}</a>
            <button onClick={copyUrl}>
                {copied() ? copied_clipboard_svg : new_clipboard_svg}
            </button>
        </div>
    );
}

export default CopyToClipboard