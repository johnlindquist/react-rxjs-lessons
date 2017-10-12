import { render } from "react-dom"
import { Observable } from "rxjs"
import rxjsConfig from "recompose/rxjsObservableConfig"
import {
  setObservableConfig,
  componentFromStream
} from "recompose"

setObservableConfig(rxjsConfig)

const App = componentFromStream(props$ =>
  Observable.ajax(
    "https://jsonplaceholder.typicode.com/users/1"
  )
    .map(({ response }) => response)
    .map(({ name, email }) => (
      <div>
        {name} - {email}
      </div>
    ))
)

render(<App />, document.getElementById("app"))
