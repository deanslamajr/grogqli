declare module '*.graphqls' {
  import { DocumentNode } from 'graphql';
  export default typeof DocumentNode;
}