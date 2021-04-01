import { Field, Float, ObjectType } from 'type-graphql';
import * as dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';

@ObjectType()
export class User extends Document {
  @Field()
  id!: string;

  @Field(() => String)
  username!: string;

  password!: string;

  @Field(() => Float)
  createdAt: number;

  @Field(() => Float)
  modifiedAt: number;
}

const UserSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
  },
  username: {
    type: String,
    index:{
      global: true,
      name: 'username',
    },
  },
  password: {
    type: String,
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
  modifiedAt: {
    type: Number,
    default: Date.now,
  },
});
export const UserModel = dynamoose.model<User>('users', UserSchema);