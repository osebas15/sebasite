import { 
    Component
} from 'solid-js'

import {
    useNavigate
} from '@solidjs/router'

import styles from './ShareListCreator.module.css';

import { v4 } from 'uuid';

const ShareListCreator: Component = () => {
    const navigate = useNavigate()
    const handleClick = () => {
        const id = v4().toString().split('-')[0]
        navigate(`/sharelist/${id}`)
    }

    return (
        <a class={styles.mainContainer}>
            <button type="button" class={styles.centeredButton} onClick={handleClick}>
                create list
            </button>
        </a>
    )
}

export default ShareListCreator