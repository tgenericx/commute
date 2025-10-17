import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://proud-jobyna-campusuniverse-22c402c3.koyeb.app/api/graphql",
  documents: ["src/gql/**/*.{gql,graphql}"],
  ignoreNoDocuments: false,
  generates: {
    "src/gql/generated/graphql.ts": {
      plugins: ["typescript"],
    },

    "src/gql/": {
      preset: "near-operation-file",
      plugins: [
        "typescript-react-apollo",
      ],
      presetConfig: {
        extension: ".generated.tsx",
        baseTypesPath: "generated/graphql.ts",
      },
      config: {
        withHooks: true,
      },
    },
  },
  hooks: {
    afterAllFileWrite: [
      "node ./scripts/generate-barrels.js"
    ],
  },
};

export default config;
