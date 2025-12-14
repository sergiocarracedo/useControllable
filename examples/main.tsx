import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Checkbox, Demo, Toggle, UncontrolledInput } from './examples'

function App() {
  return (
    <div>
      <h1>useControllable Hook Examples</h1>

      <section>
        <UncontrolledInput />
      </section>

      <hr />

      <section>
        <Demo />
      </section>

      <hr />

      <section>
        <h2>Toggle Component</h2>
        <div style={{ margin: '1rem 0' }}>
          <Toggle defaultChecked={false} onChange={(checked) => console.log('Toggle:', checked)} />
        </div>
      </section>

      <hr />

      <section>
        <h2>Checkbox with Custom Prop Name</h2>
        <div style={{ margin: '1rem 0' }}>
          <Checkbox
            label="Accept terms and conditions"
            defaultChecked={false}
            onChangeChecked={(checked) => console.log('Checkbox:', checked)}
          />
        </div>
      </section>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
