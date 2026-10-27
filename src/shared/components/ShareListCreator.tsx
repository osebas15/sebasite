import { 
    Component,
    createSignal,
    onMount,
    For,
    Show
} from 'solid-js'

import {
    useNavigate
} from '@solidjs/router'

import ListIdCell from './sharelist/ListIdCell';

import { addListIds, storedListIds } from '../../backend/listids';
import { createShortUUID } from '../utils/crypto';

import styles from './ShareListCreator.module.css';

const ShareListCreator: Component = () => {
    const [listName, setListName] = createSignal("")
    const [listUUID, setListUUID] = createSignal("")

    const navigate = useNavigate()
    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault()
        let listId = `${listUUID()}-${listName()}`
        addListIds([listId])
        navigate(`/sharelist/${listId}`)
    }

    onMount(() => {
        setListUUID(createShortUUID())
    })

    return (
        <div class={styles.mainContainer}>
            <p class={styles.intro}>Make a checklist anyone with the link can edit in real time.</p>
            <form class={styles.form} onSubmit={handleSubmit}>
                <label class="visually-hidden" for="list-name">List name</label>
                <input 
                    id="list-name"
                    type="text" 
                    class={styles.textField} 
                    placeholder="Name your list" 
                    value={listName()} 
                    onInput={(e) => setListName(e.currentTarget.value)} 
                />
                <button type="submit" class="btn btn-primary">
                    Create list
                </button>
            </form>
            <Show when={storedListIds().length > 0}>
                <span class="label">Your lists</span>
                <ul class={styles.savedLists}>
                    <For each={storedListIds()}>
                        {(id) => <li><ListIdCell id={id}/></li>}
                    </For>
                </ul>
            </Show>
        </div>
    )
}

export default ShareListCreator
