import { render } from '@testing-library/react'
import { useEffect, useState } from 'react'
import { bench, describe, vi } from 'vitest'
import { useControllable } from '../useControllable'

/**
 * Component WITHOUT useControllable hook (anti-pattern with state sync)
 * This represents the traditional approach with internal state + useEffect sync
 */
interface WithoutHookProps {
  value?: string
  onChange?: (value: string) => void
  defaultValue?: string
}

function ComponentWithoutHook({ value, onChange, defaultValue }: WithoutHookProps) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')

  // Anti-pattern: Sync internal state with controlled value
  useEffect(() => {
    if (isControlled && value !== internalValue) {
      setInternalValue(value)
    }
  }, [value, isControlled, internalValue])

  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  const currentValue = isControlled ? value : internalValue

  return (
    <input
      value={currentValue}
      onChange={(e) => handleChange(e.target.value)}
      data-testid="input-without-hook"
    />
  )
}

/**
 * Component WITH useControllable hook (optimal pattern)
 */
interface WithHookProps {
  value?: string
  onChange?: (value: string) => void
  defaultValue?: string
}

function ComponentWithHook({ value, onChange, defaultValue }: WithHookProps) {
  const [currentValue, setValue] = useControllable({
    value,
    defaultValue,
    onChange,
  })

  return (
    <input
      value={currentValue}
      onChange={(e) => setValue(e.target.value)}
      data-testid="input-with-hook"
    />
  )
}

describe('useControllable performance benchmarks', () => {
  describe('Controlled mode - render performance', () => {
    bench('without hook (with useEffect sync)', () => {
      const onChange = vi.fn()
      render(<ComponentWithoutHook value="test" onChange={onChange} />)
    })

    bench('with useControllable hook', () => {
      const onChange = vi.fn()
      render(<ComponentWithHook value="test" onChange={onChange} />)
    })
  })

  describe('Controlled mode - re-render performance when value changes', () => {
    bench('without hook (with useEffect sync)', () => {
      const onChange = vi.fn()
      const { rerender } = render(<ComponentWithoutHook value="initial" onChange={onChange} />)

      // Simulate 100 value changes
      for (let i = 0; i < 100; i++) {
        rerender(<ComponentWithoutHook value={`value-${i}`} onChange={onChange} />)
      }
    })

    bench('with useControllable hook', () => {
      const onChange = vi.fn()
      const { rerender } = render(<ComponentWithHook value="initial" onChange={onChange} />)

      // Simulate 100 value changes
      for (let i = 0; i < 100; i++) {
        rerender(<ComponentWithHook value={`value-${i}`} onChange={onChange} />)
      }
    })
  })

  describe('Uncontrolled mode - render performance', () => {
    bench('without hook', () => {
      const onChange = vi.fn()
      render(<ComponentWithoutHook defaultValue="test" onChange={onChange} />)
    })

    bench('with useControllable hook', () => {
      const onChange = vi.fn()
      render(<ComponentWithHook defaultValue="test" onChange={onChange} />)
    })
  })

  describe('Controlled mode - state update performance', () => {
    bench('without hook (with useEffect sync)', () => {
      const onChange = vi.fn()
      const { getByTestId } = render(<ComponentWithoutHook value="test" onChange={onChange} />)
      const input = getByTestId('input-without-hook') as HTMLInputElement

      // Simulate 100 user interactions
      for (let i = 0; i < 100; i++) {
        input.value = `new-value-${i}`
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    bench('with useControllable hook', () => {
      const onChange = vi.fn()
      const { getByTestId } = render(<ComponentWithHook value="test" onChange={onChange} />)
      const input = getByTestId('input-with-hook') as HTMLInputElement

      // Simulate 100 user interactions
      for (let i = 0; i < 100; i++) {
        input.value = `new-value-${i}`
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })
  })

  describe('Memory efficiency - multiple component instances', () => {
    bench('without hook - 100 instances', () => {
      const onChange = vi.fn()
      const { container } = render(
        <>
          {Array.from({ length: 100 }).map((_, i) => (
            <ComponentWithoutHook key={i} value={`value-${i}`} onChange={onChange} />
          ))}
        </>,
      )
      container.remove()
    })

    bench('with useControllable hook - 100 instances', () => {
      const onChange = vi.fn()
      const { container } = render(
        <>
          {Array.from({ length: 100 }).map((_, i) => (
            <ComponentWithHook key={i} value={`value-${i}`} onChange={onChange} />
          ))}
        </>,
      )
      container.remove()
    })
  })
})
