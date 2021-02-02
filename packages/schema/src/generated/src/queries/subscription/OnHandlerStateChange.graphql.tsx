/* b12f4800ca42fe5bc80dad1465e3980e84cd8fee
 * This file is automatically generated by graphql-let. */

import { GraphQLResolveInfo } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateHandlerSessionInput = {
  name: Scalars['String'];
};

export type CreateHandlerSessionResponse = {
  __typename?: 'CreateHandlerSessionResponse';
  newHandler: Handler;
};

export type CreateTemporaryOperationRecordingInput = {
  sessionId: Scalars['String'];
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

export type CreateTemporaryOperationRecordingResponse = {
  __typename?: 'CreateTemporaryOperationRecordingResponse';
  newRecording: TemporaryOperationRecording;
};

export type CreateWorkflowInput = {
  operations: Array<OperationRecordingsInput>;
  schemasMapping: Array<SchemasMappingsInput>;
  workflow: NewWorkflowInput;
};

export type OperationRecordingsInput = {
  tempRecordingId: Scalars['ID'];
  sessionId: Scalars['ID'];
};

export type SchemasMappingsInput = {
  id: Scalars['ID'];
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
  createHandlerSession: CreateHandlerSessionResponse;
  createTemporaryOperationRecording: CreateTemporaryOperationRecordingResponse;
  updateTemporaryOperationRecording: UpdateTemporaryOperationRecordingResponse;
  createWorkflow: CreateWorkflowResponse;
  playbackRecording: PlaybackRecordingResponse;
};


export type MutationCreateHandlerSessionArgs = {
  input: CreateHandlerSessionInput;
};


export type MutationCreateTemporaryOperationRecordingArgs = {
  input: CreateTemporaryOperationRecordingInput;
};


export type MutationUpdateTemporaryOperationRecordingArgs = {
  input: UpdateTemporaryOperationRecordingInput;
};


export type MutationCreateWorkflowArgs = {
  input: CreateWorkflowInput;
};


export type MutationPlaybackRecordingArgs = {
  input: PlaybackRecordingInput;
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

export type UpdateTemporaryOperationRecordingInput = {
  sessionId: Scalars['ID'];
  tempOpRecordingId: Scalars['ID'];
  response: Scalars['String'];
};

export type UpdateTemporaryOperationRecordingResponse = {
  __typename?: 'UpdateTemporaryOperationRecordingResponse';
  updatedRecording: TemporaryOperationRecording;
};

export type HandlersInput = {
  sessionIds: Array<Scalars['ID']>;
};

export type Query = {
  __typename?: 'Query';
  handlers: Maybe<Array<Handler>>;
  temporaryOperationRecordings: Maybe<Array<TemporaryOperationRecording>>;
  workflows: Maybe<Array<Workflow>>;
};


export type QueryHandlersArgs = {
  input: HandlersInput;
};


export type QueryTemporaryOperationRecordingsArgs = {
  input: TemporaryOperationRecordingsInput;
};

export type TemporaryOperationRecordingsInput = {
  sessionId: Scalars['String'];
};

export type Workflow = {
  __typename?: 'Workflow';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Handler = {
  __typename?: 'Handler';
  id: Scalars['ID'];
  name: Scalars['String'];
  currentState: HandlerState;
};

export enum HandlerState {
  Recording = 'RECORDING',
  Playback = 'PLAYBACK',
  Passthrough = 'PASSTHROUGH'
}

export type TemporaryOperationRecording = {
  __typename?: 'TemporaryOperationRecording';
  id: Scalars['ID'];
  operationName: Scalars['String'];
  query: Scalars['String'];
  variables: Scalars['String'];
  response: Maybe<Scalars['String']>;
  tempSchemaRecordingId: Scalars['String'];
  referrer: Scalars['String'];
};

export type HandlerSessionCreateSubscriptionInput = {
  name: Scalars['String'];
};

export type HandlerStateChangeSubscriptionInput = {
  id: Scalars['ID'];
};

export type Subscription = {
  __typename?: 'Subscription';
  temporaryOperationRecordingSaved: Maybe<TemporaryOperationRecording>;
  handlerStateChanged: Maybe<Handler>;
  handlerSessionCreated: Maybe<Handler>;
};


export type SubscriptionHandlerStateChangedArgs = {
  input: HandlerStateChangeSubscriptionInput;
};


export type SubscriptionHandlerSessionCreatedArgs = {
  input: HandlerSessionCreateSubscriptionInput;
};

export type OnHandlerStateChangeSubscriptionVariables = Exact<{
  input: HandlerStateChangeSubscriptionInput;
}>;


export type OnHandlerStateChangeSubscription = (
  { __typename?: 'Subscription' }
  & { handlerStateChanged: Maybe<(
    { __typename?: 'Handler' }
    & Pick<Handler, 'id' | 'name' | 'currentState'>
  )> }
);


export const OnHandlerStateChangeDocument: DocumentNode<OnHandlerStateChangeSubscription, OnHandlerStateChangeSubscriptionVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnHandlerStateChange"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HandlerStateChangeSubscriptionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"handlerStateChanged"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currentState"}}]}}]}}]};
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
  CreateHandlerSessionInput: ResolverTypeWrapper<Partial<CreateHandlerSessionInput>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']>>;
  CreateHandlerSessionResponse: ResolverTypeWrapper<Partial<CreateHandlerSessionResponse>>;
  CreateTemporaryOperationRecordingInput: ResolverTypeWrapper<Partial<CreateTemporaryOperationRecordingInput>>;
  SchemaInput: ResolverTypeWrapper<Partial<SchemaInput>>;
  CreateTemporaryOperationRecordingResponse: ResolverTypeWrapper<Partial<CreateTemporaryOperationRecordingResponse>>;
  CreateWorkflowInput: ResolverTypeWrapper<Partial<CreateWorkflowInput>>;
  OperationRecordingsInput: ResolverTypeWrapper<Partial<OperationRecordingsInput>>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']>>;
  SchemasMappingsInput: ResolverTypeWrapper<Partial<SchemasMappingsInput>>;
  NewWorkflowInput: ResolverTypeWrapper<Partial<NewWorkflowInput>>;
  CreateWorkflowResultCode: ResolverTypeWrapper<Partial<CreateWorkflowResultCode>>;
  CreateWorkflowResponse: ResolverTypeWrapper<Partial<CreateWorkflowResponse>>;
  Mutation: ResolverTypeWrapper<{}>;
  PlaybackRecordingInput: ResolverTypeWrapper<Partial<PlaybackRecordingInput>>;
  PlaybackRecordingResponse: ResolverTypeWrapper<Partial<PlaybackRecordingResponse>>;
  UpdateTemporaryOperationRecordingInput: ResolverTypeWrapper<Partial<UpdateTemporaryOperationRecordingInput>>;
  UpdateTemporaryOperationRecordingResponse: ResolverTypeWrapper<Partial<UpdateTemporaryOperationRecordingResponse>>;
  HandlersInput: ResolverTypeWrapper<Partial<HandlersInput>>;
  Query: ResolverTypeWrapper<{}>;
  TemporaryOperationRecordingsInput: ResolverTypeWrapper<Partial<TemporaryOperationRecordingsInput>>;
  Workflow: ResolverTypeWrapper<Partial<Workflow>>;
  Handler: ResolverTypeWrapper<Partial<Handler>>;
  HandlerState: ResolverTypeWrapper<Partial<HandlerState>>;
  TemporaryOperationRecording: ResolverTypeWrapper<Partial<TemporaryOperationRecording>>;
  HandlerSessionCreateSubscriptionInput: ResolverTypeWrapper<Partial<HandlerSessionCreateSubscriptionInput>>;
  HandlerStateChangeSubscriptionInput: ResolverTypeWrapper<Partial<HandlerStateChangeSubscriptionInput>>;
  Subscription: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  CreateHandlerSessionInput: Partial<CreateHandlerSessionInput>;
  String: Partial<Scalars['String']>;
  CreateHandlerSessionResponse: Partial<CreateHandlerSessionResponse>;
  CreateTemporaryOperationRecordingInput: Partial<CreateTemporaryOperationRecordingInput>;
  SchemaInput: Partial<SchemaInput>;
  CreateTemporaryOperationRecordingResponse: Partial<CreateTemporaryOperationRecordingResponse>;
  CreateWorkflowInput: Partial<CreateWorkflowInput>;
  OperationRecordingsInput: Partial<OperationRecordingsInput>;
  ID: Partial<Scalars['ID']>;
  SchemasMappingsInput: Partial<SchemasMappingsInput>;
  NewWorkflowInput: Partial<NewWorkflowInput>;
  CreateWorkflowResponse: Partial<CreateWorkflowResponse>;
  Mutation: {};
  PlaybackRecordingInput: Partial<PlaybackRecordingInput>;
  PlaybackRecordingResponse: Partial<PlaybackRecordingResponse>;
  UpdateTemporaryOperationRecordingInput: Partial<UpdateTemporaryOperationRecordingInput>;
  UpdateTemporaryOperationRecordingResponse: Partial<UpdateTemporaryOperationRecordingResponse>;
  HandlersInput: Partial<HandlersInput>;
  Query: {};
  TemporaryOperationRecordingsInput: Partial<TemporaryOperationRecordingsInput>;
  Workflow: Partial<Workflow>;
  Handler: Partial<Handler>;
  TemporaryOperationRecording: Partial<TemporaryOperationRecording>;
  HandlerSessionCreateSubscriptionInput: Partial<HandlerSessionCreateSubscriptionInput>;
  HandlerStateChangeSubscriptionInput: Partial<HandlerStateChangeSubscriptionInput>;
  Subscription: {};
  Boolean: Partial<Scalars['Boolean']>;
}>;

export type CreateHandlerSessionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateHandlerSessionResponse'] = ResolversParentTypes['CreateHandlerSessionResponse']> = ResolversObject<{
  newHandler: Resolver<ResolversTypes['Handler'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateTemporaryOperationRecordingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTemporaryOperationRecordingResponse'] = ResolversParentTypes['CreateTemporaryOperationRecordingResponse']> = ResolversObject<{
  newRecording: Resolver<ResolversTypes['TemporaryOperationRecording'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateWorkflowResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateWorkflowResponse'] = ResolversParentTypes['CreateWorkflowResponse']> = ResolversObject<{
  resultCode: Resolver<ResolversTypes['CreateWorkflowResultCode'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createHandlerSession: Resolver<ResolversTypes['CreateHandlerSessionResponse'], ParentType, ContextType, RequireFields<MutationCreateHandlerSessionArgs, 'input'>>;
  createTemporaryOperationRecording: Resolver<ResolversTypes['CreateTemporaryOperationRecordingResponse'], ParentType, ContextType, RequireFields<MutationCreateTemporaryOperationRecordingArgs, 'input'>>;
  updateTemporaryOperationRecording: Resolver<ResolversTypes['UpdateTemporaryOperationRecordingResponse'], ParentType, ContextType, RequireFields<MutationUpdateTemporaryOperationRecordingArgs, 'input'>>;
  createWorkflow: Resolver<ResolversTypes['CreateWorkflowResponse'], ParentType, ContextType, RequireFields<MutationCreateWorkflowArgs, 'input'>>;
  playbackRecording: Resolver<ResolversTypes['PlaybackRecordingResponse'], ParentType, ContextType, RequireFields<MutationPlaybackRecordingArgs, 'input'>>;
}>;

export type PlaybackRecordingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlaybackRecordingResponse'] = ResolversParentTypes['PlaybackRecordingResponse']> = ResolversObject<{
  data: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  errors: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateTemporaryOperationRecordingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTemporaryOperationRecordingResponse'] = ResolversParentTypes['UpdateTemporaryOperationRecordingResponse']> = ResolversObject<{
  updatedRecording: Resolver<ResolversTypes['TemporaryOperationRecording'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  handlers: Resolver<Maybe<Array<ResolversTypes['Handler']>>, ParentType, ContextType, RequireFields<QueryHandlersArgs, 'input'>>;
  temporaryOperationRecordings: Resolver<Maybe<Array<ResolversTypes['TemporaryOperationRecording']>>, ParentType, ContextType, RequireFields<QueryTemporaryOperationRecordingsArgs, 'input'>>;
  workflows: Resolver<Maybe<Array<ResolversTypes['Workflow']>>, ParentType, ContextType>;
}>;

export type WorkflowResolvers<ContextType = any, ParentType extends ResolversParentTypes['Workflow'] = ResolversParentTypes['Workflow']> = ResolversObject<{
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HandlerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Handler'] = ResolversParentTypes['Handler']> = ResolversObject<{
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentState: Resolver<ResolversTypes['HandlerState'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TemporaryOperationRecordingResolvers<ContextType = any, ParentType extends ResolversParentTypes['TemporaryOperationRecording'] = ResolversParentTypes['TemporaryOperationRecording']> = ResolversObject<{
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  operationName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  query: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  variables: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  response: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tempSchemaRecordingId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  referrer: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  temporaryOperationRecordingSaved: SubscriptionResolver<Maybe<ResolversTypes['TemporaryOperationRecording']>, "temporaryOperationRecordingSaved", ParentType, ContextType>;
  handlerStateChanged: SubscriptionResolver<Maybe<ResolversTypes['Handler']>, "handlerStateChanged", ParentType, ContextType, RequireFields<SubscriptionHandlerStateChangedArgs, 'input'>>;
  handlerSessionCreated: SubscriptionResolver<Maybe<ResolversTypes['Handler']>, "handlerSessionCreated", ParentType, ContextType, RequireFields<SubscriptionHandlerSessionCreatedArgs, 'input'>>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  CreateHandlerSessionResponse: CreateHandlerSessionResponseResolvers<ContextType>;
  CreateTemporaryOperationRecordingResponse: CreateTemporaryOperationRecordingResponseResolvers<ContextType>;
  CreateWorkflowResponse: CreateWorkflowResponseResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  PlaybackRecordingResponse: PlaybackRecordingResponseResolvers<ContextType>;
  UpdateTemporaryOperationRecordingResponse: UpdateTemporaryOperationRecordingResponseResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Workflow: WorkflowResolvers<ContextType>;
  Handler: HandlerResolvers<ContextType>;
  TemporaryOperationRecording: TemporaryOperationRecordingResolvers<ContextType>;
  Subscription: SubscriptionResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
