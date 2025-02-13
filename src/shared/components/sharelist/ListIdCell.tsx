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

    const deleteClicked = () => {
        console.log("deleting")
        deleteIds([id])
    }

    const navigateToList = () => {
        navigate(`/sharelist/${id}`)
    }

    return(
        <div class={styles.listIdCell}>
            <button onClick={deleteClicked}>
                X
            </button>
            <b class={styles.name} onClick={navigateToList}>{listIdToName(id) || id}</b>
        </div>
    )
}

export default ListIdCell