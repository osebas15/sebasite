import { 
    Component, 
    createEffect, 
    For, 
    createSignal, 
    createResource,
    onMount 
} from 'solid-js';

import { RealtimeSubscription } from '@supabase/supabase-js'
import { supabase } from '../backend/supabase';
import { createStore } from 'solid-js/store';

import styles from './ShareList.module.css'
import { Todo, TodoAction, TodoCell, TodoVerb } from './TodoCell';


interface ShareListProps {
    list_id?: string
}

const createLoadTodos = (list_id?: string) => (async () => {
    const { data, error } = await supabase
        .from<Todo>('todos')
        .select()
        .eq('list_id', list_id)

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

    let subscription: RealtimeSubscription | null
    
    createEffect(() => {
        const newTodos = upstreamTodos()
        if (newTodos) {
          setTodos(newTodos)
        }
    })

    onMount(() => {
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            createTodo({
                task: inputTodo(),
                is_complete: false,
                list_id: list_id ?? 'error'
            })
          }
        })
    
        subscription = supabase
          .from<Todo>('todos')
          .on('*', (payload) => {
            switch (payload.eventType) {
              case 'INSERT':
                setTodos((prev) => [...prev, payload.new])
                break
              case 'UPDATE':
                setTodos((item) => item.id === payload.new.id, payload.new)
                break
              case 'DELETE':
                setTodos((prev) => prev.filter((item) => item.id != payload.old.id))
                break
            }
          })
          .subscribe()
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
        const { data, error } = await supabase.from<Todo>('todos').insert(newTodo)
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
        <div class={styles.main}>
          <div class={styles.inputContainer}>
            <input
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
          </div>
          <For each={todos}>
              {(todo) => <TodoCell todo={todo} action={todoActions}/>}
          </For>
        </div>
    )
};

export default ShareList