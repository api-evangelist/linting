# API Linting

A topic index for the tools, rulesets, vocabularies, and practices that
automate API style guide enforcement across OpenAPI, AsyncAPI, JSON
Schema, and adjacent contract formats. This repository catalogs the
linters in active use across the industry, normalizes their shared
concepts into a single vocabulary, and publishes a portable schema for
representing a linting rule independently of the tool that produced it.

**Catalog:** [`apis.yml`](apis.yml) — 10 linting tools and platforms
**Type:** Topic
**Tags:** API Design, API Governance, API Linting, API Style Guide, AsyncAPI, JSON Schema, OpenAPI, Quality Assurance
**Modified:** 2026-05-22

---

## The Landscape

API linting graduated from "a script in CI" to a discipline somewhere
around 2019, when Stoplight released Spectral and gave teams a shared
grammar for expressing API design rules as data rather than code. Six
years on, the practice has split into four overlapping schools:

1. **Declarative rule engines** — Spectral, Vacuum, Redocly CLI, and
   Postman API Governance evaluate JSONPath-style selectors against an
   OpenAPI/AsyncAPI document and run a built-in function on each match.
   The rules are YAML/JSON; the engine is a library. This is the
   majority of the market.
2. **Custom-function rulesets** — Optic (and Snyk's sweater-comb on top
   of it) expresses each rule as TypeScript with a type-safe
   FactsContext. You give up the declarative shape in exchange for IDE
   completion, refactoring, and the ability to reach across an entire
   diff. The model is heavier but catches things JSONPath cannot.
3. **Generator-driven validation** — Speakeasy ships a linter whose
   job is to ensure an OpenAPI spec can produce a clean SDK. The
   `speakeasy-generation` ruleset is always applied and cannot be
   overridden; everything else is configurable.
4. **Registry-side content rules** — Apicurio Registry treats linting
   as part of artifact intake. Rules like `VALIDITY`,
   `COMPATIBILITY`, and `INTEGRITY` run on upload and block the
   artifact before any consumer can pick it up. Apicurio is the
   canonical reference for governance-at-rest rather than governance-
   at-design-time.

Runtime validation (APIMetrics) closes the loop by enforcing schema
conformance against live traffic — useful as a guard against drift
between the published spec and what the service actually returns, but
not a substitute for either design-time or registry-side checks.

## Cataloged Tools

| Tool | Rules Format | Engine | Integration Points | Supported Formats |
|------|-------------|--------|--------------------|-------------------|
| **Spectral** | spectral-yaml | JavaScript | CLI, CI, VS Code, Node SDK | OpenAPI 2.0/3.0/3.1, AsyncAPI 2.x, Arazzo 1.0 |
| **Vacuum** | spectral-yaml | Go | CLI, CI, VS Code, Dashboard, Go SDK | OpenAPI 2.0/3.0/3.1/3.2 |
| **Redocly CLI** | redocly-yaml | TypeScript | CLI, CI, GitHub Actions | OpenAPI 2.0/3.0/3.1, AsyncAPI 2.x/3.0, Arazzo 1.0, Open-RPC |
| **Optic** | optic-typescript | TypeScript | CLI, CI, Node SDK | OpenAPI 3.0/3.1 (archived 2026-01-12) |
| **Apicurio Registry** | apicurio-content-rules | Java | REST API, UI, CI, Kafka SerDes | OpenAPI, AsyncAPI, Avro, JSON Schema, Protobuf, GraphQL |
| **Sweater Comb** | optic-typescript | TypeScript | CLI, CI | OpenAPI 3.0/3.1 |
| **Speakeasy** | speakeasy-yaml | Go | CLI, CI, TypeScript SDK | OpenAPI 3.0/3.1 |
| **Postman API Governance** | postman-governance | Proprietary | Web UI, CI, Postman CLI | OpenAPI 2.0/3.0/3.1 |
| **Stoplight Studio** | spectral-yaml | JavaScript | Desktop IDE, Web IDE, Git | OpenAPI 2.0/3.0/3.1, JSON Schema |
| **APIMetrics** | apimetrics-yaml | Proprietary | SaaS, API | JSON Schema, OpenAPI 3.0/3.1 |

Each entry's full `apis.yml` record lists documentation, GitHub
repository, NPM/Go/Maven package, license, ruleset/registry URLs, and
relevant marketplace listings.

## Approach Comparison — Declarative vs Custom-Function vs LLM-Based

**Declarative (Spectral, Vacuum, Redocly, Postman).** A rule is a
selector plus an assertion. The grammar is small — JSONPath
expressions, a fixed library of functions (`truthy`, `pattern`,
`enumeration`, `length`, `casing`, `schema`...), and a severity. The
result is rulesets that are diffable, shareable across tools (Vacuum
runs Spectral rulesets verbatim), and approachable by anyone who can
read YAML. The ceiling is the JSONPath dialect — anything requiring
state across nodes, comparison between operations, or cross-document
reasoning either becomes a built-in function or doesn't get written.

**Custom-function (Optic, sweater-comb).** Every rule is a TypeScript
module that receives a typed FactsContext and throws on violation.
You give up the declarative diff but gain (a) IDE-level confidence in
the rule itself, (b) the ability to reason about an entire OpenAPI
diff rather than a single node, and (c) easy access to external state.
This is the model that scales when a "design rule" actually means
"design rule plus history plus exception list." Snyk's sweater-comb
is the canonical example.

**Generator-aware (Speakeasy).** The linter exists to keep the spec
generator-ready. The `speakeasy-generation` profile is non-negotiable;
everything else is configurable through `lint.yaml`. This is a
specialized case of the declarative model with an opinionated baseline.

**LLM-based.** No tool in this catalog ships LLM-as-judge as its
primary mechanism yet. LLM-based linting shows up today as
(a) heuristic suggestions inside design IDEs (Stoplight, Postman) and
(b) ad-hoc evaluators in CI built on top of Anthropic/OpenAI APIs.
The interesting open question for 2026 is whether a generative model
should *propose* rules from a corpus of well-designed APIs, with the
declarative engines remaining the enforcement layer. The catalog will
add entries as production-grade tools materialize.

## Artifacts

| Type | File | Purpose |
|------|------|---------|
| JSON Schema | [json-schema/linting-rule-schema.json](json-schema/linting-rule-schema.json) | Normalized schema for a single linting rule, tool-independent. |
| JSON Structure | [json-structure/linting-rule-structure.json](json-structure/linting-rule-structure.json) | Structural companion to the schema. |
| JSON-LD Context | [json-ld/linting-context.jsonld](json-ld/linting-context.jsonld) | Linked-data context aligning linting terms with schema.org and a project `lint:` vocabulary. |
| Vocabulary | [vocabulary/linting-vocabulary.yml](vocabulary/linting-vocabulary.yml) | Working vocabulary — Linter, Ruleset, Rule, Given, Then, Severity, Function, Profile, Extends, Overrides, Alias, JSONPath, Violation, Style Guide, Breaking Change Rule, Configurable Rule, Custom Plugin, Content Rule, Runtime Validation. |
| Example — Spectral | [examples/spectral-openapi-ruleset-example.yaml](examples/spectral-openapi-ruleset-example.yaml) | A ruleset extending `spectral:oas` with documentation, operation, path, schema, and tag rules. |
| Example — Vacuum | [examples/vacuum-owasp-ruleset-example.yaml](examples/vacuum-owasp-ruleset-example.yaml) | OWASP-aligned Vacuum ruleset demonstrating Vacuum's Spectral-compatible grammar. |
| Example — Redocly | [examples/redocly-cli-config-example.yaml](examples/redocly-cli-config-example.yaml) | A `redocly.yaml` extending `recommended` with both severity tuning and configurable rules (subject + assertions). |
| Example — Optic | [examples/optic-ruleset-example.ts](examples/optic-ruleset-example.ts) | A TypeScript Optic ruleset showing `OperationRule`, `RequestRule`, `ResponseRule` and the FactsContext pattern. |
| Example — Normalized | [examples/linting-rule-normalized-example.json](examples/linting-rule-normalized-example.json) | A single rule expressed against this repository's normalized schema (here: Spectral's `operation-operationId-unique`). |

## Related API Evangelist Repositories

- [`spotlight-rules`](https://github.com/api-evangelist/spotlight-rules) — Curated ruleset feed published alongside the rules collection.
- [`spectral`](https://github.com/api-evangelist/spectral) — Spectral provider profile.
- [`vacuum`](https://github.com/api-evangelist/vacuum) — Vacuum provider profile.
- [`redocly`](https://github.com/api-evangelist/redocly) — Redocly provider profile.
- [`optic`](https://github.com/api-evangelist/optic) — Optic provider profile.
- [`stoplight`](https://github.com/api-evangelist/stoplight) — Stoplight provider profile.

## Maintainer

**Kin Lane** — kin@apievangelist.com — [@kinlane](https://github.com/kinlane)
