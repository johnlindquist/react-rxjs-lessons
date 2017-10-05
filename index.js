import { render } from "react-dom"
import { Observable } from "rxjs"
import config from "recompose/rxjsObservableConfig"
import {
  setObservableConfig,
  componentFromStream,
  createEventHandler,
  mapPropsStream,
  withHandlers,
  withProps,
  compose
} from "recompose"

import { Drawer } from "react-toolbox/lib/drawer"
import { Button } from "react-toolbox/lib/button"
import { Snackbar } from "react-toolbox"

setObservableConfig(config)

const IncrementOnClick = comp => {
  const {
    handler: onClick,
    stream: onClick$
  } = createEventHandler()

  const count$ = onClick$
    .startWith(0)
    .scan(acc => acc + 1)

  return mapPropsStream(props$ => {
    return props$.combineLatest(
      count$,
      (props, count) => ({
        ...props,
        label: String(count),
        onClick
      })
    )
  })(comp)
}

const IncrementOnClickButton = IncrementOnClick(
  Button
)

const App = () => (
  <div>
    <IncrementOnClickButton raised />
  </div>
)

render(<App />, document.getElementById("app"))
