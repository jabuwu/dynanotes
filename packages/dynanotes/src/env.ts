require('dotenv').config();
import * as env from 'env-var';

export const production = env.get('NODE_ENV').asString() === 'production';

export const PORT = env.get('PORT').default('8080').asPortNumber();

export const SESSION_COOKIE = env.get('SESSION_COOKIE').default('qid').asString();
export const SESSION_SECRET = env.get('SESSION_SECRET').default('my super secret').asString();

export const CORS_ORIGIN = env.get('CORS_ORIGIN').default('http://localhost:3000').asString();

export const REGISTER_ENABLED = env.get('REGISTER_ENABLED').default('true').asBool();

export const DYNAMODB_LOCAL = env.get('DYNAMODB_LOCAL').default('true').asBool();
export const DYNAMODB_LOCAL_PORT = env.get('DYNAMODB_LOCAL_PORT').default('4567').asPortNumber();
export const DYNAMODB_PREFIX = env.get('DYNAMODB_PREFIX').default('').asString();
export const DYNAMODB_ACCESS_KEY = env.get('DYNAMODB_ACCESS_KEY').default('fakeMyKeyId').asString();
export const DYNAMODB_SECRET_KEY = env.get('DYNAMODB_SECRET_KEY').default('fakeSecretAccessKey').asString();
export const DYNAMODB_REGION = env.get('DYNAMODB_REGION').default('us-east-1').asString();