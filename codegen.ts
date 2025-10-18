import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://proud-jobyna-campusuniverse-22c402c3.koyeb.app/api/graphql',
  documents: ["src/**/*.{gql,graphql}"],
  generates: {
    './src/graphql/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
};

export default config;

