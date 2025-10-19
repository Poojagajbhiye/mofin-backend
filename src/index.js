// src/index.js
import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';

// For now we'll create a tiny placeholder schema and resolvers.
// We'll replace these with modular imports from modules/* when ready.
const typeDefs = `
  type Query {
    health: String
  }
`;

const resolvers = {
  Query: {
    health: () => 'Mofin backend up ✔',
  },
};

async function start() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const server = new ApolloServer({
    schema,
    // context will later include user from auth middleware
    context: ({ req }) => ({ req }),
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // simple health route
  app.get('/health', (req, res) => res.send({ status: 'ok', time: new Date().toISOString() }));

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`💓 Health at http://localhost:${PORT}/health`);
  });
}

start().catch((err) => {
  console.error('Server failed to start', err);
  process.exit(1);
});
