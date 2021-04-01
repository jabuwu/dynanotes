import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Note, NoteModel } from '../entities/Note';
import { v4 } from 'uuid';
import { Context } from '../apollo';
import { ForbiddenError } from 'apollo-server-errors';

@Resolver()
export class NoteResolver {
  @Query(() => [Note])
  async notes(
    @Ctx() { req }: Context,
  ): Promise<Note[]> {
    if (!req.user) {
      throw new ForbiddenError('Forbidden.');
    }
    const notes = await NoteModel.scan().exec();
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
    return note;
  }

  @Mutation(() => Note)
  async createNote(
    @Ctx() { req }: Context,
    @Arg('text') text: string,
  ): Promise<Note> {
    if (!req.user) {
      throw new ForbiddenError('Forbidden.');
    }
    const note = new NoteModel({id: v4(), text});
    await note.save();
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
    await note.delete();
    return true;
  }
}