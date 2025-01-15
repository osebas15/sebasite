import {
    Component
} from 'solid-js'

interface LogoLinkProps {
    text: string
    link: URL
}

const LogoLink: Component<LogoLinkProps> = (props) => {
    let {
        text,
        link
    } = props

    return (
        <a href={link.href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
        />
            {props.text}
        </a>
    )
}

export default LogoLink

