/* 5e3eeb19e6213f56aa35199867628ae40d25add6
 * This file is automatically generated by graphql-let. */

import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export declare type Maybe<T> = T | null;
export declare type Exact<T extends {
    [key: string]: unknown;
}> = {
    [K in keyof T]: T[K];
};
export declare type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export declare type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
export declare type RequireFields<T, K extends keyof T> = {
    [X in Exclude<keyof T, K>]?: T[X];
} & {
    [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export declare type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    JSON: any;
    JSONObject: any;
};
export declare type CreateHandlerSessionInput = {
    name: Scalars['String'];
};
export declare type CreateHandlerSessionResponse = {
    __typename?: 'CreateHandlerSessionResponse';
    newHandler: Handler;
};
export declare type CreateTemporaryOperationRecordingInput = {
    sessionId: Scalars['String'];
    schema: SchemaInput;
    referrer: Scalars['String'];
    operationName: Scalars['String'];
    query: Scalars['String'];
    variables: Scalars['JSONObject'];
};
export declare type SchemaInput = {
    url: Scalars['String'];
    hash: Scalars['String'];
};
export declare type CreateTemporaryOperationRecordingResponse = {
    __typename?: 'CreateTemporaryOperationRecordingResponse';
    newRecording: TemporaryOperationRecording;
};
export declare type CreateTemporarySchemaRecordingInput = {
    schemaIntrospectionResult: Scalars['JSONObject'];
};
export declare type CreateTemporarySchemaRecordingResponse = {
    __typename?: 'CreateTemporarySchemaRecordingResponse';
    schemaHash: Scalars['ID'];
};
export declare type CreateWorkflowInput = {
    operations: Array<OperationRecordingsInput>;
    schemasMappings: Array<SchemasMappingsInput>;
    workflow: NewWorkflowInput;
};
export declare type OperationRecordingsInput = {
    tempRecordingId: Scalars['ID'];
    sessionId: Scalars['ID'];
};
export declare type SchemasMappingsInput = {
    opsRecordingsSchemaHash: Scalars['ID'];
    opsRecordingsSchemaUrl: Scalars['String'];
    targetSchemaId: Scalars['ID'];
    schemaName: Maybe<Scalars['String']>;
};
export declare type NewWorkflowInput = {
    name: Scalars['String'];
    description: Scalars['String'];
};
export declare enum CreateWorkflowResultCode {
    Success = "SUCCESS",
    Failure = "FAILURE"
}
export declare type CreateWorkflowResponse = {
    __typename?: 'CreateWorkflowResponse';
    resultCode: CreateWorkflowResultCode;
};
export declare type Mutation = {
    __typename?: 'Mutation';
    createHandlerSession: CreateHandlerSessionResponse;
    updateHandlerSession: UpdateHandlerSessionResponse;
    createTemporaryOperationRecording: CreateTemporaryOperationRecordingResponse;
    updateTemporaryOperationRecording: UpdateTemporaryOperationRecordingResponse;
    createTemporarySchemaRecording: CreateTemporarySchemaRecordingResponse;
    createWorkflow: CreateWorkflowResponse;
    playbackRecording: PlaybackRecordingResponse;
};
export declare type MutationCreateHandlerSessionArgs = {
    input: CreateHandlerSessionInput;
};
export declare type MutationUpdateHandlerSessionArgs = {
    input: UpdateHandlerSessionInput;
};
export declare type MutationCreateTemporaryOperationRecordingArgs = {
    input: CreateTemporaryOperationRecordingInput;
};
export declare type MutationUpdateTemporaryOperationRecordingArgs = {
    input: UpdateTemporaryOperationRecordingInput;
};
export declare type MutationCreateTemporarySchemaRecordingArgs = {
    input: CreateTemporarySchemaRecordingInput;
};
export declare type MutationCreateWorkflowArgs = {
    input: CreateWorkflowInput;
};
export declare type MutationPlaybackRecordingArgs = {
    input: PlaybackRecordingInput;
};
export declare type PlaybackRecordingInput = {
    query: Scalars['String'];
    schemaUrl: Scalars['String'];
    workflowId: Scalars['String'];
    variables: Scalars['JSONObject'];
};
export declare type PlaybackRecordingResponse = {
    __typename?: 'PlaybackRecordingResponse';
    data: Maybe<Scalars['JSONObject']>;
    errors: Maybe<Scalars['JSONObject']>;
};
export declare type UpdateHandlerSessionInput = {
    sessionId: Scalars['ID'];
    name: Maybe<Scalars['String']>;
    currentState: Maybe<HandlerState>;
    workflowId: Maybe<Scalars['ID']>;
};
export declare type UpdateHandlerSessionResponse = {
    __typename?: 'UpdateHandlerSessionResponse';
    updatedHandler: Handler;
};
export declare type UpdateTemporaryOperationRecordingInput = {
    sessionId: Scalars['ID'];
    tempOpRecordingId: Scalars['ID'];
    response: Scalars['JSONObject'];
};
export declare type UpdateTemporaryOperationRecordingResponse = {
    __typename?: 'UpdateTemporaryOperationRecordingResponse';
    updatedRecording: TemporaryOperationRecording;
};
export declare type HandlersInput = {
    sessionIds: Array<Scalars['ID']>;
};
export declare type Query = {
    __typename?: 'Query';
    handlers: Maybe<Array<Handler>>;
    schemas: Maybe<Array<SchemaRecording>>;
    temporaryOperationRecordings: Maybe<Array<TemporaryOperationRecording>>;
    workflows: Maybe<Array<Workflow>>;
};
export declare type QueryHandlersArgs = {
    input: HandlersInput;
};
export declare type QueryTemporaryOperationRecordingsArgs = {
    input: TemporaryOperationRecordingsInput;
};
export declare type TemporaryOperationRecordingsInput = {
    sessionId: Scalars['String'];
};
export declare type Workflow = {
    __typename?: 'Workflow';
    id: Scalars['ID'];
    name: Scalars['String'];
};
export declare type Handler = {
    __typename?: 'Handler';
    id: Scalars['ID'];
    name: Scalars['String'];
    currentState: HandlerState;
    workflowId: Maybe<Scalars['ID']>;
};
export declare enum HandlerState {
    Recording = "RECORDING",
    Playback = "PLAYBACK",
    Passthrough = "PASSTHROUGH"
}
export declare type SchemaRecording = {
    __typename?: 'SchemaRecording';
    id: Scalars['String'];
    hash: Scalars['String'];
    name: Scalars['String'];
    schemaUrls: Maybe<Array<Scalars['String']>>;
    introspectionQuery: Scalars['JSONObject'];
};
export declare type TemporaryOperationRecording = {
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
export declare type HandlerSessionCreateSubscriptionInput = {
    name: Scalars['String'];
};
export declare type HandlerStateChangeSubscriptionInput = {
    id: Scalars['ID'];
};
export declare type Subscription = {
    __typename?: 'Subscription';
    temporaryOperationRecordingSaved: Maybe<TemporaryOperationRecording>;
    handlerStateChanged: Maybe<Handler>;
    handlerSessionCreated: Maybe<Handler>;
};
export declare type SubscriptionTemporaryOperationRecordingSavedArgs = {
    input: TemporaryOperationRecordingSavedInput;
};
export declare type SubscriptionHandlerStateChangedArgs = {
    input: HandlerStateChangeSubscriptionInput;
};
export declare type SubscriptionHandlerSessionCreatedArgs = {
    input: HandlerSessionCreateSubscriptionInput;
};
export declare type TemporaryOperationRecordingSavedInput = {
    sessionId: Scalars['ID'];
};
export declare type OnHandlerSessionCreateSubscriptionVariables = Exact<{
    input: HandlerSessionCreateSubscriptionInput;
}>;
export declare type OnHandlerSessionCreateSubscription = ({
    __typename?: 'Subscription';
} & {
    handlerSessionCreated: Maybe<({
        __typename?: 'Handler';
    } & Pick<Handler, 'id' | 'name' | 'currentState'>)>;
});
export declare const OnHandlerSessionCreateDocument: DocumentNode<OnHandlerSessionCreateSubscription, OnHandlerSessionCreateSubscriptionVariables>;
export declare type WithIndex<TObject> = TObject & Record<string, any>;
export declare type ResolversObject<TObject> = WithIndex<TObject>;
export declare type ResolverTypeWrapper<T> = Promise<T> | T;
export declare type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
    fragment: string;
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export declare type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
    selectionSet: string;
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export declare type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export declare type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | StitchingResolver<TResult, TParent, TContext, TArgs>;
export declare type ResolverFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => Promise<TResult> | TResult;
export declare type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;
export declare type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;
export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<{
        [key in TKey]: TResult;
    }, TParent, TContext, TArgs>;
    resolve?: SubscriptionResolveFn<TResult, {
        [key in TKey]: TResult;
    }, TContext, TArgs>;
}
export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
    resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}
export declare type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> = SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs> | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;
export declare type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> = ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>) | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;
export declare type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (parent: TParent, context: TContext, info: GraphQLResolveInfo) => Maybe<TTypes> | Promise<Maybe<TTypes>>;
export declare type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;
export declare type NextResolverFn<T> = () => Promise<T>;
export declare type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (next: NextResolverFn<TResult>, parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;
/** Mapping between all available schema types and the resolvers types */
export declare type ResolversTypes = ResolversObject<{
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
    OperationRecordingsInput: OperationRecordingsInput;
    SchemasMappingsInput: SchemasMappingsInput;
    NewWorkflowInput: NewWorkflowInput;
    CreateWorkflowResultCode: CreateWorkflowResultCode;
    CreateWorkflowResponse: ResolverTypeWrapper<CreateWorkflowResponse>;
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
    SchemaRecording: ResolverTypeWrapper<SchemaRecording>;
    TemporaryOperationRecording: ResolverTypeWrapper<TemporaryOperationRecording>;
    HandlerSessionCreateSubscriptionInput: HandlerSessionCreateSubscriptionInput;
    HandlerStateChangeSubscriptionInput: HandlerStateChangeSubscriptionInput;
    Subscription: ResolverTypeWrapper<{}>;
    TemporaryOperationRecordingSavedInput: TemporaryOperationRecordingSavedInput;
    Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
}>;
/** Mapping between all available schema types and the resolvers parents */
export declare type ResolversParentTypes = ResolversObject<{
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
    OperationRecordingsInput: OperationRecordingsInput;
    SchemasMappingsInput: SchemasMappingsInput;
    NewWorkflowInput: NewWorkflowInput;
    CreateWorkflowResponse: CreateWorkflowResponse;
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
    SchemaRecording: SchemaRecording;
    TemporaryOperationRecording: TemporaryOperationRecording;
    HandlerSessionCreateSubscriptionInput: HandlerSessionCreateSubscriptionInput;
    HandlerStateChangeSubscriptionInput: HandlerStateChangeSubscriptionInput;
    Subscription: {};
    TemporaryOperationRecordingSavedInput: TemporaryOperationRecordingSavedInput;
    Boolean: Scalars['Boolean'];
}>;
export declare type CreateHandlerSessionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateHandlerSessionResponse'] = ResolversParentTypes['CreateHandlerSessionResponse']> = ResolversObject<{
    newHandler: Resolver<ResolversTypes['Handler'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type CreateTemporaryOperationRecordingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTemporaryOperationRecordingResponse'] = ResolversParentTypes['CreateTemporaryOperationRecordingResponse']> = ResolversObject<{
    newRecording: Resolver<ResolversTypes['TemporaryOperationRecording'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type CreateTemporarySchemaRecordingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTemporarySchemaRecordingResponse'] = ResolversParentTypes['CreateTemporarySchemaRecordingResponse']> = ResolversObject<{
    schemaHash: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type CreateWorkflowResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateWorkflowResponse'] = ResolversParentTypes['CreateWorkflowResponse']> = ResolversObject<{
    resultCode: Resolver<ResolversTypes['CreateWorkflowResultCode'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
    createHandlerSession: Resolver<ResolversTypes['CreateHandlerSessionResponse'], ParentType, ContextType, RequireFields<MutationCreateHandlerSessionArgs, 'input'>>;
    updateHandlerSession: Resolver<ResolversTypes['UpdateHandlerSessionResponse'], ParentType, ContextType, RequireFields<MutationUpdateHandlerSessionArgs, 'input'>>;
    createTemporaryOperationRecording: Resolver<ResolversTypes['CreateTemporaryOperationRecordingResponse'], ParentType, ContextType, RequireFields<MutationCreateTemporaryOperationRecordingArgs, 'input'>>;
    updateTemporaryOperationRecording: Resolver<ResolversTypes['UpdateTemporaryOperationRecordingResponse'], ParentType, ContextType, RequireFields<MutationUpdateTemporaryOperationRecordingArgs, 'input'>>;
    createTemporarySchemaRecording: Resolver<ResolversTypes['CreateTemporarySchemaRecordingResponse'], ParentType, ContextType, RequireFields<MutationCreateTemporarySchemaRecordingArgs, 'input'>>;
    createWorkflow: Resolver<ResolversTypes['CreateWorkflowResponse'], ParentType, ContextType, RequireFields<MutationCreateWorkflowArgs, 'input'>>;
    playbackRecording: Resolver<ResolversTypes['PlaybackRecordingResponse'], ParentType, ContextType, RequireFields<MutationPlaybackRecordingArgs, 'input'>>;
}>;
export declare type PlaybackRecordingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlaybackRecordingResponse'] = ResolversParentTypes['PlaybackRecordingResponse']> = ResolversObject<{
    data: Resolver<Maybe<ResolversTypes['JSONObject']>, ParentType, ContextType>;
    errors: Resolver<Maybe<ResolversTypes['JSONObject']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type UpdateHandlerSessionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateHandlerSessionResponse'] = ResolversParentTypes['UpdateHandlerSessionResponse']> = ResolversObject<{
    updatedHandler: Resolver<ResolversTypes['Handler'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type UpdateTemporaryOperationRecordingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTemporaryOperationRecordingResponse'] = ResolversParentTypes['UpdateTemporaryOperationRecordingResponse']> = ResolversObject<{
    updatedRecording: Resolver<ResolversTypes['TemporaryOperationRecording'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
    handlers: Resolver<Maybe<Array<ResolversTypes['Handler']>>, ParentType, ContextType, RequireFields<QueryHandlersArgs, 'input'>>;
    schemas: Resolver<Maybe<Array<ResolversTypes['SchemaRecording']>>, ParentType, ContextType>;
    temporaryOperationRecordings: Resolver<Maybe<Array<ResolversTypes['TemporaryOperationRecording']>>, ParentType, ContextType, RequireFields<QueryTemporaryOperationRecordingsArgs, 'input'>>;
    workflows: Resolver<Maybe<Array<ResolversTypes['Workflow']>>, ParentType, ContextType>;
}>;
export declare type WorkflowResolvers<ContextType = any, ParentType extends ResolversParentTypes['Workflow'] = ResolversParentTypes['Workflow']> = ResolversObject<{
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
export declare type HandlerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Handler'] = ResolversParentTypes['Handler']> = ResolversObject<{
    id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    currentState: Resolver<ResolversTypes['HandlerState'], ParentType, ContextType>;
    workflowId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type SchemaRecordingResolvers<ContextType = any, ParentType extends ResolversParentTypes['SchemaRecording'] = ResolversParentTypes['SchemaRecording']> = ResolversObject<{
    id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    hash: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    schemaUrls: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
    introspectionQuery: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type TemporaryOperationRecordingResolvers<ContextType = any, ParentType extends ResolversParentTypes['TemporaryOperationRecording'] = ResolversParentTypes['TemporaryOperationRecording']> = ResolversObject<{
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
export declare type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
    temporaryOperationRecordingSaved: SubscriptionResolver<Maybe<ResolversTypes['TemporaryOperationRecording']>, "temporaryOperationRecordingSaved", ParentType, ContextType, RequireFields<SubscriptionTemporaryOperationRecordingSavedArgs, 'input'>>;
    handlerStateChanged: SubscriptionResolver<Maybe<ResolversTypes['Handler']>, "handlerStateChanged", ParentType, ContextType, RequireFields<SubscriptionHandlerStateChangedArgs, 'input'>>;
    handlerSessionCreated: SubscriptionResolver<Maybe<ResolversTypes['Handler']>, "handlerSessionCreated", ParentType, ContextType, RequireFields<SubscriptionHandlerSessionCreatedArgs, 'input'>>;
}>;
export declare type Resolvers<ContextType = any> = ResolversObject<{
    CreateHandlerSessionResponse: CreateHandlerSessionResponseResolvers<ContextType>;
    CreateTemporaryOperationRecordingResponse: CreateTemporaryOperationRecordingResponseResolvers<ContextType>;
    CreateTemporarySchemaRecordingResponse: CreateTemporarySchemaRecordingResponseResolvers<ContextType>;
    CreateWorkflowResponse: CreateWorkflowResponseResolvers<ContextType>;
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
export declare type IResolvers<ContextType = any> = Resolvers<ContextType>;
