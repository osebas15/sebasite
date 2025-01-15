import {
    Component
} from 'solid-js'

interface ColoredLineProps { 
    height?: string,
    backgroundColor?: string,
    text?: string,
    textColor?: string,
}

const ColoredLine: Component<ColoredLineProps> = ({ height, backgroundColor, text, textColor }) => {
    const fontSize = `calc(${height} * 0.75)`
    return (
        <div
            style={{
                display: 'flex',
                "align-items": "center",
                color: textColor,
                "background-color": backgroundColor,
                height: height,
                margin: '0'
            }}
        >
            <b style={{ "font-size": fontSize, "margin-left": "40px" }}>{text}</b>
        </div>
    )
};

export default ColoredLine