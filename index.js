import { render } from "react-dom"
import { Observable } from "rxjs"
import config from "recompose/rxjsObservableConfig"
import {
  setObservableConfig,
  componentFromStream
} from "recompose"

import feathers from "feathers/client"
import socketio from "feathers-socketio/client"
import feathersRx from "feathers-reactive"
import io from "socket.io-client"

setObservableConfig(config)

const socket = io("http://localhost:3030")
const app = feathers()
  .configure(socketio(socket))
  .configure(feathersRx({ idField: "id" }))
const messages = app.service("messages")

const latestMessage$ = messages.watch().get(0)

latestMessage$.subscribe(
  console.log.bind(console)
)

const App = componentFromStream(props$ => {
  return latestMessage$.map(person => (
    <div>
      <h2>{person.name}</h2>
      <p>{person.email}</p>
    </div>
  ))
})

render(<App />, document.getElementById("app"))
