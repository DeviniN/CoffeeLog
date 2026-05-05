import { useState } from 'react'
import { api } from '../api'
import Modal from './Modal'
import { inputStyle, FormField, PrimaryBtn, DangerBtn, EditBtn } from './ui'

const EMPTY = { nome: '', localizacao: '' }

export default function CafeteriasPage({ cafeterias, onRefresh }) {
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setModal(true) }
  const openEdit = (c) => { setForm({ nome: c.nome, localizacao: c.localizacao || '' }); setEditId(c.id); setError(''); setModal(true) }

  const handleSubmit = async () => {
    if (!form.nome.trim()) { setError('Nome é obrigatório.'); return }
    setLoading(true); setError('')
    try {
      if (editId) await api.updateCafeteria(editId, form)
      else await api.createCafeteria(form)
      setModal(false)
      onRefresh()
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Remover esta cafeteria? As avaliações associadas podem ficar sem referência.')) return
    try { await api.deleteCafeteria(id); onRefresh() } catch (e) { alert(e.message) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 32, color: 'var(--chocolate)' }}>🏡 Cafeterias</h2>
        <PrimaryBtn onClick={openCreate}>+ Nova Cafeteria</PrimaryBtn>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {(cafeterias || []).length === 0 ? (
          <p style={{ color: 'var(--text-light)' }}>Nenhuma cafeteria cadastrada.</p>
        ) : (cafeterias || []).map(c => (
          <div key={c.id} style={{
            background: 'white', borderRadius: 14,
            padding: '20px', border: '1px solid rgba(170,127,102,0.18)',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--chocolate)' }}>{c.nome}</div>
              {c.localizacao && (
                <div style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4 }}>
                  📍 {c.localizacao}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <EditBtn onClick={() => openEdit(c)} />
              <DangerBtn onClick={() => handleDelete(c.id)}>Excluir</DangerBtn>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={editId ? 'Editar Cafeteria' : 'Nova Cafeteria'} onClose={() => setModal(false)}>
          <FormField label="Nome *">
            <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              style={inputStyle} placeholder="Ex: Café das Flores" />
          </FormField>
          <FormField label="Localização">
            <input value={form.localizacao} onChange={e => setForm(f => ({ ...f, localizacao: e.target.value }))}
              style={inputStyle} placeholder="Ex: Rua Augusta, 120 - São Paulo" />
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
