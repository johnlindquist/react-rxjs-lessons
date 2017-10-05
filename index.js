import { render } from "react-dom"
import { Observable } from "rxjs"
import config from "recompose/rxjsObservableConfig"
import {
  setObservableConfig,
  componentFromStream,
  createEventHandler,
  mapPropsStream
} from "recompose"

setObservableConfig(config)

const CountStream = Comp => {
  return mapPropsStream(props$ => {
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
      .startWith(3)
      .scan((acc, curr) => acc + curr)
      .map(count => ({ count, inc, dec }))
  })(Comp)
}

const Counter = props => (
  <div>
    <button onClick={props.inc}>+</button>
    <h2>{props.count}</h2>
    <button onClick={props.dec}>-</button>
  </div>
)

const CounterWithCountStream = CountStream(
  Counter
)

const App = () => (
  <div>
    <CounterWithCountStream />
  </div>
)

render(<App />, document.getElementById("app"))
