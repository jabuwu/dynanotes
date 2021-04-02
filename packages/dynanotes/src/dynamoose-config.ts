import dynamoose from 'dynamoose';
import { DYNAMODB_ACCESS_KEY, DYNAMODB_LOCAL, DYNAMODB_LOCAL_PORT, DYNAMODB_PREFIX, DYNAMODB_REGION, DYNAMODB_SECRET_KEY } from './env';

dynamoose.model.defaults.set({
  prefix: DYNAMODB_PREFIX,
  create: DYNAMODB_LOCAL,
  update: DYNAMODB_LOCAL,
  waitForActive: {
    enabled: DYNAMODB_LOCAL,
  },
});
dynamoose.aws.sdk.config.update({
  accessKeyId: DYNAMODB_ACCESS_KEY,
  secretAccessKey: DYNAMODB_SECRET_KEY,
  region: DYNAMODB_REGION,
});
if (DYNAMODB_LOCAL) {
  dynamoose.aws.ddb.local(`http://localhost:${DYNAMODB_LOCAL_PORT}`);
}