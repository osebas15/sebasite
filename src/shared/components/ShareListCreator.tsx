import { 
    Component,
    createSignal
} from 'solid-js'

import {
    useNavigate
} from '@solidjs/router'

import styles from './ShareListCreator.module.css';
import contStyles from "./HToolsContainer.module.css"

import { v4 } from 'uuid';

const ShareListCreator: Component = () => {
    const [listName, setListName] = createSignal("")

    const navigate = useNavigate()
    const handleClick = () => {
        const id = v4().toString().split('-')[0]
        navigate(`/sharelist/${id}`)
    }

    return (
        <a class={styles.mainContainer}>
            <b class={contStyles.title}>Share your Todo List</b>
            <input 
                type="text" 
                class={styles.textField} 
                placeholder="Enter list name" 
                value={listName()} 
                onInput={(e) => setListName(e.currentTarget.value)} 
            />
            <button type="button" class={styles.centeredButton} onClick={handleClick}>
                create list
            </button>
        </a>
    )
}

export default ShareListCreator