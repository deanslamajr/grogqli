/* 60cc48f3713cdfb0a7b45ac23ab57126d67f5e33
 * This file is automatically generated by graphql-let. */

import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
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
  JSON: any;
  JSONObject: any;
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
  variables: Scalars['JSONObject'];
};

export type SchemaInput = {
  url: Scalars['String'];
  hash: Scalars['String'];
};

export type CreateTemporaryOperationRecordingResponse = {
  __typename?: 'CreateTemporaryOperationRecordingResponse';
  newRecording: TemporaryOperationRecording;
};

export type CreateTemporarySchemaRecordingInput = {
  schemaIntrospectionResult: Scalars['JSONObject'];
};

export type CreateTemporarySchemaRecordingResponse = {
  __typename?: 'CreateTemporarySchemaRecordingResponse';
  schemaHash: Scalars['ID'];
};

export type CreateWorkflowInput = {
  operations: Array<OperationRecordingsInput>;
  schemasMappings: Array<SchemasMappingsInput>;
  workflow: NewWorkflowInput;
};

export type SchemasMappingsInput = {
  opsRecordingsSchemaHash: Scalars['ID'];
  opsRecordingsSchemaUrl: Scalars['String'];
  targetSchemaId: Scalars['ID'];
  schemaName: Maybe<Scalars['String']>;
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

export type CreateWorkflowRecordingPlanInput = {
  operations: Array<OperationRecordingsInput>;
};

export type CreateWorkflowRecordingPlanResponse = {
  __typename?: 'CreateWorkflowRecordingPlanResponse';
  newPlan: WorkflowRecordingPlan;
};

export type WorkflowRecordingPlan = {
  __typename?: 'WorkflowRecordingPlan';
  operationRecordingPlans: Array<OperationRecordingPlan>;
  schemaMatchResults: Array<SchemaMatchResult>;
  schemas: Array<SchemaRecording>;
};

export type OperationRecordingPlan = {
  __typename?: 'OperationRecordingPlan';
  id: Scalars['ID'];
  opName: Scalars['String'];
  sdl: Scalars['String'];
  temporarySchemaRecordingHash: Scalars['String'];
  rootTypeRecordingIds: Array<Scalars['String']>;
  typeRecordingPlans: Array<TypeRecordingPlan>;
};

export type TypeRecordingPlan = {
  __typename?: 'TypeRecordingPlan';
  typeName: Scalars['String'];
  typeRecordingId: Scalars['ID'];
  value: Scalars['String'];
};

export type SchemaMatchResult = {
  __typename?: 'SchemaMatchResult';
  temporarySchemaRecordingHash: Scalars['String'];
  schemaMatch: SchemaMatch;
};

export type SchemaMatch = {
  __typename?: 'SchemaMatch';
  schemaId: Scalars['ID'];
  schemaHash: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createHandlerSession: CreateHandlerSessionResponse;
  updateHandlerSession: UpdateHandlerSessionResponse;
  createTemporaryOperationRecording: CreateTemporaryOperationRecordingResponse;
  updateTemporaryOperationRecording: UpdateTemporaryOperationRecordingResponse;
  createTemporarySchemaRecording: CreateTemporarySchemaRecordingResponse;
  createWorkflowRecordingPlan: CreateWorkflowRecordingPlanResponse;
  createWorkflow: CreateWorkflowResponse;
  playbackRecording: PlaybackRecordingResponse;
};


export type MutationCreateHandlerSessionArgs = {
  input: CreateHandlerSessionInput;
};


export type MutationUpdateHandlerSessionArgs = {
  input: UpdateHandlerSessionInput;
};


export type MutationCreateTemporaryOperationRecordingArgs = {
  input: CreateTemporaryOperationRecordingInput;
};


export type MutationUpdateTemporaryOperationRecordingArgs = {
  input: UpdateTemporaryOperationRecordingInput;
};


export type MutationCreateTemporarySchemaRecordingArgs = {
  input: CreateTemporarySchemaRecordingInput;
};


export type MutationCreateWorkflowRecordingPlanArgs = {
  input: CreateWorkflowRecordingPlanInput;
};


export type MutationCreateWorkflowArgs = {
  input: CreateWorkflowInput;
};


export type MutationPlaybackRecordingArgs = {
  input: PlaybackRecordingInput;
};

export type PlaybackRecordingInput = {
  query: Scalars['String'];
  schemaUrl: Scalars['String'];
  workflowId: Scalars['String'];
  variables: Scalars['JSONObject'];
};

export type PlaybackRecordingResponse = {
  __typename?: 'PlaybackRecordingResponse';
  data: Maybe<Scalars['JSONObject']>;
  errors: Maybe<Scalars['JSONObject']>;
};

export type UpdateHandlerSessionInput = {
  sessionId: Scalars['ID'];
  name: Maybe<Scalars['String']>;
  currentState: Maybe<HandlerState>;
  workflowId: Maybe<Scalars['ID']>;
};

export type UpdateHandlerSessionResponse = {
  __typename?: 'UpdateHandlerSessionResponse';
  updatedHandler: Handler;
};

export type UpdateTemporaryOperationRecordingInput = {
  sessionId: Scalars['ID'];
  tempOpRecordingId: Scalars['ID'];
  response: Scalars['JSONObject'];
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
  schemas: Maybe<Array<SchemaRecording>>;
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
  workflowId: Maybe<Scalars['ID']>;
};

export enum HandlerState {
  Recording = 'RECORDING',
  Playback = 'PLAYBACK',
  Passthrough = 'PASSTHROUGH'
}

export type OperationRecordingsInput = {
  tempRecordingId: Scalars['ID'];
  sessionId: Scalars['ID'];
};

export type SchemaRecording = {
  __typename?: 'SchemaRecording';
  id: Scalars['String'];
  hash: Scalars['String'];
  name: Scalars['String'];
  schemaUrls: Maybe<Array<Scalars['String']>>;
  introspectionQuery: Scalars['JSONObject'];
};

export type TemporaryOperationRecording = {
  __typename?: 'TemporaryOperationRecording';
  id: Scalars['ID'];
  operationName: Scalars['String'];
  sessionId: Scalars['ID'];
  query: Scalars['String'];
  variables: Scalars['JSONObject'];
  response: Maybe<Scalars['JSONObject']>;
  schemaUrl: Scalars['String'];
  schemaHash: Scalars['String'];
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


export type SubscriptionTemporaryOperationRecordingSavedArgs = {
  input: TemporaryOperationRecordingSavedInput;
};


export type SubscriptionHandlerStateChangedArgs = {
  input: HandlerStateChangeSubscriptionInput;
};


export type SubscriptionHandlerSessionCreatedArgs = {
  input: HandlerSessionCreateSubscriptionInput;
};

export type TemporaryOperationRecordingSavedInput = {
  sessionId: Scalars['ID'];
};

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
  CreateHandlerSessionInput: CreateHandlerSessionInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  CreateHandlerSessionResponse: ResolverTypeWrapper<CreateHandlerSessionResponse>;
  CreateTemporaryOperationRecordingInput: CreateTemporaryOperationRecordingInput;
  SchemaInput: SchemaInput;
  CreateTemporaryOperationRecordingResponse: ResolverTypeWrapper<CreateTemporaryOperationRecordingResponse>;
  CreateTemporarySchemaRecordingInput: CreateTemporarySchemaRecordingInput;
  CreateTemporarySchemaRecordingResponse: ResolverTypeWrapper<CreateTemporarySchemaRecordingResponse>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  CreateWorkflowInput: CreateWorkflowInput;
  SchemasMappingsInput: SchemasMappingsInput;
  NewWorkflowInput: NewWorkflowInput;
  CreateWorkflowResultCode: CreateWorkflowResultCode;
  CreateWorkflowResponse: ResolverTypeWrapper<CreateWorkflowResponse>;
  CreateWorkflowRecordingPlanInput: CreateWorkflowRecordingPlanInput;
  CreateWorkflowRecordingPlanResponse: ResolverTypeWrapper<CreateWorkflowRecordingPlanResponse>;
  WorkflowRecordingPlan: ResolverTypeWrapper<WorkflowRecordingPlan>;
  OperationRecordingPlan: ResolverTypeWrapper<OperationRecordingPlan>;
  TypeRecordingPlan: ResolverTypeWrapper<TypeRecordingPlan>;
  SchemaMatchResult: ResolverTypeWrapper<SchemaMatchResult>;
  SchemaMatch: ResolverTypeWrapper<SchemaMatch>;
  Mutation: ResolverTypeWrapper<{}>;
  PlaybackRecordingInput: PlaybackRecordingInput;
  PlaybackRecordingResponse: ResolverTypeWrapper<PlaybackRecordingResponse>;
  UpdateHandlerSessionInput: UpdateHandlerSessionInput;
  UpdateHandlerSessionResponse: ResolverTypeWrapper<UpdateHandlerSessionResponse>;
  UpdateTemporaryOperationRecordingInput: UpdateTemporaryOperationRecordingInput;
  UpdateTemporaryOperationRecordingResponse: ResolverTypeWrapper<UpdateTemporaryOperationRecordingResponse>;
  HandlersInput: HandlersInput;
  Query: ResolverTypeWrapper<{}>;
  TemporaryOperationRecordingsInput: TemporaryOperationRecordingsInput;
  Workflow: ResolverTypeWrapper<Workflow>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']>;
  Handler: ResolverTypeWrapper<Handler>;
  HandlerState: HandlerState;
  OperationRecordingsInput: OperationRecordingsInput;
  SchemaRecording: ResolverTypeWrapper<SchemaRecording>;
  TemporaryOperationRecording: ResolverTypeWrapper<TemporaryOperationRecording>;
  HandlerSessionCreateSubscriptionInput: HandlerSessionCreateSubscriptionInput;
  HandlerStateChangeSubscriptionInput: HandlerStateChangeSubscriptionInput;
  Subscription: ResolverTypeWrapper<{}>;
  TemporaryOperationRecordingSavedInput: TemporaryOperationRecordingSavedInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  CreateHandlerSessionInput: CreateHandlerSessionInput;
  String: Scalars['String'];
  CreateHandlerSessionResponse: CreateHandlerSessionResponse;
  CreateTemporaryOperationRecordingInput: CreateTemporaryOperationRecordingInput;
  SchemaInput: SchemaInput;
  CreateTemporaryOperationRecordingResponse: CreateTemporaryOperationRecordingResponse;
  CreateTemporarySchemaRecordingInput: CreateTemporarySchemaRecordingInput;
  CreateTemporarySchemaRecordingResponse: CreateTemporarySchemaRecordingResponse;
  ID: Scalars['ID'];
  CreateWorkflowInput: CreateWorkflowInput;
  SchemasMappingsInput: SchemasMappingsInput;
  NewWorkflowInput: NewWorkflowInput;
  CreateWorkflowResponse: CreateWorkflowResponse;
  CreateWorkflowRecordingPlanInput: CreateWorkflowRecordingPlanInput;
  CreateWorkflowRecordingPlanResponse: CreateWorkflowRecordingPlanResponse;
  WorkflowRecordingPlan: WorkflowRecordingPlan;
  OperationRecordingPlan: OperationRecordingPlan;
  TypeRecordingPlan: TypeRecordingPlan;
  SchemaMatchResult: SchemaMatchResult;
  SchemaMatch: SchemaMatch;
  Mutation: {};
  PlaybackRecordingInput: PlaybackRecordingInput;
  PlaybackRecordingResponse: PlaybackRecordingResponse;
  UpdateHandlerSessionInput: UpdateHandlerSessionInput;
  UpdateHandlerSessionResponse: UpdateHandlerSessionResponse;
  UpdateTemporaryOperationRecordingInput: UpdateTemporaryOperationRecordingInput;
  UpdateTemporaryOperationRecordingResponse: UpdateTemporaryOperationRecordingResponse;
  HandlersInput: HandlersInput;
  Query: {};
  TemporaryOperationRecordingsInput: TemporaryOperationRecordingsInput;
  Workflow: Workflow;
  JSON: Scalars['JSON'];
  JSONObject: Scalars['JSONObject'];
  Handler: Handler;
  OperationRecordingsInput: OperationRecordingsInput;
  SchemaRecording: SchemaRecording;
  TemporaryOperationRecording: TemporaryOperationRecording;
  HandlerSessionCreateSubscriptionInput: HandlerSessionCreateSubscriptionInput;
  HandlerStateChangeSubscriptionInput: HandlerStateChangeSubscriptionInput;
  Subscription: {};
  TemporaryOperationRecordingSavedInput: TemporaryOperationRecordingSavedInput;
  Boolean: Scalars['Boolean'];
}>;

export type CreateHandlerSessionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateHandlerSessionResponse'] = ResolversParentTypes['CreateHandlerSessionResponse']> = ResolversObject<{
  newHandler: Resolver<ResolversTypes['Handler'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateTemporaryOperationRecordingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTemporaryOperationRecordingResponse'] = ResolversParentTypes['CreateTemporaryOperationRecordingResponse']> = ResolversObject<{
  newRecording: Resolver<ResolversTypes['TemporaryOperationRecording'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateTemporarySchemaRecordingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTemporarySchemaRecordingResponse'] = ResolversParentTypes['CreateTemporarySchemaRecordingResponse']> = ResolversObject<{
  schemaHash: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateWorkflowResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateWorkflowResponse'] = ResolversParentTypes['CreateWorkflowResponse']> = ResolversObject<{
  resultCode: Resolver<ResolversTypes['CreateWorkflowResultCode'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateWorkflowRecordingPlanResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateWorkflowRecordingPlanResponse'] = ResolversParentTypes['CreateWorkflowRecordingPlanResponse']> = ResolversObject<{
  newPlan: Resolver<ResolversTypes['WorkflowRecordingPlan'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WorkflowRecordingPlanResolvers<ContextType = any, ParentType extends ResolversParentTypes['WorkflowRecordingPlan'] = ResolversParentTypes['WorkflowRecordingPlan']> = ResolversObject<{
  operationRecordingPlans: Resolver<Array<ResolversTypes['OperationRecordingPlan']>, ParentType, ContextType>;
  schemaMatchResults: Resolver<Array<ResolversTypes['SchemaMatchResult']>, ParentType, ContextType>;
  schemas: Resolver<Array<ResolversTypes['SchemaRecording']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OperationRecordingPlanResolvers<ContextType = any, ParentType extends ResolversParentTypes['OperationRecordingPlan'] = ResolversParentTypes['OperationRecordingPlan']> = ResolversObject<{
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  opName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sdl: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  temporarySchemaRecordingHash: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rootTypeRecordingIds: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  typeRecordingPlans: Resolver<Array<ResolversTypes['TypeRecordingPlan']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TypeRecordingPlanResolvers<ContextType = any, ParentType extends ResolversParentTypes['TypeRecordingPlan'] = ResolversParentTypes['TypeRecordingPlan']> = ResolversObject<{
  typeName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  typeRecordingId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  value: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SchemaMatchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SchemaMatchResult'] = ResolversParentTypes['SchemaMatchResult']> = ResolversObject<{
  temporarySchemaRecordingHash: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  schemaMatch: Resolver<ResolversTypes['SchemaMatch'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SchemaMatchResolvers<ContextType = any, ParentType extends ResolversParentTypes['SchemaMatch'] = ResolversParentTypes['SchemaMatch']> = ResolversObject<{
  schemaId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  schemaHash: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createHandlerSession: Resolver<ResolversTypes['CreateHandlerSessionResponse'], ParentType, ContextType, RequireFields<MutationCreateHandlerSessionArgs, 'input'>>;
  updateHandlerSession: Resolver<ResolversTypes['UpdateHandlerSessionResponse'], ParentType, ContextType, RequireFields<MutationUpdateHandlerSessionArgs, 'input'>>;
  createTemporaryOperationRecording: Resolver<ResolversTypes['CreateTemporaryOperationRecordingResponse'], ParentType, ContextType, RequireFields<MutationCreateTemporaryOperationRecordingArgs, 'input'>>;
  updateTemporaryOperationRecording: Resolver<ResolversTypes['UpdateTemporaryOperationRecordingResponse'], ParentType, ContextType, RequireFields<MutationUpdateTemporaryOperationRecordingArgs, 'input'>>;
  createTemporarySchemaRecording: Resolver<ResolversTypes['CreateTemporarySchemaRecordingResponse'], ParentType, ContextType, RequireFields<MutationCreateTemporarySchemaRecordingArgs, 'input'>>;
  createWorkflowRecordingPlan: Resolver<ResolversTypes['CreateWorkflowRecordingPlanResponse'], ParentType, ContextType, RequireFields<MutationCreateWorkflowRecordingPlanArgs, 'input'>>;
  createWorkflow: Resolver<ResolversTypes['CreateWorkflowResponse'], ParentType, ContextType, RequireFields<MutationCreateWorkflowArgs, 'input'>>;
  playbackRecording: Resolver<ResolversTypes['PlaybackRecordingResponse'], ParentType, ContextType, RequireFields<MutationPlaybackRecordingArgs, 'input'>>;
}>;

export type PlaybackRecordingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlaybackRecordingResponse'] = ResolversParentTypes['PlaybackRecordingResponse']> = ResolversObject<{
  data: Resolver<Maybe<ResolversTypes['JSONObject']>, ParentType, ContextType>;
  errors: Resolver<Maybe<ResolversTypes['JSONObject']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateHandlerSessionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateHandlerSessionResponse'] = ResolversParentTypes['UpdateHandlerSessionResponse']> = ResolversObject<{
  updatedHandler: Resolver<ResolversTypes['Handler'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateTemporaryOperationRecordingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTemporaryOperationRecordingResponse'] = ResolversParentTypes['UpdateTemporaryOperationRecordingResponse']> = ResolversObject<{
  updatedRecording: Resolver<ResolversTypes['TemporaryOperationRecording'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  handlers: Resolver<Maybe<Array<ResolversTypes['Handler']>>, ParentType, ContextType, RequireFields<QueryHandlersArgs, 'input'>>;
  schemas: Resolver<Maybe<Array<ResolversTypes['SchemaRecording']>>, ParentType, ContextType>;
  temporaryOperationRecordings: Resolver<Maybe<Array<ResolversTypes['TemporaryOperationRecording']>>, ParentType, ContextType, RequireFields<QueryTemporaryOperationRecordingsArgs, 'input'>>;
  workflows: Resolver<Maybe<Array<ResolversTypes['Workflow']>>, ParentType, ContextType>;
}>;

export type WorkflowResolvers<ContextType = any, ParentType extends ResolversParentTypes['Workflow'] = ResolversParentTypes['Workflow']> = ResolversObject<{
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type HandlerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Handler'] = ResolversParentTypes['Handler']> = ResolversObject<{
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentState: Resolver<ResolversTypes['HandlerState'], ParentType, ContextType>;
  workflowId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SchemaRecordingResolvers<ContextType = any, ParentType extends ResolversParentTypes['SchemaRecording'] = ResolversParentTypes['SchemaRecording']> = ResolversObject<{
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hash: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  schemaUrls: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  introspectionQuery: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TemporaryOperationRecordingResolvers<ContextType = any, ParentType extends ResolversParentTypes['TemporaryOperationRecording'] = ResolversParentTypes['TemporaryOperationRecording']> = ResolversObject<{
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  operationName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sessionId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  query: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  variables: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  response: Resolver<Maybe<ResolversTypes['JSONObject']>, ParentType, ContextType>;
  schemaUrl: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  schemaHash: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  referrer: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  temporaryOperationRecordingSaved: SubscriptionResolver<Maybe<ResolversTypes['TemporaryOperationRecording']>, "temporaryOperationRecordingSaved", ParentType, ContextType, RequireFields<SubscriptionTemporaryOperationRecordingSavedArgs, 'input'>>;
  handlerStateChanged: SubscriptionResolver<Maybe<ResolversTypes['Handler']>, "handlerStateChanged", ParentType, ContextType, RequireFields<SubscriptionHandlerStateChangedArgs, 'input'>>;
  handlerSessionCreated: SubscriptionResolver<Maybe<ResolversTypes['Handler']>, "handlerSessionCreated", ParentType, ContextType, RequireFields<SubscriptionHandlerSessionCreatedArgs, 'input'>>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  CreateHandlerSessionResponse: CreateHandlerSessionResponseResolvers<ContextType>;
  CreateTemporaryOperationRecordingResponse: CreateTemporaryOperationRecordingResponseResolvers<ContextType>;
  CreateTemporarySchemaRecordingResponse: CreateTemporarySchemaRecordingResponseResolvers<ContextType>;
  CreateWorkflowResponse: CreateWorkflowResponseResolvers<ContextType>;
  CreateWorkflowRecordingPlanResponse: CreateWorkflowRecordingPlanResponseResolvers<ContextType>;
  WorkflowRecordingPlan: WorkflowRecordingPlanResolvers<ContextType>;
  OperationRecordingPlan: OperationRecordingPlanResolvers<ContextType>;
  TypeRecordingPlan: TypeRecordingPlanResolvers<ContextType>;
  SchemaMatchResult: SchemaMatchResultResolvers<ContextType>;
  SchemaMatch: SchemaMatchResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  PlaybackRecordingResponse: PlaybackRecordingResponseResolvers<ContextType>;
  UpdateHandlerSessionResponse: UpdateHandlerSessionResponseResolvers<ContextType>;
  UpdateTemporaryOperationRecordingResponse: UpdateTemporaryOperationRecordingResponseResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Workflow: WorkflowResolvers<ContextType>;
  JSON: GraphQLScalarType;
  JSONObject: GraphQLScalarType;
  Handler: HandlerResolvers<ContextType>;
  SchemaRecording: SchemaRecordingResolvers<ContextType>;
  TemporaryOperationRecording: TemporaryOperationRecordingResolvers<ContextType>;
  Subscription: SubscriptionResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
