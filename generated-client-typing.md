---
name: Generated client typing
description: A TypeScript library configuration detail for generated browser API clients.
---

Generated Orval client code can use `Headers.entries()`. In this workspace, the composite API client library must include both `dom` and `dom.iterable` in its TypeScript `lib` list for the generated declarations to typecheck.

**Why:** The shared TypeScript base targets `es2022` and does not include browser iterable definitions, so codegen can succeed while the chained library typecheck fails.

**How to apply:** If generated client code reports that `Headers.entries` is missing, check the client library `tsconfig.json` before changing generated files.