# use-controllable

A React hook for managing both controlled and uncontrolled component states.

If the parent provides the value and the onChange callback, the hook will use those to handle the component state, if not, the component creates an internal state to still working

## Table of Contents

- [Why Support Both Modes?](#why-support-both-modes)
- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
  - [Uncontrolled Mode](#uncontrolled-mode)
  - [Controlled Mode](#controlled-mode)
- [API](#api)
- [TypeScript](#typescript)
- [Using UseControllableProps Type](#using-usecontrollableprops-type)
  - [Custom Property Names](#custom-property-names)
  - [What UseControllableProps Does](#what-usecontrollableprops-does)
- [Running Examples](#running-examples)
- [Performance](#performance)
- [Development](#development)
- [License](#license)

## Why Support Both Modes?

Building components that support both controlled and uncontrolled modes in a single implementation is crucial for creating flexible, reusable components. Here's why this pattern matters:

### ⚡ Performance: Avoid Unnecessary Re-renders

When a component is controlled (receives `value` prop), `useControllable` **directly uses the controlled value** without creating internal state. This means:

- **No state synchronization**: The hook doesn't maintain a separate internal state when controlled
- **Fewer re-renders**: Changes to the controlled value don't trigger both internal state updates AND prop updates
- **Single source of truth**: The value flows directly from props to the component

**Without this pattern:**

```tsx
// ❌ Anti-pattern: Always using internal state
function BadComponent({ value, onChange }) {
  const [internalValue, setInternalValue] = useState(value);

  // Need to sync internal state with prop changes
  useEffect(() => {
    setInternalValue(value); // Extra re-render!
  }, [value]);

  // ... causes multiple onChange calls and state conflicts
}
```

**With `useControllable`:**

```tsx
// ✅ Optimal: Direct value usage when controlled
function GoodComponent({ value, onChange }) {
  const [currentValue, setValue] = useControllable({ value, onChange });
  // When controlled: currentValue === value (no internal state)
  // When uncontrolled: currentValue is managed internally
}
```

### 🔄 Avoid Multiple `onChange` Calls

Improper state synchronization can lead to onChange being called multiple times for a single user action:

- User changes input → triggers `setValue` → updates internal state → syncs with prop → triggers `onChange` again
- This creates confusing behavior and potential infinite loops

`useControllable` ensures `onChange` is called **exactly once** per value change.

### 🧹 Code Simplification

Without this hook, you'd need to:

1. Check if the component is controlled or uncontrolled
2. Manage conditional state creation
3. Handle state synchronization with `useEffect`
4. Prevent the component from switching between modes
5. Handle edge cases and race conditions

`useControllable` handles all of this in **one line**, making your component code cleaner and less error-prone.

### 🎯 Single Component, Multiple Use Cases

Users of your component can choose what works best for their needs:

- **Controlled**: Full control over state, useful for forms, validation, external state management
- **Uncontrolled**: Simpler usage for basic cases, less boilerplate

Same component, zero code duplication.

## Installation

```bash
npm install use-controllable
# or
pnpm add use-controllable
# or
yarn add use-controllable
```

## Features

- 🎯 **Flexible**: Works in both controlled and uncontrolled modes
- 🪶 **Lightweight**: Minimal bundle size (~0.3KB gzipped)
- 📘 **TypeScript**: Full TypeScript support with type inference
- ⚛️ **React 18 & 19**: Compatible with React 18 and 19
- 🧪 **Well-tested**: Comprehensive test coverage

## Usage

### Uncontrolled Mode

When `value` is not provided, the component manages its own state internally.

You can provide `defaultValue` to set the initial value in the uncontrolled state

```tsx
import { useControllable } from "use-controllable";

function MyComponent() {
  const [value, setValue] = useControllable({
    defaultValue: "hello",
    onChange: (v) => console.log("Changed to:", v),
  });

  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

### Controlled Mode

When `value` is provided, the component is controlled externally:

```tsx
import { useControllable } from "use-controllable";

function MyComponent({ value, onChange }) {
  const [controlledValue, setControlledValue] = useControllable({
    value,
    onChange,
  });

  return (
    <input
      value={controlledValue}
      onChange={(e) => setControlledValue(e.target.value)}
    />
  );
}
```

## API

### `useControllable<T>(params)`

#### Parameters

- `params.value?: T` - The controlled value (optional). When provided, the hook operates in controlled mode.
- `params.defaultValue?: T` - The default value for uncontrolled mode. Only used when `value` is not provided.
- `params.onChange?: (value: T) => void` - Callback function called when the value changes.

#### Returns

Returns a tuple `[value, setValue]` similar to `useState`:

- `value: T | undefined` - The current value
- `setValue: (value: T) => void` - Function to update the value

## TypeScript

The hook is fully typed and will infer types from your usage:

```tsx
// Type is inferred as string
const [value, setValue] = useControllable({
  defaultValue: "hello",
});

// Type is explicitly set
const [value, setValue] = useControllable<number>({
  defaultValue: 42,
});
```

## Using `UseControllableProps` Type

To type the parent component props in a correct way you can use the the `UseControllableProps` type helper to ensure your component props correctly support both controlled and uncontrolled modes bu not both at the same time:

```tsx
import { useControllable, type UseControllableProps } from 'use-controllable'

// Example 1: Standard value/onChange pattern
type MyComponentProps = UseControllableProps<string> & {
  placeholder?: string
}

function MyComponent(props: MyComponentProps) {
  const [value, setValue] = useControllable({
    value: props.value,
    defaultValue: props.defaultValue,
    onChange: props.onChange,
  })

  return <input value={value} onChange={(e) => setValue(e.target.value)} />
}

// Usage - Controlled
<MyComponent value={externalValue} onChange={setExternalValue} />

// Usage - Uncontrolled
<MyComponent defaultValue="initial" />
```

### Custom Property Names

You can also customize the property name from `value` , `onChange` and `default` to something else:

```tsx
// Example 2: Custom property name (e.g., 'checked' for a checkbox)
type ToggleProps = UseControllableProps<boolean, 'checked'> & {
  label?: string
}

function Toggle(props: ToggleProps) {
  const [checked, setChecked] = useControllable({
    value: props.checked,
    defaultValue: props.defaultChecked,
    onChange: props.onChangeChecked,
  })

  return (
    <button onClick={() => setChecked(!checked)}>
      {props.label} {checked ? '✓' : '○'}
    </button>
  )
}

// Usage - Controlled
<Toggle checked={isChecked} onChangeChecked={setIsChecked} />

// Usage - Uncontrolled
<Toggle defaultChecked={false} />
```

### What `UseControllableProps` Does

The type ensures:

- **Controlled mode**: When `value` is provided, `onChange` is available but `defaultValue` is not
- **Uncontrolled mode**: When `value` is not provided, `defaultValue` is available but `onChange` is not
- Type safety prevents mixing controlled and uncontrolled props incorrectly

## Running Examples

The repository includes interactive examples demonstrating various use cases:

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Then open your browser to the URL shown (typically `http://localhost:5173`).

The examples include:

- **Uncontrolled Input**: Component managing its own state
- **Controlled Input**: Component controlled by parent state
- **Toggle Component**: Custom component with boolean state
- **Flexible Component**: Demonstrates switching between controlled/uncontrolled modes

## Performance

The hook is designed for optimal performance. Benchmarks comparing `useControllable` against the traditional approach (internal state + `useEffect` synchronization) show significant improvements:

- **Fewer re-renders**: No extra re-renders from state synchronization in controlled mode
- **No useEffect overhead**: Direct value usage eliminates sync logic
- **Memory efficient**: Single state source instead of maintaining both internal state and watching props

Run the benchmarks yourself:

```bash
pnpm bench
```

The benchmark tests compare:

- Component **without** `useControllable` (uses internal state + `useEffect` to sync with controlled value)
- Component **with** `useControllable` (optimal implementation)

Scenarios tested:

- Initial render performance
- Re-render performance with value changes
- State update performance
- Memory efficiency with multiple instances

### Benchmark Results

Real-world performance comparison on a typical development machine:

| Scenario                                       | Without Hook  | With useControllable | Performance Gain      |
| ---------------------------------------------- | ------------- | -------------------- | --------------------- |
| **Controlled mode - Initial render**           | 1,167 ops/sec | 1,631 ops/sec        | **1.40x faster** ⚡   |
| **Controlled mode - Re-renders (100 updates)** | 40 ops/sec    | 87 ops/sec           | **2.14x faster** ⚡⚡ |
| **Uncontrolled mode - Initial render**         | 2,007 ops/sec | 1,981 ops/sec        | ~1.01x (equivalent)   |
| **Multiple instances (100 components)**        | 62 ops/sec    | 94 ops/sec           | **1.51x faster** ⚡   |

**Key Takeaways:**

- ⚡ **2.14x faster** re-renders in controlled mode - the most common use case
- ⚡ **1.40x faster** initial renders when controlled
- ⚡ **1.51x faster** when rendering multiple component instances
- 🟰 Equivalent performance in uncontrolled mode (no overhead added)

The performance gains are most significant in controlled components with frequent updates, exactly where traditional approaches with `useEffect` synchronization struggle the most.

## Development

```bash
# Install dependencies
pnpm install

# Run examples locally
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests in ui mode
pnpm test:ui

# Run benchmarks
pnpm bench

# Build
pnpm build

# Lint
pnpm lint

# Format
pnpm format

# Type check
pnpm typecheck
```

## License

MIT
