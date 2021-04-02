import { Field, Float, ObjectType } from 'type-graphql';
import * as dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';

@ObjectType()
export class Note extends Document {
  @Field()
  id!: string;

  @Field()
  owner: string;

  @Field(() => String)
  text: string;

  @Field(() => Float)
  createdAt: number;

  @Field(() => Float)
  modifiedAt: number;

  @Field(() => Float)
  deletedAt: number;
}

const NoteSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
  },
  text: {
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
  deletedAt: {
    type: Number,
    default: 0,
  },
});
export const NoteModel = dynamoose.model<Note>('notes', NoteSchema);