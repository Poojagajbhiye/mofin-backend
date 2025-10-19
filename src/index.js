// src/index.js
import { connectDB } from './config/db.js';
import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { userTypeDefs } from './modules/users/user.typeDefs.js';
import { userResolvers } from './modules/users/user.resolver.js';
import { authMiddleware } from './common/auth/auth.middleware.js';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { expenseTypeDefs } from './modules/expenses/expense.typeDefs.js';
import { expenseResolvers } from './modules/expenses/expense.resolver.js';
import { requestTypeDefs } from './modules/requests/request.typeDefs.js';
import { requestResolvers } from './modules/requests/request.resolver.js';

// Merge typeDefs/resolvers (future-proof)
const typeDefs = mergeTypeDefs([userTypeDefs, expenseTypeDefs, requestTypeDefs]);
const resolvers = mergeResolvers([userResolvers, expenseResolvers, requestResolvers]);

async function start() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const server = new ApolloServer({
  schema: makeExecutableSchema({ typeDefs, resolvers }),
    context: async ({ req }) => {
      const { user } = await authMiddleware({ req });
      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // simple health route
  app.get('/health', (req, res) => res.send({ status: 'ok', time: new Date().toISOString() }));

  const PORT = process.env.PORT || 4000;
  // Connect DB
  await connectDB(process.env.MONGO_URI);
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`💓 Health at http://localhost:${PORT}/health`);
  });
}

start().catch((err) => {
  console.error('Server failed to start', err);
  process.exit(1);
});
