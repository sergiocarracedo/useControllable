import { useState } from 'react'
import { useControllable } from './index'

/**
 * Example 1: Uncontrolled Input Component
 * The component manages its own state internally
 */
export function UncontrolledInput() {
  const [value, setValue] = useControllable({
    defaultValue: '',
    onChange: (newValue) => {
      console.log('Value changed to:', newValue)
    },
  })

  return (
    <div>
      <h3>Uncontrolled Input</h3>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something..."
      />
      <p>Current value: {value}</p>
    </div>
  )
}

/**
 * Example 2: Controlled Input Component
 * The component can be controlled from outside
 */
interface ControlledInputProps {
  value?: string
  onChange?: (value: string) => void
  defaultValue?: string
}

export function ControlledInput({ value, onChange, defaultValue }: ControlledInputProps) {
  const [controlledValue, setControlledValue] = useControllable({
    value,
    defaultValue,
    onChange,
  })

  return (
    <div>
      <input
        type="text"
        value={controlledValue}
        onChange={(e) => setControlledValue(e.target.value)}
        placeholder="Type something..."
      />
    </div>
  )
}

/**
 * Example 3: Using ControlledInput in both modes
 */
export function Demo() {
  const [externalValue, setExternalValue] = useState('controlled')

  return (
    <div>
      <h2>Controlled Mode</h2>
      <ControlledInput value={externalValue} onChange={setExternalValue} />
      <p>External state: {externalValue}</p>
      <button onClick={() => setExternalValue('reset')}>Reset</button>

      <hr />

      <h2>Uncontrolled Mode</h2>
      <ControlledInput defaultValue="uncontrolled" />
    </div>
  )
}

/**
 * Example 4: Custom Component with Toggle
 */
interface ToggleProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
}

export function Toggle({ checked, defaultChecked, onChange }: ToggleProps) {
  const [isChecked, setIsChecked] = useControllable({
    value: checked,
    defaultValue: defaultChecked ?? false,
    onChange,
  })

  return (
    <button
      onClick={() => setIsChecked(!isChecked)}
      style={{
        padding: '8px 16px',
        backgroundColor: isChecked ? '#4caf50' : '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      {isChecked ? 'ON' : 'OFF'}
    </button>
  )
}

/**
 * Example 5: Other name for controlled prop
 */
interface ToggleProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
}

export function Toggle({ checked, defaultChecked, onChange }: ToggleProps) {
  const [isChecked, setIsChecked] = useControllable<string, 'checked'>({
    checked,
    defaultChecked: defaultChecked ?? false,
    onChangeChecked: onChange,
  })

  return (
    <button
      onClick={() => setIsChecked(!isChecked)}
      style={{
        padding: '8px 16px',
        backgroundColor: isChecked ? '#4caf50' : '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      {isChecked ? 'ON' : 'OFF'}
    </button>
  )
}
