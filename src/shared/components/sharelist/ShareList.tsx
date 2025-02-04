import { 
    Component, 
    createEffect, 
    For, 
    createSignal, 
    createResource,
    onMount,
    onCleanup
} from 'solid-js';

import {
  useLocation
} from '@solidjs/router'

import { RealtimeSubscription } from '@supabase/supabase-js'
import { supabase } from '../../../backend/supabase';
import { createStore } from 'solid-js/store';

import styles from './ShareList.module.css'
import { Todo, TodoCell, TodoVerb } from './TodoCell';
import CopyToClipboard from '../CopyToClipboard';
import contStyles from "../HToolsContainer.module.css"

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

const orderTodos = (todos: Todo[]): Todo[] => {
  return [...todos].sort((left: Todo, right: Todo) => {
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - (10 * 60 * 1000));

    const leftDate = new Date(left.inserted_at ?? 0);
    const rightDate = new Date(right.inserted_at ?? 0);

    const leftIsRecent = leftDate > tenMinutesAgo;
    const rightIsRecent = rightDate > tenMinutesAgo;

    if (!(left.is_complete == right.is_complete)){
      return left.is_complete ? 1 : -1
    }

    if (leftIsRecent || rightIsRecent) {
      return rightDate.getTime() - leftDate.getTime(); // Newest to oldest
    }

    return left.task.localeCompare(right.task); // Alphabetical order
  })
}

const ShareList: Component<ShareListProps> = ({list_id}) => {

    let [upstreamTodos, {mutate, refetch}] = createResource(createLoadTodos(list_id))
    let [todos, setTodos] = createStore<Todo[]>([])
    let [inputTodo, setInputTodo] = createSignal<string>('')
    let [shareUrl, setShareUrl] = createSignal<string>('')

    let subscription: RealtimeSubscription | null

    let location = useLocation()
    
    createEffect(() => {
      const newShareUrl = `${window.location.origin}${location.pathname}`
      if (newShareUrl) {
        setShareUrl(newShareUrl)
      }

      const newTodos = upstreamTodos()
      if (newTodos) {
        setTodos(newTodos)
      }
    })

    const createSubscription = () => {
      subscription = supabase
      .from<Todo>(`todos:list_id=eq.${list_id}`)
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
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
          createSubscription();
      }
    };

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

      document.addEventListener('visibilitychange', handleVisibilityChange);

      createSubscription()
    })

    onCleanup(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (subscription) {
          supabase.removeSubscription(subscription);
      }
    });

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

    async function deleteTodo(todo: Todo) {
      const { error } = await supabase
        .from<Todo>('todos')
        .delete()
        .eq('id', todo.id)
      if (error) {
        console.error(error)
      }
    }

    async function todoActions(verb: TodoVerb, updatedTodos: Todo[]){
        switch (verb) {
            case 'COMPLETE':
                updatedTodos.forEach((todo) => completeTodo(todo.id!))
                break
            case 'CREATE':
                updatedTodos.forEach((todo) => createTodo(todo))
                break
            case 'DELETE':
                updatedTodos.forEach((todo) => deleteTodo(todo))
            default :
                console.error(`unimplemented switch case ${verb}`)
        }
    }

    return (
        <div class={styles.main}>
          <b class={contStyles.title}>Share your Todo List</b>
          <a>Share this link to share your list!</a>
          <CopyToClipboard text={`${window.location.origin}${location.pathname}`}/> 
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
          <For each={orderTodos(todos)}>
              {(todo) => <TodoCell todo={todo} action={todoActions}/>}
          </For>
        </div>
    )
};

export default ShareList