import { Component } from 'solid-js';
import style from './TodoCell.module.css'

type Todo = {
    id: number
    task: string
    is_complete: boolean
    inserted_at: string
    list_id: string
}

interface TodoCellProps {
    todo: Todo
}

const svgUnchecked = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="gray"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
    </svg>
);

const svgChecked = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="green"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="9 12 12 15 16 10" />
    </svg>
)

const TodoCell: Component<TodoCellProps> = ({todo}) => {
    return (
        <div class={style.main}>
            <b>{todo.task}</b>
            <button onClick={() => { console.log(`ohhwow ${todo.is_complete}`) }}>
                {todo.is_complete ? svgChecked() : svgUnchecked()}
            </button>
        </div>
    )
}

export { 
    TodoCell,
    type Todo
}