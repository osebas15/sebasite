import {
    Component
} from 'solid-js'

import {
    deleteIds,
    listIdToName
} from '../../../backend/listids'

import {
    useNavigate
} from '@solidjs/router'

import styles from './ListIdCell.module.css'

interface ListIdCellProps {
    id: string
}

const ListIdCell: Component<ListIdCellProps> = ({id}) => {
    const navigate = useNavigate()
    const name = listIdToName(id) || id

    const deleteClicked = () => {
        deleteIds([id])
    }

    const navigateToList = () => {
        navigate(`/sharelist/${id}`)
    }

    return(
        <div class={styles.listIdCell}>
            <button type="button" class={styles.name} onClick={navigateToList}>{name}</button>
            <button type="button" class={styles.remove} onClick={deleteClicked} aria-label={`Forget list ${name}`}>
                ×
            </button>
        </div>
    )
}

export default ListIdCell
