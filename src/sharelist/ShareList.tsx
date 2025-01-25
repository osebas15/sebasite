import { Component, createEffect, For } from 'solid-js';
import { supabase } from '../backend/supabase';
import { createSignal, createResource } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Todo, TodoAction, TodoCell, TodoVerb } from './TodoCell';

interface ShareListProps {
    list_id?: string
}

const createLoadTodos = (list_id?: string) => (async () => {
    const { data, error } = await supabase
        .from<Todo>('todos')
        .select()
        .eq('list_id', list_id ?? 'empty')

    if (error) {
        console.error(error)
        throw error
    }

    return data
})

const ShareList: Component<ShareListProps> = ({list_id}) => {

    let [upstreamTodos, {mutate, refetch}] = createResource(createLoadTodos(list_id))
    let [todos, setTodos] = createStore<Todo[]>([])
    let [inputTodo, setInputTodo] = createSignal<string>('')
    
    createEffect(() => {
        const newTodos = upstreamTodos()
        if (newTodos) {
          setTodos(newTodos)
        }
    })

    async function completeTodo(id: number) {
        const { error } = await supabase
          .from<Todo>('todos')
          .update({
            is_complete: true
          })
          .eq('id', id)
        if (error) {
          console.error(error)
        }
    }

    async function createTodo(newTodo: Todo){
        const { data, error } = await supabase.from<Todo>('todos').insert({
            task: newTodo.task,
            is_complete: false,
          })
          if (error) {
            console.error(error)
          }
          setInputTodo('')
    }

    async function todoActions(verb: TodoVerb, updatedTodos: Todo[]){
        switch (verb) {
            case 'COMPLETE':
                updatedTodos.forEach((todo) => completeTodo(todo.id!))
                break
            case 'CREATE':
                updatedTodos.forEach((todo) => createTodo(todo))
                break
            default :
                console.error(`unimplemented switch case ${verb}`)
        }
    }

    return (
        <div>
            <input
                class="border-4"
                type="text"
                name="todo"
                value={inputTodo()}
                onInput={(e) => setInputTodo(e.target.value)}
            />
            <button onClick={() => todoActions('CREATE', [{
                task: inputTodo(),
                is_complete: false,
                list_id: list_id ?? 'error'
            }])}>
                New todo
            </button>
            <For each={todos}>
                {(todo) => <TodoCell todo={todo} action={todoActions}/>}
            </For>
        </div>
    )
};

export default ShareList