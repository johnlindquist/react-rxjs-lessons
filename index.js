import "./styles.css"
import { render } from "react-dom"
import { Observable } from "rxjs"
import config from "recompose/rxjsObservableConfig"
import {
  setObservableConfig,
  componentFromStream,
  createEventHandler,
  mapPropsStream
} from "recompose"

import { Drawer } from "react-toolbox/lib/drawer"

setObservableConfig(config)

const Toggling = comp => {
  const toggler$ = Observable.interval(1000)
    .startWith(true)
    .scan(bool => !bool)

  return mapPropsStream(props$ => {
    return props$.combineLatest(
      toggler$,
      (props, active) => ({
        ...props,
        active
      })
    )
  })(comp)
}

const TogglingDrawer = Toggling(Drawer)

const App = () => (
  <div>
    <TogglingDrawer type="right">
      <h1>Hello world!</h1>
    </TogglingDrawer>
  </div>
)

render(<App />, document.getElementById("app"))
