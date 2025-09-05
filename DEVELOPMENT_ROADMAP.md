# Development Roadmap

## Project Updates

### 2024-09-XX: Next.js and React Update

#### Completed Changes

- Updated Next.js from 15.0.0 to 15.3.1
- Updated React from 18.3.1 to 19.0.0
- Updated React DOM from 18.3.1 to 19.0.0
- Updated @types/react to ^19.2.3
- Updated eslint-config-next to 15.3.1
- Updated Next.js config to enable Turbo for improved build performance

#### Breaking Changes to Address

- React 19:
  - Deprecated `element.ref` access: Need to use `element.props.ref` instead
  - New JSX transform is required
- Next.js 15:
  - APIs like `cookies`, `headers`, and `params` are now asynchronous
  - By default, `fetch` requests, GET Route Handlers, and client navigations are no longer cached

#### New Features Available

- React 19:
  - React Compiler
  - Actions feature
  - New hooks: `useActionState`, `useFormStatus`, `useOptimistic`
- Next.js 15:
  - Stable release of Turbopack
  - Enhanced `<Form>` component
  - Improved codemod CLI for migration

## Pending Tasks

- Test the application with the updated dependencies
- Address any breaking changes in the codebase
- Consider implementing new features where applicable
