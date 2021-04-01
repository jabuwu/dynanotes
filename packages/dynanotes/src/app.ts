import express from 'express';
import cors from 'cors';
import { CORS_ORIGIN, DYNAMODB_ACCESS_KEY, DYNAMODB_LOCAL, DYNAMODB_LOCAL_PORT, DYNAMODB_PREFIX, DYNAMODB_REGION, DYNAMODB_SECRET_KEY, production, SESSION_COOKIE, SESSION_SECRET } from './env';
import { ContextRequest, createApolloServer } from './apollo';
import session from 'express-session';
import AWS from 'aws-sdk';
import { ui } from './ui';
const DynamoDBStore = require('connect-dynamodb')(session);

export async function createApp() {
  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: CORS_ORIGIN,
    }),
  );

  const store = new DynamoDBStore({
    table: `${DYNAMODB_PREFIX}sessions`,
    AWSConfigJSON: {
      accessKeyId: DYNAMODB_ACCESS_KEY,
      secretAccessKey: DYNAMODB_SECRET_KEY,
      region: DYNAMODB_REGION,
    },
    client: DYNAMODB_LOCAL ? new AWS.DynamoDB({
      endpoint: new AWS.Endpoint(`http://localhost:${DYNAMODB_LOCAL_PORT}`)
    }) : new AWS.DynamoDB({
      region: DYNAMODB_REGION,
      credentials: {
        accessKeyId: DYNAMODB_ACCESS_KEY,
        secretAccessKey: DYNAMODB_SECRET_KEY,
      },
    }),
  });
  app.use(
    session({
      name: SESSION_COOKIE,
      store,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: production,
        sameSite: 'lax',
      },
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use((req, _res, next) => {
    const request: ContextRequest = req as any;
    if (request.session?.userId) {
      request.user = {
        name: request.session.name,
      };
    }
    next();
  });

  const apolloServer = await createApolloServer();
  apolloServer.applyMiddleware({ app, cors: false });

  app.use(ui);

  return app;
}