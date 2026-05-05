export const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1.5px solid rgba(170,127,102,0.35)',
  borderRadius: 10,
  fontSize: 14,
  background: 'white',
  color: 'var(--text-dark)',
  outline: 'none',
}

export const labelStyle = {
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--text-mid)',
  marginBottom: 4,
  display: 'block',
}

export function FormField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

export function PrimaryBtn({ children, onClick, type = 'button', disabled }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      background: 'var(--chocolate)',
      color: 'white',
      border: 'none',
      padding: '11px 22px',
      borderRadius: 10,
      fontWeight: 600,
      fontSize: 14,
      opacity: disabled ? 0.6 : 1,
      transition: 'all 0.15s',
    }}>{children}</button>
  )
}

export function DangerBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'none',
      color: '#c0392b',
      border: '1.5px solid #c0392b44',
      padding: '7px 14px',
      borderRadius: 8,
      fontWeight: 500,
      fontSize: 13,
    }}>{children}</button>
  )
}

export function EditBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'var(--misty-rose-true)',
      color: 'var(--chocolate)',
      border: 'none',
      padding: '7px 14px',
      borderRadius: 8,
      fontWeight: 500,
      fontSize: 13,
    }}>Editar</button>
  )
}

export function Stars({ nota }) {
  return (
    <span style={{ color: 'var(--aloewood)', fontSize: 15, letterSpacing: 1 }}>
      {'★'.repeat(nota)}{'☆'.repeat(5 - nota)}
    </span>
  )
}
