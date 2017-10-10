import { render } from "react-dom"
import { Observable, BehaviorSubject } from "rxjs"
import config from "recompose/rxjsObservableConfig"
import {
  setObservableConfig,
  componentFromStream,
  mapPropsStream,
  createEventHandler
} from "recompose"

setObservableConfig(config)

const Foo = store$ => {
  const {
    handler: onClick,
    stream: onClick$
  } = createEventHandler()

  onClick$.subscribe(store$)

  return mapPropsStream(props$ => {
    return props$.combineLatest(
      store$,
      (props, count) => {
        return {
          count,
          onClick,
          ...props
        }
      }
    )
  })
}

const Bar = ({ onClick, count, i }) => (
  <div onClick={onClick} key={i}>
    Hello there, {count}
  </div>
)

const store$ = new BehaviorSubject(4).scan(
  acc => acc + 1
)

const Comp = Foo(store$)(Bar)

render(
  <div>
    <Comp />
    <Comp />
    <Comp />
    <Comp />
    <Comp />
    <Comp />
  </div>,
  document.getElementById("app")
)
