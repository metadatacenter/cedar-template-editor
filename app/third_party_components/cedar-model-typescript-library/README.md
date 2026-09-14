# CEDAR Model TypeScript Library

[![Test](https://github.com/metadatacenter/cedar-model-typescript-library/actions/workflows/test.yml/badge.svg?branch=develop)](https://github.com/metadatacenter/cedar-model-typescript-library/actions/workflows/test.yml)

The CEDAR Model TypeScript Library is a TypeScript implementation of the
[CEDAR](https://metadatacenter.org/) artifact model. It provides typed models,
builders, readers, writers, and validators for CEDAR templates, elements, fields,
and metadata instances.

The library reads and writes the JSON, JSON-LD, and YAML representations used by
CEDAR. Applications can use the same model to construct artifacts, parse existing
artifacts, validate metadata instances, and translate between serializations.

For an introduction to the API and examples covering fields, elements, templates,
instances, readers, and writers, see the
[CEDAR Model TypeScript Library documentation](https://metadatacenter.readthedocs.io/en/latest/developer-guide/cedar-model-typescript-library/).

This README covers installing, building, and testing the library.

## Installing the Library

Releases are published to npmjs.org as
[`cedar-model-typescript-library`](https://www.npmjs.com/package/cedar-model-typescript-library):

```shell
npm install cedar-model-typescript-library
```

The package includes CommonJS and ES module bundles together with TypeScript
declarations. Import its public API from the package entry point:

```typescript
import {
  CedarReaders,
  CedarWriters,
  JsonTemplateReaderResult,
  Template,
} from 'cedar-model-typescript-library';

export function jsonTemplateToYaml(templateJson: string): string {
  const result: JsonTemplateReaderResult = CedarReaders
    .json()
    .getStrict()
    .getTemplateReader()
    .readFromString(templateJson);

  const errorCount = result.parsingResult.getBlueprintComparisonErrorCount();
  if (errorCount > 0) {
    throw new Error(`Template contains ${errorCount} parsing errors`);
  }

  const template: Template = result.template;

  return CedarWriters
    .yaml()
    .getStrict()
    .getTemplateWriter()
    .getAsYamlString(template);
}
```

Reader results also contain a parsing report. Applications that accept external
artifacts should inspect its errors and warnings before using the parsed artifact.

The [companion demo repository](https://github.com/metadatacenter/cedar-model-typescript-library-demo)
contains additional runnable examples.

## Building

Use Node 24.19.0, which `.nvmrc` and CI both specify:

```shell
nvm use
npm ci
npm run build
```

The build writes the publishable package to `dist/`. It contains the CommonJS and
ES module bundles, source maps, TypeScript declarations, package manifest,
license, and this README.

For local development, rebuild when source files change:

```shell
npm run build:watch
```

To make the built package available to a local consumer through npm linking:

```shell
npm run build
npm run link
```

Then run `npm link cedar-model-typescript-library` in the consuming project.

## Testing

Run the same checks exercised by continuous integration:

```shell
npm run lint
npm run typecheck
npm run test:coverage
npm run parity:yaml
npm run parity:json
npm run test:package
```

The unit suite covers the model and serialization behavior. The parity gates
compare the TypeScript library with the Java CEDAR Artifact Library over the
vendored JSON and YAML corpora.

`npm run test:package` builds the package that would be published, packs and
installs it into an isolated consumer, and exercises its CommonJS bundle, ES
module bundle, and TypeScript declarations.

## Releasing

Release preparation and publication are documented in
[RELEASING.md](https://github.com/metadatacenter/cedar-model-typescript-library/blob/main/RELEASING.md).
The release command publishes `dist/`, not the repository root.

## License

The CEDAR Model TypeScript Library is released under the
[BSD 2-Clause License](https://github.com/metadatacenter/cedar-model-typescript-library/blob/main/license.txt).

Controlled-term ontology constraints preserve a nondefault service address in YAML
as `sourceUri`, separately from the canonical `sourceIri`. When `sourceUri` is
absent, the reader retains compatibility with existing YAML by deriving the usual
BioPortal address from `sourceAcronym`.
