import { Arg, Ctx, Mutation, Query, Resolver, Subscription, Root, Publisher, PubSub } from 'type-graphql';
import { Note, NoteModel } from '../entities/Note';
import { v4 } from 'uuid';
import { Context } from '../apollo';
import { ForbiddenError } from 'apollo-server-errors';
import { applyDefaults } from '../applyDefaults';

class Payload<T> {
  message: T;
}

@Resolver()
export class NoteResolver {
  @Query(() => [Note])
  async notes(
    @Ctx() { req }: Context,
  ): Promise<Note[]> {
    if (!req.user) {
      throw new ForbiddenError('Forbidden.');
    }
    let notes = await NoteModel.scan().exec();
    for (const note of notes) {
      applyDefaults(note, NoteModel);
    }
    notes = notes.filter(note => note.deletedAt === 0) as any;
    notes.sort((a, b) => b.modifiedAt - a.modifiedAt);
    return notes;
  }

  @Query(() => Note, { nullable: true })
  async note(
    @Ctx() { req }: Context,
    @Arg('id') id: string,
  ): Promise<Note | null> {
    if (!req.user) {
      throw new ForbiddenError('Forbidden.');
    }
    const note = await NoteModel.get({ id });
    applyDefaults(note, NoteModel);
    if (note.deletedAt !== 0) {
      return null;
    }
    return note;
  }

  @Mutation(() => Note)
  async createNote(
    @Ctx() { req }: Context,
    @Arg('text') text: string,
    @PubSub('noteAdded') publish: Publisher<Payload<Note>>,
  ): Promise<Note> {
    if (!req.user) {
      throw new ForbiddenError('Forbidden.');
    }
    const now = Date.now();
    const note = new NoteModel({id: v4(), text, createdAt: now, modifiedAt: now});
    await note.save();
    await publish({ message: note });
    return note;
  }

  @Mutation(() => Note, { nullable: true })
  async updateNote(
    @Ctx() { req }: Context,
    @Arg('id') id: string,
    @Arg('text') text: string,
  ): Promise<Note | null> {
    if (!req.user) {
      throw new ForbiddenError('Forbidden.');
    }
    const note = await NoteModel.get({ id });
    if (!note) {
      return null;
    }
    applyDefaults(note, NoteModel);
    if (note.deletedAt !== 0) {
      return null;
    }
    note.text = text;
    note.modifiedAt = Date.now();
    await note.save();
    return note;
  }

  @Mutation(() => Boolean)
  async deleteNote(
    @Ctx() { req }: Context,
    @Arg('id') id: string,
  ): Promise<boolean> {
    if (!req.user) {
      throw new ForbiddenError('Forbidden.');
    }
    const note = await NoteModel.get({ id });
    if (!note) {
      return false;
    }
    applyDefaults(note, NoteModel);
    if (note.deletedAt === 0) {
      note.deletedAt = Date.now();
      await note.save();
      return true;
    } else {
      return false;
    }
  }

  @Subscription({ topics: ['noteAdded'] })
  noteAdded(
    @Root() payload: Payload<Note>
  ): Note {
    return payload.message;
  }
}