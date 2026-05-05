import { useState } from 'react'
import { api } from '../api'
import Modal from './Modal'
import { inputStyle, FormField, PrimaryBtn, DangerBtn, EditBtn, Stars } from './ui'

const EMPTY = { cafeteria_id: '', bebida_id: '', nota: 5, comentario: '', data_visita: '' }

export default function AvaliacoesPage({ avaliacoes, cafeterias, bebidas, onRefresh }) {
  const [modal, setModal] = useState(null) // null | 'create' | 'edit'
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ cafeteria_id: '', bebida_id: '', nota_min: '' })

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setModal('form') }
  const openEdit = (a) => {
    setForm({
      cafeteria_id: a.cafeteria_id,
      bebida_id: a.bebida_id,
      nota: a.nota,
      comentario: a.comentario || '',
      data_visita: a.data_visita || '',
    })
    setEditId(a.id)
    setError('')
    setModal('form')
  }

  const handleSubmit = async () => {
    if (!form.cafeteria_id || !form.bebida_id) { setError('Selecione cafeteria e bebida.'); return }
    setLoading(true); setError('')
    try {
      const payload = { ...form, cafeteria_id: +form.cafeteria_id, bebida_id: +form.bebida_id, nota: +form.nota }
      if (editId) await api.updateAvaliacao(editId, payload)
      else await api.createAvaliacao(payload)
      setModal(null)
      onRefresh()
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Remover esta avaliação?')) return
    try { await api.deleteAvaliacao(id); onRefresh() } catch (e) { alert(e.message) }
  }

  const filtered = (avaliacoes || []).filter(a => {
    if (filters.cafeteria_id && a.cafeteria_id !== +filters.cafeteria_id) return false
    if (filters.bebida_id && a.bebida_id !== +filters.bebida_id) return false
    if (filters.nota_min && a.nota < +filters.nota_min) return false
    return true
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 32, color: 'var(--chocolate)' }}>☕ Avaliações</h2>
        <PrimaryBtn onClick={openCreate}>+ Nova Avaliação</PrimaryBtn>
      </div>

      {/* Filters */}
      <div style={{
        background: 'white', borderRadius: 12, padding: '16px 20px',
        border: '1px solid rgba(170,127,102,0.2)',
        display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 150 }}>
          <label style={{ fontSize: 12, color: 'var(--text-light)' }}>Cafeteria</label>
          <select value={filters.cafeteria_id} onChange={e => setFilters(f => ({ ...f, cafeteria_id: e.target.value }))} style={{ ...inputStyle, padding: '8px 12px' }}>
            <option value="">Todas</option>
            {(cafeterias || []).map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 150 }}>
          <label style={{ fontSize: 12, color: 'var(--text-light)' }}>Bebida</label>
          <select value={filters.bebida_id} onChange={e => setFilters(f => ({ ...f, bebida_id: e.target.value }))} style={{ ...inputStyle, padding: '8px 12px' }}>
            <option value="">Todas</option>
            {(bebidas || []).map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 110 }}>
          <label style={{ fontSize: 12, color: 'var(--text-light)' }}>Nota mínima</label>
          <select value={filters.nota_min} onChange={e => setFilters(f => ({ ...f, nota_min: e.target.value }))} style={{ ...inputStyle, padding: '8px 12px' }}>
            <option value="">Qualquer</option>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}★</option>)}
          </select>
        </div>
        <button onClick={() => setFilters({ cafeteria_id: '', bebida_id: '', nota_min: '' })} style={{
          background: 'none', border: '1.5px solid rgba(170,127,102,0.4)',
          color: 'var(--text-mid)', padding: '8px 14px', borderRadius: 8, fontSize: 13,
        }}>Limpar</button>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>
            Nenhuma avaliação encontrada.
          </div>
        ) : filtered.map(a => (
          <div key={a.id} style={{
            background: 'white', borderRadius: 14, padding: '18px 20px',
            border: '1px solid rgba(170,127,102,0.18)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            flexWrap: 'wrap', gap: 12,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--chocolate)' }}>{a.cafeteria_nome}</span>
                <span style={{ background: 'var(--misty-rose-true)', color: 'var(--aloewood)', padding: '2px 10px', borderRadius: 20, fontSize: 12 }}>
                  {a.bebida_nome}
                </span>
              </div>
              <div style={{ marginTop: 4 }}>
                <Stars nota={a.nota} />
                <span style={{ fontSize: 12, color: 'var(--text-light)', marginLeft: 8 }}>{a.data_visita}</span>
              </div>
              {a.comentario && (
                <p style={{ fontSize: 14, color: 'var(--text-mid)', marginTop: 6, fontStyle: 'italic' }}>
                  "{a.comentario}"
                </p>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <EditBtn onClick={() => openEdit(a)} />
              <DangerBtn onClick={() => handleDelete(a.id)}>Excluir</DangerBtn>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal === 'form' && (
        <Modal title={editId ? 'Editar Avaliação' : 'Nova Avaliação'} onClose={() => setModal(null)}>
          <FormField label="Cafeteria *">
            <select value={form.cafeteria_id} onChange={e => setForm(f => ({ ...f, cafeteria_id: e.target.value }))} style={inputStyle}>
              <option value="">Selecione...</option>
              {(cafeterias || []).map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </FormField>
          <FormField label="Bebida *">
            <select value={form.bebida_id} onChange={e => setForm(f => ({ ...f, bebida_id: e.target.value }))} style={inputStyle}>
              <option value="">Selecione...</option>
              {(bebidas || []).map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
            </select>
          </FormField>
          <FormField label={`Nota: ${form.nota}/5 ${'★'.repeat(+form.nota)}`}>
            <input type="range" min={0} max={5} value={form.nota}
              onChange={e => setForm(f => ({ ...f, nota: +e.target.value }))}
              style={{ accentColor: 'var(--aloewood)', width: '100%' }} />
          </FormField>
          <FormField label="Comentário">
            <textarea value={form.comentario} onChange={e => setForm(f => ({ ...f, comentario: e.target.value }))}
              rows={3} style={{ ...inputStyle, resize: 'vertical' }}
              placeholder="Como foi a experiência?" />
          </FormField>
          <FormField label="Data da visita">
            <input type="date" value={form.data_visita}
              onChange={e => setForm(f => ({ ...f, data_visita: e.target.value }))} style={inputStyle} />
          </FormField>
          {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 10 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setModal(null)} style={{
              background: 'none', border: '1.5px solid rgba(170,127,102,0.4)',
              color: 'var(--text-mid)', padding: '10px 18px', borderRadius: 10, fontSize: 14,
            }}>Cancelar</button>
            <PrimaryBtn onClick={handleSubmit} disabled={loading}>
              {loading ? 'Salvando...' : editId ? 'Salvar' : 'Registrar'}
            </PrimaryBtn>
          </div>
        </Modal>
      )}
    </div>
  )
}
