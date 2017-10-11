import { render } from "react-dom"
import { Observable, BehaviorSubject } from "rxjs"
import crap from "recompose/rxjsObservableConfig"
import {
  setObservableConfig,
  componentFromStream,
  mapPropsStream,
  createEventHandler,
  withProps,
  compose
} from "recompose"

import { createStore } from "staunch-store"

setObservableConfig(crap)

const Foo = mapPropsStream(props$ =>
  props$.switchMap(props =>
    props.count$.map(count => ({
      ...props,
      count
    }))
  )
)
const Bar = ({ onClick, count, i }) => (
  <div onClick={onClick} key={i}>
    Hello there, {count}
  </div>
)

const state = {
  count: 0
}

const reducers = (state, action) => {
  switch (action.type) {
    case "INC":
      return state.update("count", count => count + 1)
    default:
      return state
  }
}

const config = { state, reducers }

const store = createStore(config)

store
  .changes()
  .subscribe(state => console.log(state.toJS()))

const Comp = compose(
  withProps({
    onClick: () => store.dispatch({ type: "INC" })
  }),
  Foo
)(Bar)

render(
  <div>
    <Comp count$={store.changes("count")} />
  </div>,
  document.getElementById("app")
)
