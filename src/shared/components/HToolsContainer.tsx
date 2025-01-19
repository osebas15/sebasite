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
    containers: [ToolContainer]
}

const HToolsContainer: Component<HToolsContainer> = ({containers}) => {
    return (
        <div class={styles.h_tools_container}>
            <For each={containers} fallback={<a>error</a>}>
            { (toolContainer) => 
                <div>
                    {toolContainer.title}
                    {toolContainer.tool()}      
                </div>
            }
            </For>
        </div>
    )
}

export default HToolsContainer