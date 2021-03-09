import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { NoteResolver } from './resolvers/note';
import express from 'express';
import { UserResolver } from './resolvers/user';

export class ContextSession {
  userId: string;
  name: string;
}

export class ContextUser {
  name: string;
}

export type ContextRequest = express.Request & {
  session: ContextSession,
  user?: ContextUser,
};

export class Context {
  req: ContextRequest;
  res: express.Response;
}

export async function createApolloServer() {
  return new ApolloServer({
    schema: await buildSchema({
      resolvers: [NoteResolver,UserResolver],
      validate: false,
    }),
    context: ({ req, res }): Context => ({
      req: (<any>req),
      res,
    }),
  });
}