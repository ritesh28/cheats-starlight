---
title: Semantic Versioning
description: Semantic Versioning
---

Given a version number **MAJOR.MINOR.PATCH**, increment the:

- MAJOR version when you make incompatible API changes
- MINOR version when you add functionality in a backward compatible manner
- PATCH version when you make backward compatible bug fixes
- Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH format.

```bash title="max-version-allowed.bash" wrap
"foo": "^1.1.1" // packages from 1.1.1 and less than 2.0.0 # up to next major version
"bar": "~1.1.1" // packages from 1.1.1 and less than 1.2 # up to next minor version
"bar": ">=1.2.0 <5.0.0" // packages from 1.2.0 and less than 5.0.0 # greater than or equal TO less than
```
