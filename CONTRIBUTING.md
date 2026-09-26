# Contributing to SustainRank

Thank you for considering contributing! This project is open source under the MIT License and welcomes contributions of all kinds — bug fixes, new features, documentation improvements, or design tweaks.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Request Checklist](#pull-request-checklist)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

Be respectful and constructive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

---

## Getting Started

1. **Fork** the repository and clone your fork.
2. Follow the setup instructions in [README.md](./README.md) to run the project locally.
3. Create a new branch for your change (see [Branch Naming](#branch-naming)).

---

## How to Contribute

### Bug fixes & small improvements
Open a PR directly. Reference the issue number if one exists.

### New features
Open an **issue first** to discuss the idea before writing code. This avoids duplicate effort and ensures the feature aligns with the project direction.

### Documentation
Always welcome — no issue needed.

---

## Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/<short-description>` | `feat/dark-mode-toggle` |
| Bug fix | `fix/<short-description>` | `fix/login-403-error` |
| Docs | `docs/<short-description>` | `docs/update-setup-guide` |
| Refactor | `refactor/<short-description>` | `refactor/dashboard-components` |

---

## Commit Messages

Use the **Conventional Commits** format:

```
<type>(<scope>): <short summary>

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(dashboard): add dark/light mode toggle
fix(auth): handle expired JWT gracefully
docs(readme): add production deployment section
```

---

## Pull Request Checklist

Before submitting a PR, make sure:

- [ ] The app runs locally without errors
- [ ] Frontend: `npm run lint` passes in the `frontend/` directory
- [ ] Backend: `mvn compile` succeeds in the `backend/` directory
- [ ] No secrets, credentials, or `application.properties` committed
- [ ] PR description explains **what** changed and **why**
- [ ] Screenshots attached for any UI changes

---

## Reporting Bugs

Open a GitHub Issue with:
- Steps to reproduce
- Expected vs actual behaviour
- Browser / OS / Java version
- Relevant console errors or logs

---

## Suggesting Features

Open a GitHub Issue with the `enhancement` label and describe:
- The problem you're solving
- Your proposed solution
- Any alternatives you considered
