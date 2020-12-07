const { ApolloServer } = require('apollo-server');

const { conferencesSchema } = require('./schemas/conferences');
const resolvers = require('./resolvers');
const { ConferenceDataSource } = require('./inspire-data-source');

const typeDefs = conferencesSchema;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      conferences: new ConferenceDataSource(),
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
