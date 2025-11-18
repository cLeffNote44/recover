# Contributing to Recovery Journey

Thank you for your interest in contributing to Recovery Journey! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Project Structure](#project-structure)
5. [Coding Standards](#coding-standards)
6. [Testing](#testing)
7. [Pull Request Process](#pull-request-process)
8. [Feature Development](#feature-development)

---

## Code of Conduct

This project is focused on helping people in recovery. Please be respectful, empathetic, and professional in all interactions.

### Our Pledge

- **Be respectful** of differing viewpoints and experiences
- **Be empathetic** to users' recovery journeys
- **Protect privacy** - never log or track user data
- **Focus on wellbeing** - prioritize user mental health

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm 9+
- **Git** for version control
- **Code editor** (VS Code recommended)
- **(Optional)** Xcode for iOS, Android Studio for Android

### First Contribution

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a branch** for your feature
4. **Make changes** and commit
5. **Push** to your fork
6. **Create a Pull Request**

---

## Development Setup

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/your-username/recovery-journey.git
cd recovery-journey/source

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

No environment variables required! The app is fully local and privacy-first.

### IDE Setup (VS Code)

Recommended extensions:
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript Vue Plugin** - TS support
- **Tailwind CSS IntelliSense** - CSS autocomplete

`.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## Project Structure

```
source/
├── src/
│   ├── components/          # React components
│   │   ├── animated/       # Reusable animation components
│   │   ├── app/            # App-specific components
│   │   │   └── screens/    # Full-screen views
│   │   ├── charts/         # Chart components (Recharts)
│   │   └── ui/             # UI primitives (Radix UI)
│   ├── contexts/           # React Context providers
│   ├── lib/                # Utilities and helpers
│   ├── pages/              # Route-level page components
│   ├── types/              # TypeScript type definitions
│   └── test/               # Test utilities and setup
├── public/                 # Static assets
└── dist/                   # Build output (gitignored)
```

### Key Files

- `App.tsx` - Root component, routing
- `contexts/AppContext.tsx` - Main application state
- `types/app.ts` - TypeScript interfaces
- `lib/utils-app.ts` - Core utility functions
- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript configuration

---

## Coding Standards

### TypeScript

- **Strict mode enabled** - No implicit any
- **Explicit types** for function parameters and returns
- **Interfaces over types** for objects
- **Avoid `any`** - use `unknown` if type is unclear

```typescript
// ✅ Good
interface User {
  name: string;
  age: number;
}

function greet(user: User): string {
  return `Hello, ${user.name}`;
}

// ❌ Bad
function greet(user: any) {
  return `Hello, ${user.name}`;
}
```

### React

- **Functional components** with hooks
- **Named exports** for components
- **Props interfaces** for all components
- **Hooks at top level** - follow Rules of Hooks

```typescript
// ✅ Good
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick} className={variant}>{children}</button>;
}

// ❌ Bad
export default ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);
```

### Styling

- **Tailwind CSS** utility classes
- **No inline styles** unless dynamic
- **Responsive** design (mobile-first)
- **Dark mode** support with CSS variables

```tsx
// ✅ Good
<div className="flex items-center gap-2 p-4 bg-background text-foreground">

// ❌ Bad
<div style={{display: 'flex', padding: '16px'}}>
```

### File Naming

- **Components**: PascalCase (`HomeScreen.tsx`)
- **Utilities**: kebab-case (`utils-app.ts`)
- **Tests**: Same name with `.test` suffix (`utils-app.test.ts`)
- **Types**: kebab-case (`app.ts` in `types/`)

---

## Testing

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui
```

### Writing Tests

#### Unit Tests

Test utility functions and business logic:

```typescript
// src/lib/utils-app.test.ts
import { describe, it, expect } from 'vitest';
import { calculateDaysSober } from './utils-app';

describe('calculateDaysSober', () => {
  it('should calculate days correctly', () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    expect(calculateDaysSober(date.toISOString())).toBe(30);
  });
});
```

#### Component Tests

Test UI components and user interactions:

```typescript
// src/components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Test Coverage

- **Target**: 60%+ coverage for critical paths
- **Priority**: Core features (sobriety tracking, check-ins, goals)
- **Focus**: Business logic over UI components

---

## Pull Request Process

### Before Submitting

1. **Test locally** - Ensure all tests pass
2. **Type check** - Run `npm run check`
3. **Format code** - Run `npm run format`
4. **Update docs** - If API changes
5. **Add tests** - For new features

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manually tested on web
- [ ] Tested on iOS (if applicable)
- [ ] Tested on Android (if applicable)

## Screenshots (if applicable)
Add screenshots of UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally
```

### Review Process

1. **Automated checks** run (TypeScript, tests)
2. **Code review** by maintainer
3. **Feedback addressed** by contributor
4. **Approval** and merge

---

## Feature Development

### Planning a Feature

1. **Check roadmap** - See `IMPROVEMENT_ROADMAP.md`
2. **Open an issue** - Discuss the feature
3. **Get feedback** - Wait for maintainer input
4. **Create branch** - `feature/your-feature-name`

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 3. Push to fork
git push origin feature/new-feature

# 4. Create Pull Request
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add weekly goal tracking
fix: correct streak calculation bug
docs: update API documentation
refactor: simplify badge unlock logic
```

### Adding a New Screen

1. Create component in `src/components/app/screens/`
2. Add route in `App.tsx`
3. Add navigation item in `BottomNav.tsx`
4. Add to TypeScript types if needed
5. Update documentation

Example:
```typescript
// src/components/app/screens/NewScreen.tsx
import { PageTransition } from '@/components/animated/PageTransition';

export function NewScreen() {
  return (
    <PageTransition className="space-y-6 pb-20">
      <h1>New Feature</h1>
      {/* Your content */}
    </PageTransition>
  );
}
```

### Adding a New Utility Function

1. Add function to appropriate file in `src/lib/`
2. Export function
3. Add TypeScript types
4. Write unit tests
5. Document in `API_DOCUMENTATION.md`

---

## Privacy & Security

### Guidelines

1. **Never log user data** to console or analytics
2. **No external requests** without user consent
3. **Encrypt exports** if containing sensitive data
4. **No tracking pixels** or analytics scripts
5. **Review dependencies** for privacy implications

### Data Handling

```typescript
// ✅ Good - Local only
localStorage.setItem('userData', JSON.stringify(data));

// ❌ Bad - Sends data externally
fetch('https://api.example.com/track', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

---

## Mobile Development

### Testing on iOS

```bash
# Build and sync
npm run build:mobile

# Open in Xcode
npm run cap:open:ios

# Run on simulator
npm run cap:run:ios
```

### Testing on Android

```bash
# Build and sync
npm run build:mobile

# Open in Android Studio
npm run cap:open:android

# Run on emulator
npm run cap:run:android
```

### Native Features

When adding Capacitor plugins:
1. Install plugin: `npm install @capacitor/plugin-name`
2. Sync to native: `npm run cap:sync`
3. Add fallbacks for web
4. Test on all platforms

---

## Questions?

- **Issues**: Open a GitHub issue
- **Discussions**: Use GitHub Discussions
- **Email**: (if provided)

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Recovery Journey! Your work helps people in their recovery journey. 💙
