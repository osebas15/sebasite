import { 
    Component,
    createSignal,
    onMount
} from 'solid-js'

import {
    useNavigate
} from '@solidjs/router'

import { addListIds } from '../../backend/listids';
import { createShortUUID } from '../utils/crypto';

import styles from './ShareListCreator.module.css';
import contStyles from "./HToolsContainer.module.css"

const ShareListCreator: Component = () => {
    const [listName, setListName] = createSignal("")
    const [listUUID, setListUUID] = createSignal("")

    const navigate = useNavigate()
    const handleClick = () => {
        let listId = `${listUUID()}-${listName()}`
        addListIds([listId])
        navigate(`/sharelist/${listId}`)
    }

    onMount(() => {
        setListUUID(createShortUUID())
    })

    return (
        <a class={styles.mainContainer}>
            <b class={contStyles.title}>Share your Todo List</b>
            <input 
                type="text" 
                class={styles.textField} 
                placeholder={listUUID()} 
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