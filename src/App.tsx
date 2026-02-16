import MainLayout from './components/layout/MainLayout'
import { Button } from './components/ui/Button'
import { Card } from './components/ui/Card'

function App() {
  return (
    <MainLayout>
      {/* Content will go here */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <div>
          <h1>KodNest Premium Build System</h1>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: 'var(--max-width-text)' }}>
            This is a demonstration of the design system's core components and typography.
          </p>
        </div>

        {/* Component Demo Section */}
        <section style={{ display: 'grid', gap: 'var(--spacing-3)' }}>
          <Card>
            <h3 style={{ marginTop: 0 }}>Core Components</h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', marginTop: 'var(--spacing-2)' }}>
              <Button label="Primary Action" variant="primary" />
              <Button label="Secondary Action" variant="secondary" />
            </div>

            <div style={{ marginTop: 'var(--spacing-3)' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                Project Name
              </label>
              <input type="text" className="input-field" placeholder="Enter project name..." />
            </div>
          </Card>
        </section>
      </div>
    </MainLayout>
  )
}

export default App
