import { useState } from 'react'
import { api } from '../api'
import Modal from './Modal'
import { inputStyle, FormField, PrimaryBtn, DangerBtn, EditBtn } from './ui'

export default function BebidasPage({ bebidas, onRefresh }) {
  const [modal, setModal] = useState(false)
  const [nome, setNome] = useState('')
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const openCreate = () => { setNome(''); setEditId(null); setError(''); setModal(true) }
  const openEdit = (b) => { setNome(b.nome); setEditId(b.id); setError(''); setModal(true) }

  const handleSubmit = async () => {
    if (!nome.trim()) { setError('Nome é obrigatório.'); return }
    setLoading(true); setError('')
    try {
      if (editId) await api.updateBebida(editId, { nome })
      else await api.createBebida({ nome })
      setModal(false)
      onRefresh()
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Remover esta bebida?')) return
    try { await api.deleteBebida(id); onRefresh() } catch (e) { alert(e.message) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 32, color: 'var(--chocolate)' }}>🌸 Bebidas</h2>
        <PrimaryBtn onClick={openCreate}>+ Nova Bebida</PrimaryBtn>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {(bebidas || []).length === 0 ? (
          <p style={{ color: 'var(--text-light)' }}>Nenhuma bebida cadastrada.</p>
        ) : (bebidas || []).map(b => (
          <div key={b.id} style={{
            background: 'white', borderRadius: 14, padding: '18px 20px',
            border: '1px solid rgba(236,156,157,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          }}>
            <div>
              <div style={{ fontSize: 20 }}>☕</div>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--chocolate)', marginTop: 4 }}>{b.nome}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <EditBtn onClick={() => openEdit(b)} />
              <DangerBtn onClick={() => handleDelete(b.id)}>✕</DangerBtn>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={editId ? 'Editar Bebida' : 'Nova Bebida'} onClose={() => setModal(false)}>
          <FormField label="Nome da bebida *">
            <input value={nome} onChange={e => setNome(e.target.value)}
              style={inputStyle} placeholder="Ex: Latte de Tiramisu" />
          </FormField>
          {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 10 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setModal(false)} style={{
              background: 'none', border: '1.5px solid rgba(170,127,102,0.4)',
              color: 'var(--text-mid)', padding: '10px 18px', borderRadius: 10, fontSize: 14,
            }}>Cancelar</button>
            <PrimaryBtn onClick={handleSubmit} disabled={loading}>
              {loading ? 'Salvando...' : editId ? 'Salvar' : 'Cadastrar'}
            </PrimaryBtn>
          </div>
        </Modal>
      )}
    </div>
  )
}
