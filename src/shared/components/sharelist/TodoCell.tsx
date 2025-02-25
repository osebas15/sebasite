import { 
    Component,
    createSignal 
} from 'solid-js';
import style from './TodoCell.module.css'

type Todo = {
    id?: number
    task: string
    is_complete: boolean
    inserted_at?: string
    list_id: string
}

type TodoVerb = 'COMPLETE' | 'UNCHECK' | 'CREATE' | 'DELETE'

type TodoAction = (verb: TodoVerb, updatedTodos: Todo[]) => Promise<void>

interface TodoCellProps {
    todo: Todo
    action: TodoAction
}

const svgUnchecked = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="black"
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
        fill="aquamarine"
        stroke="black"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="9 12 12 15 16 10" />
    </svg>
)

const TodoCell: Component<TodoCellProps> = ({todo, action}) => {
    const [showHelp, setShowHelp] = createSignal(false);
    const [tooltipPosition, setTooltipPosition] = createSignal({ x: 0, y: 0 });

    let clickTimer: number | null = null;
    let helpFadeoutTimer: number | null = null;

    const handleClick = (event: MouseEvent) => {
        clearTimersAndHelpMessage()

        if (!todo.is_complete){
            action('COMPLETE', [todo])
        }
        else{
            clickTimer = window.setTimeout(() => {
                setShowHelp(true);

                const { clientX, clientY } = event;
                setTooltipPosition({ x: clientX, y: clientY });
                
                helpFadeoutTimer = window.setTimeout(() => {
                    setShowHelp(false)
                }, 4000)

            }, 500);
        }
    };

    const handleDoubleClick = () => {
        if (clickTimer) {
            clearTimersAndHelpMessage()
        }
        setShowHelp(false);
        action('UNCHECK', [todo])
    };

    const clearTimersAndHelpMessage = () => {
        if (clickTimer) {
            clearTimeout(clickTimer);
            clickTimer = null;
        }
        if (helpFadeoutTimer) {
            clearTimeout(helpFadeoutTimer);
            helpFadeoutTimer = null;
        }
        setShowHelp(false)
    }

    return (
        <div class={style.main}>
            <div class={style.button_container}>
                <button 
                    class={style.checkcircle} 
                    onClick={handleClick}
                    onDblClick={handleDoubleClick}
                >
                    {todo.is_complete ? svgChecked() : svgUnchecked()}
                </button>
                {showHelp() && 
                    <p 
                        class={style.tooltip}
                        style={{
                            top: `${tooltipPosition().y - 60}px`, // Position above the click
                            left: `${tooltipPosition().x}px`,
                        }}
                    >
                        double click to clear todo
                    </p>
                }
            </div>
            <b class={style.task}>{todo.task}</b>
        </div>
    )
}

export { 
    TodoCell,
    type TodoAction,
    type TodoVerb,
    type Todo
}