/* 27efb150fabb8d3e910bafecb1dfdaa02fe5740b
 * This file is automatically generated by graphql-let. */

import { GraphQLResolveInfo } from 'graphql';
export declare type Maybe<T> = T | null;
export declare type Exact<T extends {
    [key: string]: unknown;
}> = {
    [K in keyof T]: T[K];
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
export declare type CreateRecordingInput = {
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
export declare type CreateRecordingResponse = {
    __typename?: 'CreateRecordingResponse';
    newRecording: Recording;
};
export declare type Mutation = {
    __typename?: 'Mutation';
    createRecording: CreateRecordingResponse;
    recordResponse: RecordResponseResponse;
};
export declare type MutationCreateRecordingArgs = {
    input: CreateRecordingInput;
};
export declare type MutationRecordResponseArgs = {
    input: RecordResponseInput;
};
export declare type RecordResponseInput = {
    recordingId: Scalars['ID'];
    response: Scalars['String'];
};
export declare type RecordResponseResponse = {
    __typename?: 'RecordResponseResponse';
    newRecording: Recording;
};
export declare type Query = {
    __typename?: 'Query';
    recordings: Maybe<Array<Recording>>;
};
export declare type Recording = {
    __typename?: 'Recording';
    id: Scalars['ID'];
    operationName: Scalars['String'];
    query: Scalars['String'];
    variables: Scalars['String'];
    response: Maybe<Scalars['String']>;
    schemaUrl: Scalars['String'];
    referrer: Scalars['String'];
};
export declare type Subscription = {
    __typename?: 'Subscription';
    recordingSaved: Maybe<Recording>;
};
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
    CreateRecordingInput: ResolverTypeWrapper<Partial<CreateRecordingInput>>;
    String: ResolverTypeWrapper<Partial<Scalars['String']>>;
    SchemaInput: ResolverTypeWrapper<Partial<SchemaInput>>;
    CreateRecordingResponse: ResolverTypeWrapper<Partial<CreateRecordingResponse>>;
    Mutation: ResolverTypeWrapper<{}>;
    RecordResponseInput: ResolverTypeWrapper<Partial<RecordResponseInput>>;
    ID: ResolverTypeWrapper<Partial<Scalars['ID']>>;
    RecordResponseResponse: ResolverTypeWrapper<Partial<RecordResponseResponse>>;
    Query: ResolverTypeWrapper<{}>;
    Recording: ResolverTypeWrapper<Partial<Recording>>;
    Subscription: ResolverTypeWrapper<{}>;
    Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']>>;
}>;
/** Mapping between all available schema types and the resolvers parents */
export declare type ResolversParentTypes = ResolversObject<{
    CreateRecordingInput: Partial<CreateRecordingInput>;
    String: Partial<Scalars['String']>;
    SchemaInput: Partial<SchemaInput>;
    CreateRecordingResponse: Partial<CreateRecordingResponse>;
    Mutation: {};
    RecordResponseInput: Partial<RecordResponseInput>;
    ID: Partial<Scalars['ID']>;
    RecordResponseResponse: Partial<RecordResponseResponse>;
    Query: {};
    Recording: Partial<Recording>;
    Subscription: {};
    Boolean: Partial<Scalars['Boolean']>;
}>;
export declare type CreateRecordingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateRecordingResponse'] = ResolversParentTypes['CreateRecordingResponse']> = ResolversObject<{
    newRecording: Resolver<ResolversTypes['Recording'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
    createRecording: Resolver<ResolversTypes['CreateRecordingResponse'], ParentType, ContextType, RequireFields<MutationCreateRecordingArgs, 'input'>>;
    recordResponse: Resolver<ResolversTypes['RecordResponseResponse'], ParentType, ContextType, RequireFields<MutationRecordResponseArgs, 'input'>>;
}>;
export declare type RecordResponseResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecordResponseResponse'] = ResolversParentTypes['RecordResponseResponse']> = ResolversObject<{
    newRecording: Resolver<ResolversTypes['Recording'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
    recordings: Resolver<Maybe<Array<ResolversTypes['Recording']>>, ParentType, ContextType>;
}>;
export declare type RecordingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Recording'] = ResolversParentTypes['Recording']> = ResolversObject<{
    id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    operationName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    query: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    variables: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    response: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    schemaUrl: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    referrer: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
    recordingSaved: SubscriptionResolver<Maybe<ResolversTypes['Recording']>, "recordingSaved", ParentType, ContextType>;
}>;
export declare type Resolvers<ContextType = any> = ResolversObject<{
    CreateRecordingResponse: CreateRecordingResponseResolvers<ContextType>;
    Mutation: MutationResolvers<ContextType>;
    RecordResponseResponse: RecordResponseResponseResolvers<ContextType>;
    Query: QueryResolvers<ContextType>;
    Recording: RecordingResolvers<ContextType>;
    Subscription: SubscriptionResolvers<ContextType>;
}>;
/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export declare type IResolvers<ContextType = any> = Resolvers<ContextType>;

          
// This is an extra code in addition to what graphql-codegen makes.
// Users are likely to use 'graphql-tag/loader' with 'graphql-tag/schema/loader'
// in webpack. This code enables the result to be typed.
import { DocumentNode } from 'graphql'
export default typeof DocumentNode
