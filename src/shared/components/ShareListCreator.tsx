import { 
    Component
} from 'solid-js'

import {
    useNavigate
} from '@solidjs/router'

import { v4 } from 'uuid';

const ShareListCreator: Component = () => {
    const navigate = useNavigate()
    const handleClick = () => {
        const id = v4().toString().split('-')[0]
        navigate(`/sharelist/${id}`)
    }

    return (
        <a>
            <button type="button" onClick={handleClick}>
                your list
            </button>
        </a>
    )
}

export default ShareListCreator