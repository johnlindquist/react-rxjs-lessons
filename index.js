import { render } from "react-dom"
import { Observable } from "rxjs"
import config from "recompose/rxjsObservableConfig"
import {
  setObservableConfig,
  componentFromStream,
  createEventHandler
} from "recompose"

setObservableConfig(config)

const SimpleForm = componentFromStream(props$ => {
  const {
    handler: input,
    stream: input$
  } = createEventHandler()
  const text$ = input$
    .map(e => e.target.value)
    .startWith("")
  return text$.map(text => (
    <div>
      <input type="text" onInput={input} />
      {text}
    </div>
  ))
})

const App = () => (
  <div>
    <h1>Above</h1>
    <SimpleForm />
    <h2>Below</h2>
  </div>
)

render(<App />, document.getElementById("app"))
