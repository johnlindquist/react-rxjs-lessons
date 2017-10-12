import { render } from "react-dom"
import { Observable } from "rxjs"
import rxjsConfig from "recompose/rxjsObservableConfig"
import {
  setObservableConfig,
  componentFromStream
} from "recompose"

setObservableConfig(rxjsConfig)

const App = componentFromStream(props$ =>
  props$.switchMap(({ id }) =>
    Observable.ajax(
      `https://jsonplaceholder.typicode.com/users/${id}`
    )
      .pluck("response")
      .map(({ name, email }) => (
        <div>
          {name} - {email}
        </div>
      ))
  )
)

render(<App id={2} />, document.getElementById("app"))
