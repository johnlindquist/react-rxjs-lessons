import { Observable } from "rxjs"
import config from "recompose/rxjsObservableConfig"
import {
  setObservableConfig,
  createEventHandler,
  mapPropsStream
} from "recompose"

import * as R from "ramda"
import * as L from "partial.lenses"

setObservableConfig(config)

const {
  handler: setState,
  stream: setState$
} = createEventHandler()

export default initialState => {
  const propsAndState$ = props$ =>
    setState$
      .startWith(R.merge)
      .combineLatest(props$)
      .scan(
        (state, [fn, props]) => fn(state, props),
        initialState
      )

  return {
    setState,
    stateStream: mapPropsStream(propsAndState$)
  }
}
