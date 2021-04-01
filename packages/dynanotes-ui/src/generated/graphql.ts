import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  user?: Maybe<User>;
  errors?: Maybe<Array<Scalars['String']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createNote: Note;
  updateNote?: Maybe<Note>;
  deleteNote: Scalars['Boolean'];
  register: RegisterResponse;
  login: LoginResponse;
  logout: Scalars['Boolean'];
};


export type MutationCreateNoteArgs = {
  text: Scalars['String'];
};


export type MutationUpdateNoteArgs = {
  text: Scalars['String'];
  id: Scalars['String'];
};


export type MutationDeleteNoteArgs = {
  id: Scalars['String'];
};


export type MutationRegisterArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Note = {
  __typename?: 'Note';
  id: Scalars['String'];
  owner: Scalars['String'];
  text: Scalars['String'];
  createdAt: Scalars['Float'];
  modifiedAt: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  notes: Array<Note>;
  note?: Maybe<Note>;
  me?: Maybe<User>;
};


export type QueryNoteArgs = {
  id: Scalars['String'];
};

export type RegisterResponse = {
  __typename?: 'RegisterResponse';
  user?: Maybe<User>;
  errors?: Maybe<Array<RegisterResponseError>>;
};

export type RegisterResponseError = {
  __typename?: 'RegisterResponseError';
  field: Scalars['String'];
  error: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  username: Scalars['String'];
  createdAt: Scalars['Float'];
  modifiedAt: Scalars['Float'];
};

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
);

export type CreateNoteMutationVariables = Exact<{
  text: Scalars['String'];
}>;


export type CreateNoteMutation = (
  { __typename?: 'Mutation' }
  & { createNote: (
    { __typename?: 'Note' }
    & Pick<Note, 'id'>
  ) }
);

export type DeleteNoteMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteNoteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteNote'>
);

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginResponse' }
    & Pick<LoginResponse, 'errors'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'RegisterResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )>, errors?: Maybe<Array<(
      { __typename?: 'RegisterResponseError' }
      & Pick<RegisterResponseError, 'field' | 'error'>
    )>> }
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type NoteQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type NoteQuery = (
  { __typename?: 'Query' }
  & { note?: Maybe<(
    { __typename?: 'Note' }
    & Pick<Note, 'id' | 'text' | 'modifiedAt'>
  )> }
);

export type NotesQueryVariables = Exact<{ [key: string]: never; }>;


export type NotesQuery = (
  { __typename?: 'Query' }
  & { notes: Array<(
    { __typename?: 'Note' }
    & Pick<Note, 'id' | 'text'>
  )> }
);

export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
}
    `;
export const CreateNoteDocument = gql`
    mutation CreateNote($text: String!) {
  createNote(text: $text) {
    id
  }
}
    `;

export function useCreateNoteMutation() {
  return Urql.useMutation<CreateNoteMutation, CreateNoteMutationVariables>(CreateNoteDocument);
};
export const DeleteNoteDocument = gql`
    mutation DeleteNote($id: String!) {
  deleteNote(id: $id)
}
    `;

export function useDeleteNoteMutation() {
  return Urql.useMutation<DeleteNoteMutation, DeleteNoteMutationVariables>(DeleteNoteDocument);
};
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    user {
      ...RegularUser
    }
    errors
  }
}
    ${RegularUserFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!) {
  register(username: $username, password: $password) {
    user {
      ...RegularUser
    }
    errors {
      field
      error
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const NoteDocument = gql`
    query Note($id: String!) {
  note(id: $id) {
    id
    text
    modifiedAt
  }
}
    `;

export function useNoteQuery(options: Omit<Urql.UseQueryArgs<NoteQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NoteQuery>({ query: NoteDocument, ...options });
};
export const NotesDocument = gql`
    query Notes {
  notes {
    id
    text
  }
}
    `;

export function useNotesQuery(options: Omit<Urql.UseQueryArgs<NotesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NotesQuery>({ query: NotesDocument, ...options });
};