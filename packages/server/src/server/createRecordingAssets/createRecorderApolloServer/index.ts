import { ApolloServerBase } from 'apollo-server-core';

import { getSchema, SchemaFile } from '../../files';
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
  recordingsPlan: RecordingsPlan;
  rootTypeRecordingsIds: RootTypeRecordingsIds;
}

interface RuntimeVariablesContainer {
  grogqli?: RuntimeVariables;
}

export interface Context {
  schemaId: string;
  runTimeVariables: RuntimeVariablesContainer;
}

export interface RecordingsPlan {
  typeRecordings: {
    [typeRecordingId: string]: {
      typeName: string;
      value: any;
    };
  };
}

export const createRecorderApolloServer: CreateRecorderApolloServer = async ({
  schemaId,
}) => {
  const schemaFile: SchemaFile = await getSchema(schemaId);

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
