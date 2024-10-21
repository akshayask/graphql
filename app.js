const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql')
const { buildSchema, } = require('graphql')


const app = express();
const events = []

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
    type Event {
      _id: ID!,
      title: String!,
      description: String!,
      price: Float!,
      date: String!,
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
    `),
  rootValue: {
    events: () => {
      return events
    },
    createEvent: (args) => {
      const { eventInput } = args;
      const event = {
        _id: Math.random().toString(),
        title: eventInput.title,
        description: eventInput.description,
        price: eventInput.price,
        date: new Date().toISOString(),
      };
      events.push(event);
      return event;
    } 
  }, //Resolver
  graphiql: true
}))

app.listen(3000);