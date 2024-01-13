const express = require('express')
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const bodyParser = require('body-parser');
const cors = require('cors');
const { default: axios } = require('axios');
const {USERS } = require('./user')
const {TODOS} = require('./todo')

const PORT = 8000;
async function startServer() {
     const app = express();
     const server = new ApolloServer({
          typeDefs: `
               type User{
                    id: ID!
                    name: String!
                    username: String!
                    email: String!
                    phone: String!
                    website: String!
               }

               type Todo{
                    id: ID!
                    title: String!
                    completed: Boolean
                    user: User
               }

               type Query {
                    getTodos: [Todo]
                    getUsers: [User]
                    getUser(id: ID!): User
               }
          `,
          resolvers: {
               Todo:{
                    user: async(todo)=> USERS.find((e)=> e.id === todo.id),
               },
               Query: {
                    getTodos: async () => TODOS,
                    getUsers: async () => USERS,
                    getUser: async (parent, {id}) => USERS.find((e)=> e.id === id),
               },
          },
     });

     app.use(bodyParser.json());
     app.use(
          bodyParser.urlencoded({
               extended: true,
          }),
     );
     app.use(cors());

     await server.start()

     app.use('/graphql', expressMiddleware(server));
     app.listen(PORT, () => console.log(`GraphQl server started at PORT http://localhost:${PORT}/graphql`));
}

startServer();