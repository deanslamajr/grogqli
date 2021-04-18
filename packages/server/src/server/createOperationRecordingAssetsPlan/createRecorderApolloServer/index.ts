import { ApolloServerBase } from 'apollo-server-core';

import { get as getTempSchemaRecordingFile } from '../../files/tempSchemaRecording';
import { createSchemaSDL } from '../../utils/createSchemaSDL';

import { createResolvers } from './createResolvers';

type CreateRecorderApolloServer = (params: {
  schemaHash: string;
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
  schemaHash: string;
  runTimeVariables: RuntimeVariablesContainer;
}

export interface TypeRecordingPlan {
  typeName: string;
  typeRecordingId: string;
  value: any;
}

export type OperationRecordingPlan = {
  schemaHash: string;
  name?: string;
  rootTypeRecordingIds: Set<string>;
  typeRecordings: {
    [typeRecordingId: string]: TypeRecordingPlan;
  };
};

export const createRecorderApolloServer: CreateRecorderApolloServer = async ({
  schemaHash,
}) => {
  const schemaRecordingFile = await getTempSchemaRecordingFile(schemaHash);
  if (schemaRecordingFile === null) {
    throw new Error(`
      Error while creating apollo server:
      Cannot find a file for a schema recording associated with the following schemaHash:${schemaHash}
    `);
  }

  const [schemaSDL, resolvers] = await Promise.all([
    createSchemaSDL(schemaRecordingFile.introspectionQuery),
    createResolvers(schemaRecordingFile.introspectionQuery),
  ]);

  const runTimeVariables = {} as RuntimeVariablesContainer;

  const context: Context = { schemaHash, runTimeVariables };

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
