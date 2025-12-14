# Contributing to use-controllable

Thank you for your interest in contributing! Here's how to get started.

## Development Setup

1. **Install pnpm** (if not already installed):

   ```bash
   npm install -g pnpm@latest
   ```

2. **Clone and install dependencies**:

   ```bash
   git clone <repository-url>
   cd useControllable
   pnpm install
   ```

3. **Install git hooks**:
   ```bash
   npx lefthook install
   ```

## Development Workflow

### Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test run

# Run tests with UI
pnpm test:ui
```

### Type Checking

```bash
pnpm typecheck
```

### Linting

```bash
# Run linter
pnpm lint

# Linter runs automatically on pre-commit
```

### Formatting

```bash
# Format all files
pnpm format

# Check formatting
pnpm format:check

# Formatting runs automatically on pre-commit
```

### Building

```bash
pnpm build
```

## Code Standards

### TypeScript

- Use strict TypeScript configuration
- Provide proper type annotations
- No `any` types unless absolutely necessary
- Export types alongside functions

### Code Style

- **No semicolons** - enforced by OXC formatter
- **Single quotes** - for strings (except JSX attributes)
- **2 spaces** - for indentation
- **Trailing commas** - always use them

### Testing

- Write tests for all new features
- Maintain test coverage above 80%
- Test both controlled and uncontrolled modes
- Test edge cases and error scenarios

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body

footer
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat: add support for custom equality function
fix: prevent infinite loop in controlled mode
docs: update README with new examples
test: add tests for edge cases
```

Commit messages are validated by commitlint on commit.

## Pull Request Process

1. **Create a feature branch**:

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** following the code standards

3. **Test your changes**:

   ```bash
   pnpm test run
   pnpm typecheck
   pnpm lint
   pnpm build
   ```

4. **Commit with conventional commits**:

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push and create a PR**:
   ```bash
   git push origin feat/your-feature-name
   ```

## Pre-commit Hooks

Lefthook automatically runs these checks before each commit:

- ✅ TypeScript type checking
- ✅ OXC linting on staged files
- ✅ Commit message validation

If any check fails, the commit will be rejected. Fix the issues and try again.

## Project Structure

```
useControllable/
├── .github/              # GitHub Actions workflows
├── .vscode/              # VSCode settings and tasks
├── examples/              # VSCode settings and tasks
├── src/
│   ├── index.ts           # Main hook implementation
│   │   └── setup.ts       # Test setup
│   └── useControllable.ts # Te hook and the types
│   ├── __test__/
│   └──useControllable.test.tsx  # Tests
├── test/
├── dist/                 # Build output (generated)
├── package.json
├── tsconfig.json
├── vite.config.ts        # Vite build configuration
├── vitest.config.ts      # Vitest test configuration
├── .oxlintrc.json        # OXC linter configuration
├── .oxfmtrc.json         # OXC formatter configuration
├── lefthook.yml          # Git hooks configuration
└── commitlint.config.js  # Commit message linting
```

## Questions?

Feel free to open an issue for any questions or concerns!
