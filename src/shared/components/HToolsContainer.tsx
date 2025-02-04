import { 
    Component,
    For,
    JSX
} from "solid-js";

import styles from "./HToolsContainer.module.css"

interface ToolContainer {
    tool: () => JSX.Element
    color: string
}

interface HToolsContainer {
    containers: ToolContainer[]
    minHeight: string
}

const HToolsContainer: Component<HToolsContainer> = ({containers, minHeight}) => {
    return (
        <div class={styles.h_tools_container}>
            <For each={containers} fallback={<a>error</a>}>
            { (toolContainer) => 
                <div class={styles.title_tool_container} style={{"min-height": minHeight}}>
                    {/*<b class={styles.title}>{toolContainer.title}</b>*/}
                    <div class={styles.tool_container}>
                        {toolContainer.tool()}      
                    </div>
                </div>
            }
            </For>
        </div>
    )
}

export {
    HToolsContainer,
    type ToolContainer
}