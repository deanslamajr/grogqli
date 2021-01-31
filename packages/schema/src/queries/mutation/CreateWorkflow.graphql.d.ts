/* cb927f36932231cedf642953b850fadf5b578d8a
 * This file is automatically generated by graphql-let. */

import { GraphQLResolveInfo } from 'graphql';
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
    variables: Scalars['String'];
};
export declare type SchemaInput = {
    url: Scalars['String'];
    content: Maybe<Scalars['String']>;
};
export declare type CreateTemporaryOperationRecordingResponse = {
    __typename?: 'CreateTemporaryOperationRecordingResponse';
    newRecording: TemporaryOperationRecording;
};
export declare type CreateWorkflowInput = {
    operations: Array<OperationRecordingsInput>;
    schemasMapping: Array<SchemasMappingsInput>;
    workflow: NewWorkflowInput;
};
export declare type OperationRecordingsInput = {
    tempRecordingId: Scalars['String'];
};
export declare type SchemasMappingsInput = {
    id: Scalars['String'];
    url: Scalars['String'];
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
    createTemporaryOperationRecording: CreateTemporaryOperationRecordingResponse;
    createWorkflow: CreateWorkflowResponse;
    playbackRecording: PlaybackRecordingResponse;
    recordResponse: RecordResponseResponse;
};
export declare type MutationCreateHandlerSessionArgs = {
    input: CreateHandlerSessionInput;
};
export declare type MutationCreateTemporaryOperationRecordingArgs = {
    input: CreateTemporaryOperationRecordingInput;
};
export declare type MutationCreateWorkflowArgs = {
    input: CreateWorkflowInput;
};
export declare type MutationPlaybackRecordingArgs = {
    input: PlaybackRecordingInput;
};
export declare type MutationRecordResponseArgs = {
    input: RecordResponseInput;
};
export declare type PlaybackRecordingInput = {
    query: Scalars['String'];
    schemaId: Scalars['String'];
    workflowId: Scalars['String'];
    variables: Maybe<Scalars['String']>;
};
export declare type PlaybackRecordingResponse = {
    __typename?: 'PlaybackRecordingResponse';
    data: Maybe<Scalars['String']>;
    errors: Maybe<Scalars['String']>;
};
export declare type RecordResponseInput = {
    recordingId: Scalars['ID'];
    response: Scalars['String'];
};
export declare type RecordResponseResponse = {
    __typename?: 'RecordResponseResponse';
    newRecording: TemporaryOperationRecording;
};
export declare type HandlersInput = {
    sessionIds: Array<Scalars['ID']>;
};
export declare type Query = {
    __typename?: 'Query';
    handlers: Maybe<Array<Handler>>;
    temporaryOperationRecordings: Maybe<Array<TemporaryOperationRecording>>;
    workflows: Maybe<Array<Workflow>>;
};
export declare type QueryHandlersArgs = {
    input: HandlersInput;
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
};
export declare enum HandlerState {
    Recording = "RECORDING",
    Playback = "PLAYBACK",
    Passthrough = "PASSTHROUGH"
}
export declare type TemporaryOperationRecording = {
    __typename?: 'TemporaryOperationRecording';
    id: Scalars['ID'];
    operationName: Scalars['String'];
    query: Scalars['String'];
    variables: Scalars['String'];
    response: Maybe<Scalars['String']>;
    tempSchemaRecordingId: Scalars['String'];
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
export declare type SubscriptionHandlerStateChangedArgs = {
    input: HandlerStateChangeSubscriptionInput;
};
export declare type SubscriptionHandlerSessionCreatedArgs = {
    input: HandlerSessionCreateSubscriptionInput;
};
export declare type CreateWorkflowMutationVariables = Exact<{
    input: CreateWorkflowInput;
}>;
export declare type CreateWorkflowMutation = ({
    __typename?: 'Mutation';
} & {
    createWorkflow: ({
        __typename?: 'CreateWorkflowResponse';
    } & Pick<CreateWorkflowResponse, 'resultCode'>);
});
export declare const CreateWorkflowDocument: DocumentNode<CreateWorkflowMutation, CreateWorkflowMutationVariables>;
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
    CreateHandlerSessionInput: ResolverTypeWrapper<Partial<CreateHandlerSessionInput>>;
    String: ResolverTypeWrapper<Partial<Scalars['String']>>;
    CreateHandlerSessionResponse: ResolverTypeWrapper<Partial<CreateHandlerSessionResponse>>;
    CreateTemporaryOperationRecordingInput: ResolverTypeWrapper<Partial<CreateTemporaryOperationRecordingInput>>;
    SchemaInput: ResolverTypeWrapper<Partial<SchemaInput>>;
    CreateTemporaryOperationRecordingResponse: ResolverTypeWrapper<Partial<CreateTemporaryOperationRecordingResponse>>;
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
    HandlersInput: ResolverTypeWrapper<Partial<HandlersInput>>;
    Query: ResolverTypeWrapper<{}>;
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
export declare type ResolversParentTypes = ResolversObject<{
    CreateHandlerSessionInput: Partial<CreateHandlerSessionInput>;
    String: Partial<Scalars['String']>;
    CreateHandlerSessionResponse: Partial<CreateHandlerSessionResponse>;
    CreateTemporaryOperationRecordingInput: Partial<CreateTemporaryOperationRecordingInput>;
    SchemaInput: Partial<SchemaInput>;
    CreateTemporaryOperationRecordingResponse: Partial<CreateTemporaryOperationRecordingResponse>;
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
    HandlersInput: Partial<HandlersInput>;
    Query: {};
    Workflow: Partial<Workflow>;
    Handler: Partial<Handler>;
    TemporaryOperationRecording: Partial<TemporaryOperationRecording>;
    HandlerSessionCreateSubscriptionInput: Partial<HandlerSessionCreateSubscriptionInput>;
    HandlerStateChangeSubscriptionInput: Partial<HandlerStateChangeSubscriptionInput>;
    Subscription: {};
    Boolean: Partial<Scalars['Boolean']>;
}>;
export declare type CreateHandlerSessionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateHandlerSessionResponse'] = ResolversParentTypes['CreateHandlerSessionResponse']> = ResolversObject<{
    newHandler: Resolver<ResolversTypes['Handler'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type CreateTemporaryOperationRecordingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTemporaryOperationRecordingResponse'] = ResolversParentTypes['CreateTemporaryOperationRecordingResponse']> = ResolversObject<{
    newRecording: Resolver<ResolversTypes['TemporaryOperationRecording'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type CreateWorkflowResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateWorkflowResponse'] = ResolversParentTypes['CreateWorkflowResponse']> = ResolversObject<{
    resultCode: Resolver<ResolversTypes['CreateWorkflowResultCode'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
    createHandlerSession: Resolver<ResolversTypes['CreateHandlerSessionResponse'], ParentType, ContextType, RequireFields<MutationCreateHandlerSessionArgs, 'input'>>;
    createTemporaryOperationRecording: Resolver<ResolversTypes['CreateTemporaryOperationRecordingResponse'], ParentType, ContextType, RequireFields<MutationCreateTemporaryOperationRecordingArgs, 'input'>>;
    createWorkflow: Resolver<ResolversTypes['CreateWorkflowResponse'], ParentType, ContextType, RequireFields<MutationCreateWorkflowArgs, 'input'>>;
    playbackRecording: Resolver<ResolversTypes['PlaybackRecordingResponse'], ParentType, ContextType, RequireFields<MutationPlaybackRecordingArgs, 'input'>>;
    recordResponse: Resolver<ResolversTypes['RecordResponseResponse'], ParentType, ContextType, RequireFields<MutationRecordResponseArgs, 'input'>>;
}>;
export declare type PlaybackRecordingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlaybackRecordingResponse'] = ResolversParentTypes['PlaybackRecordingResponse']> = ResolversObject<{
    data: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    errors: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type RecordResponseResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecordResponseResponse'] = ResolversParentTypes['RecordResponseResponse']> = ResolversObject<{
    newRecording: Resolver<ResolversTypes['TemporaryOperationRecording'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
    handlers: Resolver<Maybe<Array<ResolversTypes['Handler']>>, ParentType, ContextType, RequireFields<QueryHandlersArgs, 'input'>>;
    temporaryOperationRecordings: Resolver<Maybe<Array<ResolversTypes['TemporaryOperationRecording']>>, ParentType, ContextType>;
    workflows: Resolver<Maybe<Array<ResolversTypes['Workflow']>>, ParentType, ContextType>;
}>;
export declare type WorkflowResolvers<ContextType = any, ParentType extends ResolversParentTypes['Workflow'] = ResolversParentTypes['Workflow']> = ResolversObject<{
    id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type HandlerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Handler'] = ResolversParentTypes['Handler']> = ResolversObject<{
    id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    currentState: Resolver<ResolversTypes['HandlerState'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type TemporaryOperationRecordingResolvers<ContextType = any, ParentType extends ResolversParentTypes['TemporaryOperationRecording'] = ResolversParentTypes['TemporaryOperationRecording']> = ResolversObject<{
    id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    operationName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    query: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    variables: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    response: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    tempSchemaRecordingId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    referrer: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
    temporaryOperationRecordingSaved: SubscriptionResolver<Maybe<ResolversTypes['TemporaryOperationRecording']>, "temporaryOperationRecordingSaved", ParentType, ContextType>;
    handlerStateChanged: SubscriptionResolver<Maybe<ResolversTypes['Handler']>, "handlerStateChanged", ParentType, ContextType, RequireFields<SubscriptionHandlerStateChangedArgs, 'input'>>;
    handlerSessionCreated: SubscriptionResolver<Maybe<ResolversTypes['Handler']>, "handlerSessionCreated", ParentType, ContextType, RequireFields<SubscriptionHandlerSessionCreatedArgs, 'input'>>;
}>;
export declare type Resolvers<ContextType = any> = ResolversObject<{
    CreateHandlerSessionResponse: CreateHandlerSessionResponseResolvers<ContextType>;
    CreateTemporaryOperationRecordingResponse: CreateTemporaryOperationRecordingResponseResolvers<ContextType>;
    CreateWorkflowResponse: CreateWorkflowResponseResolvers<ContextType>;
    Mutation: MutationResolvers<ContextType>;
    PlaybackRecordingResponse: PlaybackRecordingResponseResolvers<ContextType>;
    RecordResponseResponse: RecordResponseResponseResolvers<ContextType>;
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
export declare type IResolvers<ContextType = any> = Resolvers<ContextType>;
