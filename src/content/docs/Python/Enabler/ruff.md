---
title: Ruff - Formatter, Linter, & isort
---

- `ruff check path/to/code/` - Lint all files in `/path/to/code` (and any subdirectories).
- `ruff format path/to/code/` - Format all files in `/path/to/code` (and any subdirectories).

Ruff can be configured through a pyproject.toml, ruff.toml, or .ruff.toml

```toml title="ruff-config-setting.toml" wrap
[lint]
select = ["E4", "E7", "E9", "F", "B"] # Enable flake8-bugbear (`B`) rules, in addition to the defaults.
# By default, Ruff enables Flake8's F rules, along with a subset of the E rules, omitting any stylistic rules that overlap with the use of a formatter, like ruff format or Black.

extend-select = ["E501", "N", "R", "I"] # A list of 'rule codes or prefixes' to enable, in addition to those specified by 'select'.

ignore = ["F401"] # BE CAREFUL of what rules you are asking Ruff to ignore
```

### isort

When `isort` processes a Python file, it identifies import statements and categorizes them into groups separated by space:

- Future imports: `from __future__ import ...`
- Standard library imports: `import os`, `import sys`
- Third-party library imports: `import requests`, `import numpy`
- Local application/library specific imports: `from my_package import my_module`
