const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');

const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
require('dotenv').config({ path: 'variables.env'});

const connectDB = require('./config/db');

connectDB();


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  context:({req}) =>{

    const token = req.headers['authorization'] || '';

    if(token){
      try {
        const user = jwt.verify(token, process.env.SECRET);

        return {
          user
        }
      } catch (error) {
        console.log('Error >>>', error);
      } 
    }
  }
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
