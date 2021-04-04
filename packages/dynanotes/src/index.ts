import 'reflect-metadata';
import './dynamoose-config';
import { DYNAMODB_LOCAL, DYNAMODB_LOCAL_PORT, PORT } from './env';
import { createApp } from './app';
import { createServer } from 'http';

(async() => {
  if (DYNAMODB_LOCAL) {
    const dynalite = require('dynalite')
    const dynaliteServer = dynalite({ path: './mydb', createTableMs: 50 })
    await new Promise<void>((resolve, reject) => dynaliteServer.listen(DYNAMODB_LOCAL_PORT, async function(err: any) {
      if (!err) {
        resolve();
        console.log(`Dynalite started on port ${DYNAMODB_LOCAL_PORT}`)
      } else {
        reject(err);
      }
    }));
  }


  const { app, apolloServer } = await createApp();
  const server = createServer(app);
  apolloServer.installSubscriptionHandlers(server);
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
})();