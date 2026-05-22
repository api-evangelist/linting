// Example Optic ruleset — illustrates Optic's TypeScript ruleset model:
// type-safe FactsContexts (`OperationRule`, `RequestRule`, `ResponseRule`),
// inline assertions, and `severity` per rule. Snyk's `sweater-comb` extends
// this same surface for its API design standards.
//
// Source: https://github.com/opticdev/optic/blob/main/docs/ruleset-authoring.md
// License: MIT
//
// Usage: import in `optic.config.ts` and pass via the `ruleset` field.

import {
  OperationRule,
  RequestRule,
  ResponseRule,
  Ruleset,
} from '@useoptic/rulesets-base';

const requireOperationIds = new OperationRule({
  name: 'require-operation-ids',
  rule: (operationAssertions) => {
    operationAssertions.requirement(
      'must have an operationId',
      (operation) => {
        if (!operation.value.operationId) {
          throw new Error(
            `operation ${operation.method.toUpperCase()} ${operation.path} is missing an operationId`,
          );
        }
      },
    );
  },
});

const requestBodiesUseApplicationJson = new RequestRule({
  name: 'request-bodies-application-json',
  rule: (requestAssertions) => {
    requestAssertions.body.requirement(
      'must be application/json',
      (body) => {
        if (body.contentType !== 'application/json') {
          throw new Error(
            `request body must use application/json (got ${body.contentType})`,
          );
        }
      },
    );
  },
});

const successResponsesIncludeContentType = new ResponseRule({
  name: 'success-responses-include-content-type',
  matches: (response) => /^2\d\d$/.test(response.statusCode),
  rule: (responseAssertions) => {
    responseAssertions.requirement(
      'must declare a content type',
      (response) => {
        const contentTypes = Object.keys(response.value.content ?? {});
        if (contentTypes.length === 0) {
          throw new Error(
            `2xx response ${response.statusCode} declares no content types`,
          );
        }
      },
    );
  },
});

export const apiEvangelistRuleset = new Ruleset({
  name: 'api-evangelist-baseline',
  docsLink: 'https://api-evangelist.github.io/linting/',
  rules: [
    requireOperationIds,
    requestBodiesUseApplicationJson,
    successResponsesIncludeContentType,
  ],
});

export default apiEvangelistRuleset;
