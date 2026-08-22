# CEDAR Model Typescript Library

A library to work with CEDAR templates and instances - implemented in TypeScript

## Install

```shell
npm install cedar-model-typescript-library
```

## YAML scalar style

Canonical YAML leaves values plain only for `type`, `modelVersion`, `status`, `version`, `datatype`,
`action`, `granularity`, `termType`, and `inputTimeFormat`, and only when the value belongs to that
field's CEDAR-owned vocabulary. IRIs, timestamps, external vocabularies, and user-authored strings
remain double-quoted. The Java artifact library applies and tests the same policy.

## See it in action

Check out the README at the companion [demo repo](https://github.com/metadatacenter/cedar-model-typescript-library-demo)
