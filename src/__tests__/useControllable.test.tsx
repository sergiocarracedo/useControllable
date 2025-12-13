import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useControllable } from '../index'

describe('useControllable', () => {
  describe('uncontrolled mode', () => {
    it('should use internal state when value is not provided', () => {
      const { result } = renderHook(() => useControllable({ defaultValue: 'initial' }))

      expect(result.current[0]).toBe('initial')
    })

    it('should update internal state when setValue is called', () => {
      const { result } = renderHook(() => useControllable({ defaultValue: 'initial' }))

      act(() => {
        result.current[1]('updated')
      })

      expect(result.current[0]).toBe('updated')
    })

    it('should call onChange when value changes', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() => useControllable({ defaultValue: 'initial', onChange }))

      act(() => {
        result.current[1]('updated')
      })

      expect(onChange).toHaveBeenCalledWith('updated')
      expect(onChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('controlled mode', () => {
    it('should use controlled value when provided', () => {
      const { result } = renderHook(() => useControllable({ value: 'controlled' }))

      expect(result.current[0]).toBe('controlled')
    })

    it('should not update internal state in controlled mode', () => {
      const { result, rerender } = renderHook(({ value }) => useControllable({ value }), {
        initialProps: { value: 'initial' },
      })

      act(() => {
        result.current[1]('updated')
      })

      expect(result.current[0]).toBe('initial')

      rerender({ value: 'external-update' })
      expect(result.current[0]).toBe('external-update')
    })

    it('should call onChange in controlled mode', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() => useControllable({ value: 'controlled', onChange }))

      act(() => {
        result.current[1]('updated')
      })

      expect(onChange).toHaveBeenCalledWith('updated')
      expect(result.current[0]).toBe('controlled')
    })

    it('should update when controlled value changes', () => {
      const { result, rerender } = renderHook(({ value }) => useControllable({ value }), {
        initialProps: { value: 'first' },
      })

      expect(result.current[0]).toBe('first')

      rerender({ value: 'second' })
      expect(result.current[0]).toBe('second')
    })
  })

  describe('onChange reference stability', () => {
    it('should use latest onChange callback', () => {
      const onChange1 = vi.fn()
      const onChange2 = vi.fn()

      const { result, rerender } = renderHook(
        ({ onChange }) => useControllable({ defaultValue: 'test', onChange }),
        { initialProps: { onChange: onChange1 } },
      )

      act(() => {
        result.current[1]('value1')
      })

      expect(onChange1).toHaveBeenCalledWith('value1')
      expect(onChange2).not.toHaveBeenCalled()

      rerender({ onChange: onChange2 })

      act(() => {
        result.current[1]('value2')
      })

      expect(onChange2).toHaveBeenCalledWith('value2')
      expect(onChange1).toHaveBeenCalledTimes(1)
    })
  })

  describe('edge cases', () => {
    it('should handle undefined defaultValue', () => {
      const { result } = renderHook(() => useControllable({}))

      expect(result.current[0]).toBeUndefined()

      act(() => {
        result.current[1]('new-value')
      })

      expect(result.current[0]).toBe('new-value')
    })

    it('should work with different data types', () => {
      const { result: numberResult } = renderHook(() => useControllable({ defaultValue: 42 }))
      expect(numberResult.current[0]).toBe(42)

      const { result: objectResult } = renderHook(() =>
        useControllable({ defaultValue: { key: 'value' } }),
      )
      expect(objectResult.current[0]).toEqual({ key: 'value' })

      const { result: arrayResult } = renderHook(() => useControllable({ defaultValue: [1, 2, 3] }))
      expect(arrayResult.current[0]).toEqual([1, 2, 3])
    })
  })
})
