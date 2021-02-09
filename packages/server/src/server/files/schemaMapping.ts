import editJsonFile from 'edit-json-file';
import fs from 'fs';

import {
  doesFileExist,
  mapObjectToJsonFile,
  getSchemaMappingFilePath,
  SCHEMA_MAPPINGS_FILE_VERSION,
} from './';

type SchemaMappingFile = SchemaMappingFileVersion1;
interface SchemaMappingFileVersion1 {
  version: 1;
  mappings: { [schemaUrl: string]: string };
}

type Add = (params: { schemaId: string; schemaUrl: string }) => Promise<void>;
export const add: Add = async ({ schemaId, schemaUrl }) => {
  const schemaMappingFilePath = await getSchemaMappingFilePath();
  const schemaMappingFile = editJsonFile(schemaMappingFilePath);

  if (doesFileExist(schemaMappingFile)) {
    schemaMappingFile.set(`mappings.${schemaUrl}`, schemaId);
  } else {
    const newSchemaMappingFileContents: SchemaMappingFile = {
      version: SCHEMA_MAPPINGS_FILE_VERSION,
      mappings: {
        [schemaUrl]: schemaId,
      },
    };
    mapObjectToJsonFile(newSchemaMappingFileContents, schemaMappingFile);
  }

  schemaMappingFile.save();
};

type GetIdFromUrl = (schemaUrl: string) => Promise<string | null>;
export const getIdFromUrl: GetIdFromUrl = async (schemaUrl) => {
  const schemaMappingFilePath = await getSchemaMappingFilePath();

  let schemaMappingFile: SchemaMappingFile;
  try {
    schemaMappingFile = JSON.parse(
      await fs.promises.readFile(schemaMappingFilePath, 'utf8')
    );
  } catch (error) {
    return null;
  }

  const schemaId = schemaMappingFile.mappings[schemaUrl];

  return schemaId || null;
};
