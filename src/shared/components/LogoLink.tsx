import {
    Component
} from 'solid-js'

import styles from '../../App.module.css';

interface LogoLinkProps {
    text: string
    link: URL
    imgSrc: string
}

const LogoLink: Component<LogoLinkProps> = ({text, link, imgSrc}) => {

    return (
        <a href={link.href} target="_blank" rel="noopener noreferrer" class={styles.logolink}>
            <img src={imgSrc}/>
            {text}
        </a>
    )
}

export default LogoLink

