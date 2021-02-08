import { ApolloServerBase } from 'apollo-server-core';

import { getSchemaRecordingFile, SchemaRecording } from '../../files/schema';
import { createSchemaSDL } from '../../createSchemaSDL';

import { createResolvers } from './createResolvers';

type CreateRecorderApolloServer = (params: {
  schemaId: string;
}) => Promise<ApolloServerBase>;

export interface RootTypeRecordingsIds {
  query: string;
  mutation: string;
  subscription: string;
}

export interface RuntimeVariables {
  parsedOpRecording: any;
  recordingsPlan: OperationRecordingPlan;
  rootTypeRecordingsIds: RootTypeRecordingsIds;
}

interface RuntimeVariablesContainer {
  grogqli?: RuntimeVariables;
}

export interface Context {
  schemaId: string;
  runTimeVariables: RuntimeVariablesContainer;
}

export interface TypeRecordingPlan {
  typeName: string;
  typeRecordingId: string;
  value: any;
}

export interface OperationRecordingPlan {
  schemaId: string;
  name?: string;
  rootTypeRecordingIds: Set<string>;
  typeRecordings: {
    [typeRecordingId: string]: TypeRecordingPlan;
  };
}

export const createRecorderApolloServer: CreateRecorderApolloServer = async ({
  schemaId,
}) => {
  const schemaFile: SchemaRecording = await getSchemaRecordingFile(schemaId);

  const [schemaSDL, resolvers] = await Promise.all([
    createSchemaSDL(schemaFile.introspectionQuery),
    createResolvers(schemaFile),
  ]);

  const runTimeVariables = {} as RuntimeVariablesContainer;

  const context: Context = { schemaId, runTimeVariables };

  return new ApolloServerBase({
    resolvers,
    typeDefs: schemaSDL,
    context,
    plugins: [
      {
        requestDidStart(requestContext) {
          // Inject runtime variables for resolvers
          // TODO find a less hacky way to communicate data that is not known
          // until at the time of query execution (eg parsedOpRecording) to the resolver closure
          runTimeVariables.grogqli = {
            ...requestContext.request?.variables?.grogqliRunTimeVariables,
          };
        },
      },
    ],
  });
};
