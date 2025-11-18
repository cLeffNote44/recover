# Contributing to Recovery Journey

> Thank you for your interest in contributing! This guide will help you get started.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
3. [Development Setup](#development-setup)
4. [Development Workflow](#development-workflow)
5. [Coding Standards](#coding-standards)
6. [Commit Guidelines](#commit-guidelines)
7. [Pull Request Process](#pull-request-process)
8. [Feature Requests](#feature-requests)
9. [Bug Reports](#bug-reports)
10. [Community](#community)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and supportive environment for all contributors, regardless of background, identity, or experience level. This project supports people in recovery, and we maintain a respectful, compassionate community.

### Standards

**Expected behavior:**
- Use welcoming and inclusive language
- Respect differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy toward others

**Unacceptable behavior:**
- Harassment, discrimination, or hate speech
- Trolling or inflammatory comments
- Personal attacks
- Publishing others' private information
- Unprofessional conduct

### Enforcement

Violations can be reported to conduct@recoveryjourney.app. All reports will be reviewed and investigated, resulting in appropriate action.

---

## How Can I Contribute?

### Types of Contributions

**Code Contributions:**
- Fix bugs
- Add new features
- Improve performance
- Enhance accessibility
- Write tests

**Documentation:**
- Improve README
- Add code comments
- Write tutorials
- Translate documentation

**Design:**
- UI/UX improvements
- Iconography
- Illustrations
- Accessibility audits

**Community:**
- Answer questions in Discussions
- Help other contributors
- Share your recovery journey (optional)
- Provide feedback on features

### Good First Issues

Look for issues labeled:
- `good first issue` - Perfect for newcomers
- `help wanted` - We need assistance
- `documentation` - Improve docs
- `bug` - Fix broken functionality

---

## Development Setup

### Prerequisites

**Required:**
- Node.js 18+
- pnpm 10.4.1+
- Git
- Code editor (VS Code recommended)

**Recommended VS Code Extensions:**
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Error Lens

### Fork and Clone

1. **Fork the repository** on GitHub

2. **Clone your fork:**
```bash
git clone https://github.com/YOUR_USERNAME/recovery-journey.git
cd recovery-journey
```

3. **Add upstream remote:**
```bash
git remote add upstream https://github.com/original-repo/recovery-journey.git
```

### Install Dependencies

```bash
cd source
pnpm install
```

### Start Development Server

```bash
pnpm dev
```

App will be available at `http://localhost:5173`

### Verify Setup

```bash
# Type check
pnpm typecheck

# Lint
pnpm lint

# Build
pnpm build
```

---

## Development Workflow

### 1. Create a Branch

```bash
# Update main
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or bug fix branch
git checkout -b fix/bug-description
```

### 2. Make Changes

- Write code following our [standards](#coding-standards)
- Test your changes thoroughly
- Add tests if applicable
- Update documentation

### 3. Commit Changes

```bash
# Stage changes
git add .

# Commit with meaningful message
git commit -m "feat: add dual counter widget to home screen"
```

See [Commit Guidelines](#commit-guidelines) for format.

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request

- Go to GitHub
- Click "New Pull Request"
- Fill out PR template
- Link related issues
- Request review

---

## Coding Standards

### TypeScript

**Use TypeScript for all new code:**

```typescript
// Good ✅
interface UserProfile {
  name: string;
  sobrietyDate: string;
}

function getUserDaysSober(profile: UserProfile): number {
  return calculateDaysSober(profile.sobrietyDate);
}

// Bad ❌
function getUserDaysSober(profile) {
  return calculateDaysSober(profile.sobrietyDate);
}
```

**Enable strict mode:**
- No implicit any
- Null checks required
- All types must be defined

### React Components

**Functional components with hooks:**

```typescript
// Good ✅
export function CheckInCard({ date, mood }: CheckInCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card onClick={() => setIsExpanded(!isExpanded)}>
      {/* content */}
    </Card>
  );
}

// Bad ❌
class CheckInCard extends React.Component {
  // Class components discouraged
}
```

**Props interface above component:**

```typescript
interface CheckInCardProps {
  date: string;
  mood?: number;
  notes?: string;
  onDelete?: () => void;
}

export function CheckInCard({ date, mood, notes, onDelete }: CheckInCardProps) {
  // component
}
```

### File Organization

**File naming:**
- Components: `PascalCase.tsx` (e.g., `HomeScreen.tsx`)
- Utilities: `camelCase.ts` (e.g., `utils-app.ts`)
- Types: `camelCase.ts` or `PascalCase.ts` (e.g., `app.ts`)

**Component structure:**

```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { calculateDaysSober } from '@/lib/utils-app';

// 2. Types/Interfaces
interface Props {
  date: string;
}

// 3. Component
export function Component({ date }: Props) {
  // Hooks
  const [state, setState] = useState();

  // Computations
  const days = calculateDaysSober(date);

  // Handlers
  const handleClick = () => {
    // ...
  };

  // Render
  return <div onClick={handleClick}>{days}</div>;
}
```

### CSS/Styling

**Use Tailwind CSS utility classes:**

```tsx
// Good ✅
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow">

// Acceptable for complex styles
<div className="custom-class">
```

**Avoid inline styles unless dynamic:**

```tsx
// Avoid ❌
<div style={{ padding: '24px' }}>

// OK for dynamic values ✅
<div style={{ width: `${progress}%` }}>
```

### Accessibility

**Always include:**
- Semantic HTML
- ARIA labels when needed
- Keyboard navigation
- Focus indicators
- Alt text for images

```tsx
// Good ✅
<button
  onClick={handleClick}
  aria-label="Complete daily check-in"
  className="focus:ring-2"
>
  Check In
</button>

// Bad ❌
<div onClick={handleClick}>Check In</div>
```

### Performance

**Memoize expensive calculations:**

```typescript
const daysSober = useMemo(
  () => calculateDaysSober(sobrietyDate),
  [sobrietyDate]
);
```

**Lazy load heavy components:**

```typescript
const AnalyticsScreen = lazy(() => import('./screens/AnalyticsScreen'));
```

### Comments

**Comment complex logic:**

```typescript
// Calculate recovery milestones based on days sober
// Milestones: 7, 30, 60, 90, 180, 365 days
function getMilestone(days: number): Milestone {
  // Implementation
}
```

**Use JSDoc for public APIs:**

```typescript
/**
 * Calculates the number of days between sobriety date and today
 * @param sobrietyDate - ISO date string (YYYY-MM-DD)
 * @returns Number of days sober
 */
export function calculateDaysSober(sobrietyDate: string): number {
  // Implementation
}
```

---

## Commit Guidelines

### Conventional Commits

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

**Format:**
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `build:` Build system changes
- `ci:` CI configuration changes
- `chore:` Other changes (dependencies, etc.)

### Examples

```bash
# Feature
git commit -m "feat: add dual counter system to home screen"

# Bug fix
git commit -m "fix: correct streak calculation for consecutive days"

# Documentation
git commit -m "docs: update README with new features"

# With scope
git commit -m "feat(analytics): add mood trend visualization"

# Breaking change
git commit -m "feat!: change check-in data structure

BREAKING CHANGE: CheckIn interface now requires 'halt' property"
```

### Commit Message Guidelines

**Good commits:**
- Start with lowercase
- Use imperative mood ("add" not "added")
- No period at end
- Concise but descriptive

**Examples:**

```bash
# Good ✅
git commit -m "feat: add meditation timer with sound options"
git commit -m "fix: prevent duplicate check-ins on same day"
git commit -m "refactor: extract badge logic to separate file"

# Bad ❌
git commit -m "Added stuff"
git commit -m "Fixed bug."
git commit -m "WIP"
```

---

## Pull Request Process

### Before Submitting

**Checklist:**
- [ ] Code follows style guidelines
- [ ] All tests pass (`pnpm test`)
- [ ] TypeScript compiles (`pnpm typecheck`)
- [ ] No linter errors (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Documentation updated
- [ ] Commits follow guidelines
- [ ] Branch is up to date with main

### PR Template

When creating a PR, fill out this template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
How did you test? Screenshots?

## Checklist
- [ ] Code follows style guide
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated Checks**
   - Tests run automatically
   - Build verification
   - Type checking
   - Linting

2. **Code Review**
   - At least one approval required
   - Address feedback promptly
   - Push additional commits as needed

3. **Merge**
   - Squash and merge preferred
   - Delete branch after merge

---

## Feature Requests

### Before Requesting

**Check if it already exists:**
- Search existing issues
- Check discussions
- Review roadmap

### Submitting a Feature Request

1. **Go to GitHub Issues**
2. **Click "New Issue"**
3. **Select "Feature Request" template**
4. **Fill out:**
   - Clear, concise title
   - Detailed description
   - Use case / user story
   - Mockups (if applicable)
   - Expected behavior

**Example:**

```markdown
Title: Add voice journaling feature

Description:
Allow users to record voice journal entries instead of typing.

User Story:
As a user, I want to record my thoughts via voice so that I can journal more easily when I'm feeling emotional.

Mockups:
[Attach screenshots or designs]

Expected Behavior:
- Record button on journal screen
- Audio visualization while recording
- Playback capability
- Transcription (optional future enhancement)
```

---

## Bug Reports

### Before Reporting

**Verify it's a bug:**
- Can you reproduce it consistently?
- Does it happen in the latest version?
- Have you checked existing issues?

### Bug Report Template

```markdown
Title: Daily check-in not saving on iOS

Description:
When completing a daily check-in on iOS, the data doesn't persist after closing the app.

Steps to Reproduce:
1. Open app on iPhone (iOS 17.1)
2. Complete daily check-in
3. Close app completely
4. Reopen app
5. Check-in is missing

Expected Behavior:
Check-in should be saved and visible upon reopening.

Actual Behavior:
Check-in disappears after app restart.

Environment:
- Device: iPhone 14 Pro
- OS: iOS 17.1
- App Version: 1.0.0
- Browser (if web): N/A

Screenshots:
[Attach if helpful]

Additional Context:
Works fine on Android and web versions.
```

---

## Community

### Get Help

**Questions?**
- 💬 [GitHub Discussions](https://github.com/your-repo/discussions)
- 📧 Email: community@recoveryjourney.app
- 📖 Read the docs first!

### Communication Channels

**GitHub Discussions:**
- General questions
- Feature discussions
- Show and tell
- Recovery stories (optional)

**GitHub Issues:**
- Bug reports
- Feature requests
- Technical issues

**Email:**
- Private concerns
- Security issues
- Partnership inquiries

### Recognition

**Contributors Hall of Fame:**
We maintain a list of contributors in CONTRIBUTORS.md. Thank you for helping build Recovery Journey!

**Special Recognition:**
- First-time contributors
- Major feature contributors
- Bug bounty (coming soon)
- Community helpers

---

## Additional Resources

### Documentation
- [README](../README.md)
- [Features Guide](./FEATURES.md)
- [Roadmap](./ROADMAP.md)
- [Architecture](./ARCHITECTURE.md)
- [Deployment](./DEPLOYMENT.md)

### Learning Resources
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Capacitor Docs](https://capacitorjs.com/docs)

### Addiction Recovery Resources
If you're in recovery and building this app has been helpful or triggering, please reach out to:
- **SAMHSA National Helpline:** 1-800-662-4357
- **Crisis Text Line:** Text HOME to 741741

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

## Questions?

Don't hesitate to ask! We're here to help.

- Open a Discussion on GitHub
- Email: contribute@recoveryjourney.app

**Thank you for contributing to Recovery Journey!** 🙏

---

*Last updated: November 2025*
