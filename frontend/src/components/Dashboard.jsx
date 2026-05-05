const STAR = '★'

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      padding: '24px 20px',
      border: `2px solid ${color}22`,
      boxShadow: '0 2px 16px rgba(68,48,37,0.07)',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <div style={{ fontSize: 32, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color }}>{value ?? '—'}</div>
      <div style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 500 }}>{label}</div>
    </div>
  )
}

export default function Dashboard({ stats, avaliacoes, cafeterias }) {
  const recent = (avaliacoes || []).slice(0, 3)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h2 style={{ fontSize: 36, color: 'var(--chocolate)', marginBottom: 4 }}>Bem-vinda de volta 🌸</h2>
        <p style={{ color: 'var(--text-light)', fontSize: 15 }}>Aqui está um resumo do seu diário de cafés</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <StatCard icon="📋" label="Total de Avaliações" value={stats?.total_avaliacoes} color="var(--aloewood)" />
        <StatCard icon="🏡" label="Cafeterias" value={stats?.total_cafeterias} color="var(--chocolate)" />
        <StatCard icon="🌸" label="Bebidas" value={stats?.total_bebidas} color="var(--sakura)" />
        <StatCard icon="⭐" label="Nota Média" value={stats?.media_geral ? `${stats.media_geral}/5` : null} color="var(--milk-tea)" />
      </div>

      {/* Top cafeteria */}
      {stats?.top_cafeteria && (
        <div style={{
          background: 'linear-gradient(135deg, var(--chocolate) 0%, var(--aloewood) 100%)',
          borderRadius: 16,
          padding: '24px 28px',
          color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              ✦ Cafeteria Favorita
            </div>
            <div style={{ fontSize: 28, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
              {stats.top_cafeteria.nome}
            </div>
          </div>
          <div style={{
            background: 'var(--sakura)',
            color: 'var(--chocolate)',
            borderRadius: 40,
            padding: '8px 20px',
            fontWeight: 700,
            fontSize: 18,
          }}>
            {STAR} {stats.top_cafeteria.media}
          </div>
        </div>
      )}

      {/* Recent reviews */}
      <div>
        <h3 style={{ fontSize: 22, color: 'var(--chocolate)', marginBottom: 16 }}>Visitas Recentes</h3>
        {recent.length === 0 ? (
          <p style={{ color: 'var(--text-light)' }}>Nenhuma avaliação ainda. Comece registrando uma visita! ☕</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recent.map(a => (
              <div key={a.id} style={{
                background: 'white',
                borderRadius: 12,
                padding: '16px 20px',
                border: '1px solid rgba(170,127,102,0.2)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                flexWrap: 'wrap', gap: 8,
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--chocolate)' }}>{a.cafeteria_nome}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 2 }}>
                    {a.bebida_nome} · {a.data_visita}
                  </div>
                  {a.comentario && (
                    <div style={{ fontSize: 14, color: 'var(--text-mid)', marginTop: 6, fontStyle: 'italic' }}>
                      "{a.comentario}"
                    </div>
                  )}
                </div>
                <div style={{
                  background: 'var(--misty-rose-true)',
                  color: 'var(--chocolate)',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}>
                  {STAR.repeat(a.nota)}{'☆'.repeat(5 - a.nota)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
