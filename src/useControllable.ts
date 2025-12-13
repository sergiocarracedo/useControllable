import { useCallback, useRef, useState } from 'react'

export type UseControllableStateParams<T> =
  | {
      value: T
      onChange: (value: T) => void
      defaultValue?: undefined
    }
  | {
      defaultValue?: T
      onChange?: undefined
      value?: undefined
    }

/**
 * A custom hook that manages both controlled and uncontrolled state.
 *
 * When `value` is provided, the component is controlled and state is managed externally.
 * When `value` is not provided, the component is uncontrolled and state is managed internally.
 *
 * @param params - Configuration object
 * @param params.value - The controlled value (optional)
 * @param params.defaultValue - The default value for uncontrolled mode
 * @param params.onChange - Callback function called when value changes
 * @returns A tuple of [value, setValue] similar to useState
 *
 * @example
 * ```tsx
 * // Uncontrolled usage
 * const [value, setValue] = useControllable({
 *   defaultValue: 'hello',
 *   onChange: (v) => console.log('Changed to:', v)
 * })
 *
 * // Controlled usage
 * const [value, setValue] = useControllable({
 *   value: externalValue,
 *   onChange: setExternalValue
 * })
 * ```
 */
export function useControllable<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateParams<T>): [T | undefined, (value: T) => void] {
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue)
  const isControlled = value !== undefined
  const onChangeRef = useRef(onChange)

  // Keep onChange ref up to date
  onChangeRef.current = onChange

  const setValue = useCallback(
    (nextValue: T) => {
      if (!isControlled) {
        setInternalValue(nextValue)
      }
      onChangeRef.current?.(nextValue)
    },
    [isControlled],
  )

  return [isControlled ? value : internalValue, setValue]
}
