import {
    Component
} from 'solid-js'

import {
    deleteIds
} from '../../../backend/listids'

interface ListIdCellProps {
    id: string
}

const ListIdCell: Component<ListIdCellProps> = ({id}) => {
    const deleteClicked = () => {
        console.log("deleting")
        deleteIds([id])
    }

    return(
        <div>
            <button onClick={deleteClicked}>
                X
            </button>
            <b>{id}</b>
        </div>
    )
}

export default ListIdCell