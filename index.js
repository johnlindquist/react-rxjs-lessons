import { render } from "react-dom"
import { Observable, BehaviorSubject } from "rxjs"
import rxjsConfig from "recompose/rxjsObservableConfig"
import {
  setObservableConfig,
  componentFromStream,
  mapPropsStream,
  createEventHandler
} from "recompose"

import { createStore } from "staunch-store"
import { fromJS } from "immutable"

//#region utils
const createMapStateStream = store => (
  selector,
  dispatchToProps
) => fn => {
  const mappedDispatch = Object.keys(
    dispatchToProps
  ).reduce(
    (o, k) => ({
      [k]: (...args) => () =>
        store.dispatch(dispatchToProps[k](...args)),
      ...o
    }),
    {}
  )
  return mapPropsStream(props$ =>
    fn(
      props$.map(props => ({
        ...props,
        ...mappedDispatch
      })),
      store.changes(selector)
    )
  )
}
//#endregion

setObservableConfig(rxjsConfig)
const state = {
  todos: [
    {
      id: 0,
      completed: true,
      text: "eat"
    },
    {
      id: 1,
      completed: false,
      text: "sleep"
    },
    {
      id: 2,
      completed: false,
      text: "code"
    }
  ]
}

const getIndexById = (list, id) =>
  list.findIndex(item => item.get("id") === id)

const reducers = [
  {
    path: ["todos"],
    reducers: {
      ["ADD_TODO"]: (todos, { text }) =>
        todos.push(
          fromJS({
            text,
            completed: false,
            id: Math.random()
          })
        ),
      ["REMOVE_TODO"]: (todos, { id }) => {
        const index = getIndexById(todos, id)
        return todos.delete(index)
      },
      ["TOGGLE_COMPLETE"]: (todos, { id, completed }) => {
        const index = getIndexById(todos, id)
        return todos.setIn([index, "completed"], !completed)
      }
    }
  }
]

const config = {
  state,
  reducers
}
const store = createStore(config)
const mapStateStream = createMapStateStream(store)

const toggleComplete = todo => ({
  type: "TOGGLE_COMPLETE",
  payload: todo
})

const addTodo = text => ({
  type: "ADD_TODO",
  payload: { text }
})

const removeTodo = todo => ({
  type: "REMOVE_TODO",
  payload: todo
})

const connectTodosStream = mapStateStream("todos", {
  toggleComplete,
  removeTodo
})

const mapTodosStream = (props$, todos$) => {
  return props$.combineLatest(todos$, (props, todos) => ({
    ...props,
    todos: todos.toJS()
  }))
}

const TodoList = ({
  todos,
  toggleComplete,
  removeTodo
}) => (
  <div>
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <span onClick={toggleComplete(todo)}>
            {todo.text} -
            {todo.completed ? "✔" : `🤔`}
          </span>
          <button onClick={removeTodo(todo)}>𝗫</button>
        </li>
      ))}
    </ul>
  </div>
)

const TodosListWithStream = connectTodosStream(
  mapTodosStream
)(TodoList)

const connectAdderStream = mapStateStream("todos", {
  addTodo
})

const mapAdderStream = (props$, todos$) => {
  const {
    handler: updateText,
    stream: updateText$
  } = createEventHandler()

  const text$ = updateText$
    .map(event => event.target.value)
    .startWith("")
  const adder$ = props$.combineLatest(
    text$,
    (props, text) => ({ ...props, text, updateText })
  )

  return adder$
}
const TodoAdder = ({ addTodo, text, updateText }) => (
  <div>
    <input type="text" onInput={updateText} />
    <button onClick={addTodo(text)}>Add</button>
  </div>
)

const TodoAdderWithStream = connectAdderStream(
  mapAdderStream
)(TodoAdder)

render(
  <div>
    <TodoAdderWithStream />
    <TodosListWithStream />
  </div>,
  document.getElementById("app")
)
