//#region imports and config
import { render } from "react-dom"
import { Observable } from "rxjs"
import config from "recompose/rxjsObservableConfig"
import {
  setObservableConfig,
  componentFromStream,
  createEventHandler,
  mapPropsStream,
  compose
} from "recompose"

setObservableConfig(config)
//#endregion

const count = mapPropsStream(props$ => {
  const {
    stream: onInc$,
    handler: onInc
  } = createEventHandler()
  const {
    stream: onDec$,
    handler: onDec
  } = createEventHandler()

  return props$.switchMap(
    props =>
      Observable.merge(
        onInc$.mapTo(1),
        onDec$.mapTo(-1)
      )
        .startWith(0)
        .scan((acc, curr) => acc + curr),
    (props, count) => ({
      ...props,
      count,
      onInc,
      onDec
    })
  )
})
const load = mapPropsStream(props$ =>
  props$.switchMap(
    props =>
      Observable.ajax(
        `https://swapi.co/api/people/${props.count}`
      )
        .pluck("response")
        .startWith({ name: "loading..." })
        .catch(err =>
          Observable.of({ name: "Not found" })
        ),
    (props, person) => ({ ...props, person })
  )
)

import * as R from "ramda"
const personName = R.lensPath(["person", "name"])

const typewriter = lens =>
  mapPropsStream(props$ =>
    props$.switchMap(
      props =>
        Observable.zip(
          Observable.from(R.view(lens, props)),
          Observable.interval(100),
          letter => letter
        ).scan((acc, curr) => acc + curr),
      R.flip(R.set(lens))
    )
  )

const Counter = props => (
  <div>
    <button onClick={props.onInc}>+</button>
    <button onClick={props.onDec}>-</button>
    <h3>{props.count}</h3>
    <h1>{props.person.name}</h1>
  </div>
)

const CounterWithPersonLoader = compose(
  count,
  load,
  typewriter(personName)
)(Counter)

const dateLens = R.lensProp("date")
const DateTypewriter = compose(
  typewriter(dateLens)
)(props => <div>{props.date}</div>)

const App = () => (
  <div>
    <CounterWithPersonLoader />
    <DateTypewriter
      date={new Date().toDateString()}
    />
  </div>
)

render(<App />, document.getElementById("app"))
