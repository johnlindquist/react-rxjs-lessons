import { render } from "react-dom"
import { Observable } from "rxjs"
import config from "recompose/rxjsObservableConfig"
import {
  setObservableConfig,
  componentFromStream,
  createEventHandler
} from "recompose"

setObservableConfig(config)

const Counter = componentFromStream(props$ => {
  const {
    handler: inc,
    stream: inc$
  } = createEventHandler()
  const {
    handler: dec,
    stream: dec$
  } = createEventHandler()

  return Observable.merge(
    inc$.mapTo(1),
    dec$.mapTo(-1)
  )
    .scan((acc, curr) => acc + curr)
    .startWith(0)
    .map(value => (
      <div>
        <button onClick={inc}>+</button>
        <h2>{value}</h2>
        <button onClick={dec}>-</button>
      </div>
    ))
})

const App = () => (
  <div>
    <Counter />
  </div>
)

render(<App />, document.getElementById("app"))
