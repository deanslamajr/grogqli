import { join } from 'path'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'

const loadedFiles = loadFilesSync(join(process.cwd(), '**/*.graphqls'))
export const typeDefs = mergeTypeDefs(loadedFiles)