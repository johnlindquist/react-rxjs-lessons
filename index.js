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
      <h2>{text}</h2>
    </div>
  ))
})

const App = () => (
  <div>
    <SimpleForm />
  </div>
)

render(<App />, document.getElementById("app"))
