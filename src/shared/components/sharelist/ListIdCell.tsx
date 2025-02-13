import {
    Component
} from 'solid-js'

import {
    deleteIds
} from '../../../backend/listids'

import {
    useNavigate
} from '@solidjs/router'

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
        <div>
            <button onClick={deleteClicked}>
                X
            </button>
            <b onClick={navigateToList}>{id}</b>
        </div>
    )
}

export default ListIdCell