const BASE = '/api'

async function req(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Erro na requisição')
  }
  return res.status === 204 ? null : res.json()
}

export const api = {
  // Cafeterias
  getCafeterias: () => req('GET', '/cafeterias'),
  getCafeteria: (id) => req('GET', `/cafeterias/${id}`),
  createCafeteria: (data) => req('POST', '/cafeterias', data),
  updateCafeteria: (id, data) => req('PUT', `/cafeterias/${id}`, data),
  deleteCafeteria: (id) => req('DELETE', `/cafeterias/${id}`),

  // Bebidas
  getBebidas: () => req('GET', '/bebidas'),
  createBebida: (data) => req('POST', '/bebidas', data),
  updateBebida: (id, data) => req('PUT', `/bebidas/${id}`, data),
  deleteBebida: (id) => req('DELETE', `/bebidas/${id}`),

  // Avaliações
  getAvaliacoes: (filters = {}) => {
    const p = new URLSearchParams()
    if (filters.cafeteria_id) p.set('cafeteria_id', filters.cafeteria_id)
    if (filters.bebida_id) p.set('bebida_id', filters.bebida_id)
    if (filters.nota_min != null) p.set('nota_min', filters.nota_min)
    return req('GET', `/avaliacoes?${p}`)
  },
  createAvaliacao: (data) => req('POST', '/avaliacoes', data),
  updateAvaliacao: (id, data) => req('PUT', `/avaliacoes/${id}`, data),
  deleteAvaliacao: (id) => req('DELETE', `/avaliacoes/${id}`),

  // Stats
  getStats: () => req('GET', '/stats'),
}
