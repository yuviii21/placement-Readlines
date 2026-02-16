import React from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)'
        }}>
            {/* Top Bar */}
            <header style={{
                height: 'var(--header-height)',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 var(--spacing-3)',
                backgroundColor: 'var(--color-surface)'
            }}>
                <div style={{ fontWeight: 600, fontSize: '18px' }}>KodNest Premium Build System</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Step 1 / 5</div>
                <div style={{
                    padding: '4px 12px',
                    backgroundColor: '#F0F0F0', // Neutral badge for now
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    fontWeight: 500
                }}>
                    In Progress
                </div>
            </header>

            {/* Context Header */}
            <section style={{
                padding: 'var(--spacing-4) var(--spacing-5)',
                maxWidth: 'var(--max-width-text)'
            }}>
                <h1 style={{
                    fontSize: '32px',
                    marginBottom: 'var(--spacing-1)',
                    color: 'var(--color-text)'
                }}>System Configuration</h1>
                <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '16px',
                    margin: 0
                }}>
                    Configure the core parameters for your new project build.
                </p>
            </section>

            {/* Main Workspace Area */}
            <main style={{
                display: 'flex',
                flex: 1,
                padding: '0 var(--spacing-5) var(--spacing-5)',
                gap: 'var(--spacing-4)'
            }}>
                {/* Primary Workspace (70%) */}
                <div style={{
                    flex: '0 0 70%',
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                    padding: 'var(--spacing-4)',
                    minHeight: '400px'
                }}>
                    {children}
                </div>

                {/* Secondary Panel (30%) */}
                <aside style={{
                    flex: '0 0 30%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-3)'
                }}>
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-border)',
                        padding: 'var(--spacing-3)'
                    }}>
                        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                            Step Explanation
                        </h3>
                        <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
                            Define the foundational elements of the system here. This ensures consistency across all subsequent modules.
                        </p>
                    </div>

                    <div style={{
                        backgroundColor: '#F3F4F6', // Light gray for prompt box
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-border)',
                        padding: 'var(--spacing-3)',
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        color: '#333'
                    }}>
                        SYSTEM_INIT --verbose --force
                    </div>
                </aside>
            </main>

            {/* Proof Footer */}
            <footer style={{
                borderTop: '1px solid var(--color-border)',
                padding: 'var(--spacing-3) var(--spacing-5)',
                backgroundColor: 'var(--color-surface)',
                display: 'flex',
                gap: 'var(--spacing-4)',
                alignItems: 'center',
                position: 'sticky',
                bottom: 0
            }}>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>Verification Code:</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <input type="checkbox" /> UI Built
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <input type="checkbox" /> Logic Working
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <input type="checkbox" /> Test Passed
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <input type="checkbox" /> Deployed
                </label>
            </footer>
        </div>
    );
};

export default MainLayout;
