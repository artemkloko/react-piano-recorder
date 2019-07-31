const { ApolloServer, gql } = require("apollo-server");
const { MongoMemoryServer } = require("mongodb-memory-server");
const getMongoConnection = require("./getMongoConnection");
const { fileLoader, mergeTypes } = require("merge-graphql-schemas");
const path = require("path");

// don't require a seperate mongodb instance to run
new MongoMemoryServer({ instance: { port: 27017 } });

const typesArray = fileLoader(path.join(__dirname, "schema.graphql"));
const typeDefs = mergeTypes(typesArray, { all: true });

const resolvers = {
  Query: {
    recordings: async () => {
      const mongodb = await getMongoConnection();
      return mongodb
        .collection("recordings")
        .find({})
        .toArray();
    }
  },
  Mutation: {
    addRecording: async (_, { recording }) => {
      const mongodb = await getMongoConnection();
      try {
        const response = await mongodb
          .collection("recordings")
          .insertOne(recording);
        return mongodb
          .collection("recordings")
          .findOne({ _id: response.insertedId });
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`GraphQL server running: ${url}`);
});
