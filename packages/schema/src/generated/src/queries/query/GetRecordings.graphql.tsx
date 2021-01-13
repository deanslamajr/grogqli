/* 08c0dedbc456f27323eb06977c32cb6f06d63424
 * This file is automatically generated by graphql-let. */

import { GraphQLResolveInfo } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateRecordingInput = {
  schema: SchemaInput;
  referrer: Scalars['String'];
  operationName: Scalars['String'];
  query: Scalars['String'];
  variables: Scalars['String'];
};

export type SchemaInput = {
  url: Scalars['String'];
  content: Maybe<Scalars['String']>;
};

export type CreateRecordingResponse = {
  __typename?: 'CreateRecordingResponse';
  newRecording: Recording;
};

export type CreateWorkflowInput = {
  operations: Array<OperationRecordingsInput>;
  schemasMapping: Array<SchemasMappingsInput>;
  workflow: NewWorkflowInput;
};

export type OperationRecordingsInput = {
  tempRecordingId: Scalars['String'];
};

export type SchemasMappingsInput = {
  id: Scalars['String'];
  url: Scalars['String'];
};

export type NewWorkflowInput = {
  name: Scalars['String'];
  description: Scalars['String'];
};

export enum CreateWorkflowResultCode {
  Success = 'SUCCESS',
  Failure = 'FAILURE'
}

export type CreateWorkflowResponse = {
  __typename?: 'CreateWorkflowResponse';
  resultCode: CreateWorkflowResultCode;
};

export type Mutation = {
  __typename?: 'Mutation';
  createRecording: CreateRecordingResponse;
  createWorkflow: CreateWorkflowResponse;
  playbackRecording: PlaybackRecordingResponse;
  recordResponse: RecordResponseResponse;
};


export type MutationCreateRecordingArgs = {
  input: CreateRecordingInput;
};


export type MutationCreateWorkflowArgs = {
  input: CreateWorkflowInput;
};


export type MutationPlaybackRecordingArgs = {
  input: PlaybackRecordingInput;
};


export type MutationRecordResponseArgs = {
  input: RecordResponseInput;
};

export type PlaybackRecordingInput = {
  query: Scalars['String'];
  schemaId: Scalars['String'];
  workflowId: Scalars['String'];
  variables: Maybe<Scalars['String']>;
};

export type PlaybackRecordingResponse = {
  __typename?: 'PlaybackRecordingResponse';
  data: Maybe<Scalars['String']>;
  errors: Maybe<Scalars['String']>;
};

export type RecordResponseInput = {
  recordingId: Scalars['ID'];
  response: Scalars['String'];
};

export type RecordResponseResponse = {
  __typename?: 'RecordResponseResponse';
  newRecording: Recording;
};

export type Query = {
  __typename?: 'Query';
  recordings: Maybe<Array<Recording>>;
  workflows: Maybe<Array<Workflow>>;
};

export type Workflow = {
  __typename?: 'Workflow';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Recording = {
  __typename?: 'Recording';
  id: Scalars['ID'];
  operationName: Scalars['String'];
  query: Scalars['String'];
  variables: Scalars['String'];
  response: Maybe<Scalars['String']>;
  schemaUrl: Scalars['String'];
  referrer: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  recordingSaved: Maybe<Recording>;
};

export type GetRecordingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRecordingsQuery = (
  { __typename?: 'Query' }
  & { recordings: Maybe<Array<(
    { __typename?: 'Recording' }
    & Pick<Recording, 'id' | 'operationName' | 'query' | 'variables' | 'response' | 'schemaUrl' | 'referrer'>
  )>> }
);


export const GetRecordingsDocument: DocumentNode<GetRecordingsQuery, GetRecordingsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRecordings"},"variableDefinitions":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordings"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"operationName"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"query"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"variables"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"response"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"schemaUrl"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"referrer"},"arguments":[],"directives":[]}]}}]}}]};
export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  CreateRecordingInput: ResolverTypeWrapper<Partial<CreateRecordingInput>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']>>;
  SchemaInput: ResolverTypeWrapper<Partial<SchemaInput>>;
  CreateRecordingResponse: ResolverTypeWrapper<Partial<CreateRecordingResponse>>;
  CreateWorkflowInput: ResolverTypeWrapper<Partial<CreateWorkflowInput>>;
  OperationRecordingsInput: ResolverTypeWrapper<Partial<OperationRecordingsInput>>;
  SchemasMappingsInput: ResolverTypeWrapper<Partial<SchemasMappingsInput>>;
  NewWorkflowInput: ResolverTypeWrapper<Partial<NewWorkflowInput>>;
  CreateWorkflowResultCode: ResolverTypeWrapper<Partial<CreateWorkflowResultCode>>;
  CreateWorkflowResponse: ResolverTypeWrapper<Partial<CreateWorkflowResponse>>;
  Mutation: ResolverTypeWrapper<{}>;
  PlaybackRecordingInput: ResolverTypeWrapper<Partial<PlaybackRecordingInput>>;
  PlaybackRecordingResponse: ResolverTypeWrapper<Partial<PlaybackRecordingResponse>>;
  RecordResponseInput: ResolverTypeWrapper<Partial<RecordResponseInput>>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']>>;
  RecordResponseResponse: ResolverTypeWrapper<Partial<RecordResponseResponse>>;
  Query: ResolverTypeWrapper<{}>;
  Workflow: ResolverTypeWrapper<Partial<Workflow>>;
  Recording: ResolverTypeWrapper<Partial<Recording>>;
  Subscription: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  CreateRecordingInput: Partial<CreateRecordingInput>;
  String: Partial<Scalars['String']>;
  SchemaInput: Partial<SchemaInput>;
  CreateRecordingResponse: Partial<CreateRecordingResponse>;
  CreateWorkflowInput: Partial<CreateWorkflowInput>;
  OperationRecordingsInput: Partial<OperationRecordingsInput>;
  SchemasMappingsInput: Partial<SchemasMappingsInput>;
  NewWorkflowInput: Partial<NewWorkflowInput>;
  CreateWorkflowResponse: Partial<CreateWorkflowResponse>;
  Mutation: {};
  PlaybackRecordingInput: Partial<PlaybackRecordingInput>;
  PlaybackRecordingResponse: Partial<PlaybackRecordingResponse>;
  RecordResponseInput: Partial<RecordResponseInput>;
  ID: Partial<Scalars['ID']>;
  RecordResponseResponse: Partial<RecordResponseResponse>;
  Query: {};
  Workflow: Partial<Workflow>;
  Recording: Partial<Recording>;
  Subscription: {};
  Boolean: Partial<Scalars['Boolean']>;
}>;

export type CreateRecordingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateRecordingResponse'] = ResolversParentTypes['CreateRecordingResponse']> = ResolversObject<{
  newRecording: Resolver<ResolversTypes['Recording'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateWorkflowResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateWorkflowResponse'] = ResolversParentTypes['CreateWorkflowResponse']> = ResolversObject<{
  resultCode: Resolver<ResolversTypes['CreateWorkflowResultCode'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createRecording: Resolver<ResolversTypes['CreateRecordingResponse'], ParentType, ContextType, RequireFields<MutationCreateRecordingArgs, 'input'>>;
  createWorkflow: Resolver<ResolversTypes['CreateWorkflowResponse'], ParentType, ContextType, RequireFields<MutationCreateWorkflowArgs, 'input'>>;
  playbackRecording: Resolver<ResolversTypes['PlaybackRecordingResponse'], ParentType, ContextType, RequireFields<MutationPlaybackRecordingArgs, 'input'>>;
  recordResponse: Resolver<ResolversTypes['RecordResponseResponse'], ParentType, ContextType, RequireFields<MutationRecordResponseArgs, 'input'>>;
}>;

export type PlaybackRecordingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlaybackRecordingResponse'] = ResolversParentTypes['PlaybackRecordingResponse']> = ResolversObject<{
  data: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  errors: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RecordResponseResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecordResponseResponse'] = ResolversParentTypes['RecordResponseResponse']> = ResolversObject<{
  newRecording: Resolver<ResolversTypes['Recording'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  recordings: Resolver<Maybe<Array<ResolversTypes['Recording']>>, ParentType, ContextType>;
  workflows: Resolver<Maybe<Array<ResolversTypes['Workflow']>>, ParentType, ContextType>;
}>;

export type WorkflowResolvers<ContextType = any, ParentType extends ResolversParentTypes['Workflow'] = ResolversParentTypes['Workflow']> = ResolversObject<{
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RecordingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Recording'] = ResolversParentTypes['Recording']> = ResolversObject<{
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  operationName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  query: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  variables: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  response: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  schemaUrl: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  referrer: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  recordingSaved: SubscriptionResolver<Maybe<ResolversTypes['Recording']>, "recordingSaved", ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  CreateRecordingResponse: CreateRecordingResponseResolvers<ContextType>;
  CreateWorkflowResponse: CreateWorkflowResponseResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  PlaybackRecordingResponse: PlaybackRecordingResponseResolvers<ContextType>;
  RecordResponseResponse: RecordResponseResponseResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Workflow: WorkflowResolvers<ContextType>;
  Recording: RecordingResolvers<ContextType>;
  Subscription: SubscriptionResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
