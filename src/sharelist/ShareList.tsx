import { Component, createEffect, For } from 'solid-js';
import { supabase } from '../backend/supabase';
import { createSignal, createResource } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Todo, TodoCell } from './TodoCell';

interface ShareListProps {
    list_id?: string
}

const ShareList: Component<ShareListProps> = ({list_id}) => {

    const loadTodos = async () => {
        const { data, error } = await supabase
            .from<Todo>('todos')
            .select()
            .eq('list_id', list_id ?? 'empty')

        if (error) {
            console.error(error)
            throw error
        }
    
        return data
    }

    let [upstreamTodos, {mutate, refetch}] = createResource(loadTodos)

    let [todos, setTodos] = createStore<Todo[]>([])
    
    createEffect(() => {
        const newTodos = upstreamTodos()
        if (newTodos) {
          setTodos(newTodos)
        }
    })

    return (
        <div>
            {todos.length}
            <For each={todos}>
                {(todo) => <TodoCell todo={todo}/>}
            </For>
        </div>
    )
};

export default ShareList