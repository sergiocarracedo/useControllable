# use-controllable

A React hook for managing both controlled and uncontrolled component states.

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

When `value` is not provided, the component manages its own state internally:

```tsx
import { useControllable } from 'use-controllable'

function MyComponent() {
  const [value, setValue] = useControllable({
    defaultValue: 'hello',
    onChange: (v) => console.log('Changed to:', v)
  })

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
```

### Controlled Mode

When `value` is provided, the component is controlled externally:

```tsx
import { useControllable } from 'use-controllable'

function MyComponent({ value, onChange }) {
  const [controlledValue, setControlledValue] = useControllable({
    value,
    onChange
  })

  return (
    <input
      value={controlledValue}
      onChange={(e) => setControlledValue(e.target.value)}
    />
  )
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
  defaultValue: 'hello'
})

// Type is explicitly set
const [value, setValue] = useControllable<number>({
  defaultValue: 42
})
```

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build

# Lint
pnpm lint

# Format
pnpm format
```

## License

MIT
