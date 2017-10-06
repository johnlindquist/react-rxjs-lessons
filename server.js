const feathers = require("feathers")
const memory = require("feathers-memory")
const reactive = require("feathers-reactive")
const { Observable } = require("rxjs")
const socketio = require("feathers-socketio")
const faker = require("faker")

const app = feathers()
  .configure(socketio())
  .configure(reactive({ idField: "id" }))
  .use("/messages", memory())

const messages = app.service("messages")
messages.create(faker.helpers.createCard())

messages
  .watch()
  .get(0)
  .subscribe(card => console.log(card.name))

Observable.interval(250).subscribe(() => {
  const card = faker.helpers.createCard()
  messages.update(0, card)
})

app.listen(3030)
