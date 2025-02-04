import { 
    Component
} from 'solid-js'

import {
    useNavigate
} from '@solidjs/router'

import styles from './ShareListCreator.module.css';
import contStyles from "./HToolsContainer.module.css"

import { v4 } from 'uuid';

const ShareListCreator: Component = () => {
    const navigate = useNavigate()
    const handleClick = () => {
        const id = v4().toString().split('-')[0]
        navigate(`/sharelist/${id}`)
    }

    return (
        <a class={styles.mainContainer}>
            <b class={contStyles.title}>Share your Todo List</b>
            <button type="button" class={styles.centeredButton} onClick={handleClick}>
                create list
            </button>
        </a>
    )
}

export default ShareListCreator