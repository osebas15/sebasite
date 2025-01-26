import { 
    Component,
    For,
    JSX
} from "solid-js";

import styles from "./HToolsContainer.module.css"

interface ToolContainer {
    title: string
    tool: () => JSX.Element
    color: string
}

interface HToolsContainer {
    containers: ToolContainer[]
    height: string
}

const HToolsContainer: Component<HToolsContainer> = ({containers, height}) => {
    return (
        <div class={styles.h_tools_container}>
            <For each={containers} fallback={<a>error</a>}>
            { (toolContainer) => 
                <div class={styles.title_tool_container} style={{height: height}}>
                    {toolContainer.title}
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