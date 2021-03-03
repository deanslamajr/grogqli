import { ApolloServer } from 'apollo-server-micro';

const {
  default: schema,
} = require(`../../graphql/${process.env.SCHEMA_PATH}/schema`);

const apolloServer = new ApolloServer({
  schema,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });
