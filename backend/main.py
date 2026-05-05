from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import sqlite3
import os
from datetime import date

app = FastAPI(
    title="☕ Diário de Cafés API",
    description="API para registrar e avaliar experiências em cafeterias",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "diario_cafes.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS cafeteria (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            localizacao TEXT
        );

        CREATE TABLE IF NOT EXISTS bebida (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS avaliacao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cafeteria_id INTEGER,
            bebida_id INTEGER,
            nota INTEGER CHECK (nota >= 0 AND nota <= 5),
            comentario TEXT,
            data_visita DATE DEFAULT CURRENT_DATE,
            FOREIGN KEY (cafeteria_id) REFERENCES cafeteria(id),
            FOREIGN KEY (bebida_id) REFERENCES bebida(id)
        );

        INSERT OR IGNORE INTO cafeteria (id, nome, localizacao) VALUES
            (1, 'Café das Flores', 'Rua Augusta, 120 - São Paulo'),
            (2, 'Sakura Coffee', 'Av. Paulista, 500 - São Paulo'),
            (3, 'Blend & Co', 'Rua Oscar Freire, 88 - São Paulo');

        INSERT OR IGNORE INTO bebida (id, nome) VALUES
            (1, 'Latte de Tiramisu'),
            (2, 'Cappuccino'),
            (3, 'Matcha Latte'),
            (4, 'Espresso'),
            (5, 'Cold Brew');

        INSERT OR IGNORE INTO avaliacao (id, cafeteria_id, bebida_id, nota, comentario, data_visita) VALUES
            (1, 1, 1, 5, 'Incrível! O latte de tiramisu é de outro mundo 🤍', '2025-04-10'),
            (2, 2, 3, 4, 'Matcha muito cremoso, ambiente lindo com sakuras na janela', '2025-04-18'),
            (3, 3, 2, 3, 'Cappuccino ok, mas esperava mais do ambiente', '2025-04-25');
    """)
    conn.commit()
    conn.close()

init_db()

# ─── SCHEMAS ───────────────────────────────────────────────────────────────────

class CafeteriaCreate(BaseModel):
    nome: str = Field(..., min_length=1, example="Café das Flores")
    localizacao: Optional[str] = Field(None, example="Rua Augusta, 120 - São Paulo")

class CafeteriaOut(BaseModel):
    id: int
    nome: str
    localizacao: Optional[str]

class BebidaCreate(BaseModel):
    nome: str = Field(..., min_length=1, example="Latte de Tiramisu")

class BebidaOut(BaseModel):
    id: int
    nome: str

class AvaliacaoCreate(BaseModel):
    cafeteria_id: int
    bebida_id: int
    nota: int = Field(..., ge=0, le=5, example=5)
    comentario: Optional[str] = Field(None, example="Ambiente lindo e café delicioso!")
    data_visita: Optional[str] = Field(None, example="2025-05-01")

class AvaliacaoOut(BaseModel):
    id: int
    cafeteria_id: int
    bebida_id: int
    cafeteria_nome: Optional[str]
    bebida_nome: Optional[str]
    nota: int
    comentario: Optional[str]
    data_visita: Optional[str]

# ─── CAFETERIAS ────────────────────────────────────────────────────────────────

@app.get("/cafeterias", response_model=List[CafeteriaOut], tags=["Cafeterias"])
def listar_cafeterias():
    """Lista todas as cafeterias cadastradas."""
    conn = get_db()
    rows = conn.execute("SELECT * FROM cafeteria ORDER BY nome").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.get("/cafeterias/{id}", response_model=CafeteriaOut, tags=["Cafeterias"])
def buscar_cafeteria(id: int):
    """Busca uma cafeteria pelo ID."""
    conn = get_db()
    row = conn.execute("SELECT * FROM cafeteria WHERE id = ?", (id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Cafeteria não encontrada")
    return dict(row)

@app.post("/cafeterias", response_model=CafeteriaOut, status_code=201, tags=["Cafeterias"])
def criar_cafeteria(data: CafeteriaCreate):
    """Cria uma nova cafeteria."""
    conn = get_db()
    cur = conn.execute(
        "INSERT INTO cafeteria (nome, localizacao) VALUES (?, ?)",
        (data.nome, data.localizacao)
    )
    conn.commit()
    row = conn.execute("SELECT * FROM cafeteria WHERE id = ?", (cur.lastrowid,)).fetchone()
    conn.close()
    return dict(row)

@app.put("/cafeterias/{id}", response_model=CafeteriaOut, tags=["Cafeterias"])
def atualizar_cafeteria(id: int, data: CafeteriaCreate):
    """Atualiza os dados de uma cafeteria."""
    conn = get_db()
    row = conn.execute("SELECT * FROM cafeteria WHERE id = ?", (id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Cafeteria não encontrada")
    conn.execute(
        "UPDATE cafeteria SET nome = ?, localizacao = ? WHERE id = ?",
        (data.nome, data.localizacao, id)
    )
    conn.commit()
    row = conn.execute("SELECT * FROM cafeteria WHERE id = ?", (id,)).fetchone()
    conn.close()
    return dict(row)

@app.delete("/cafeterias/{id}", tags=["Cafeterias"])
def deletar_cafeteria(id: int):
    """Remove uma cafeteria."""
    conn = get_db()
    row = conn.execute("SELECT * FROM cafeteria WHERE id = ?", (id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Cafeteria não encontrada")
    conn.execute("DELETE FROM cafeteria WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return {"message": "Cafeteria removida com sucesso"}

# ─── BEBIDAS ───────────────────────────────────────────────────────────────────

@app.get("/bebidas", response_model=List[BebidaOut], tags=["Bebidas"])
def listar_bebidas():
    """Lista todas as bebidas cadastradas."""
    conn = get_db()
    rows = conn.execute("SELECT * FROM bebida ORDER BY nome").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/bebidas", response_model=BebidaOut, status_code=201, tags=["Bebidas"])
def criar_bebida(data: BebidaCreate):
    """Cria uma nova bebida."""
    conn = get_db()
    cur = conn.execute("INSERT INTO bebida (nome) VALUES (?)", (data.nome,))
    conn.commit()
    row = conn.execute("SELECT * FROM bebida WHERE id = ?", (cur.lastrowid,)).fetchone()
    conn.close()
    return dict(row)

@app.put("/bebidas/{id}", response_model=BebidaOut, tags=["Bebidas"])
def atualizar_bebida(id: int, data: BebidaCreate):
    """Atualiza o nome de uma bebida."""
    conn = get_db()
    row = conn.execute("SELECT * FROM bebida WHERE id = ?", (id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Bebida não encontrada")
    conn.execute("UPDATE bebida SET nome = ? WHERE id = ?", (data.nome, id))
    conn.commit()
    row = conn.execute("SELECT * FROM bebida WHERE id = ?", (id,)).fetchone()
    conn.close()
    return dict(row)

@app.delete("/bebidas/{id}", tags=["Bebidas"])
def deletar_bebida(id: int):
    """Remove uma bebida."""
    conn = get_db()
    row = conn.execute("SELECT * FROM bebida WHERE id = ?", (id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Bebida não encontrada")
    conn.execute("DELETE FROM bebida WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return {"message": "Bebida removida com sucesso"}

# ─── AVALIAÇÕES ────────────────────────────────────────────────────────────────

@app.get("/avaliacoes", response_model=List[AvaliacaoOut], tags=["Avaliações"])
def listar_avaliacoes(
    cafeteria_id: Optional[int] = Query(None, description="Filtrar por cafeteria"),
    bebida_id: Optional[int] = Query(None, description="Filtrar por bebida"),
    nota_min: Optional[int] = Query(None, ge=0, le=5, description="Nota mínima"),
):
    """Lista avaliações com filtros opcionais."""
    conn = get_db()
    query = """
        SELECT a.*, c.nome as cafeteria_nome, b.nome as bebida_nome
        FROM avaliacao a
        LEFT JOIN cafeteria c ON a.cafeteria_id = c.id
        LEFT JOIN bebida b ON a.bebida_id = b.id
        WHERE 1=1
    """
    params = []
    if cafeteria_id:
        query += " AND a.cafeteria_id = ?"
        params.append(cafeteria_id)
    if bebida_id:
        query += " AND a.bebida_id = ?"
        params.append(bebida_id)
    if nota_min is not None:
        query += " AND a.nota >= ?"
        params.append(nota_min)
    query += " ORDER BY a.data_visita DESC"
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.get("/avaliacoes/{id}", response_model=AvaliacaoOut, tags=["Avaliações"])
def buscar_avaliacao(id: int):
    """Busca uma avaliação pelo ID."""
    conn = get_db()
    row = conn.execute("""
        SELECT a.*, c.nome as cafeteria_nome, b.nome as bebida_nome
        FROM avaliacao a
        LEFT JOIN cafeteria c ON a.cafeteria_id = c.id
        LEFT JOIN bebida b ON a.bebida_id = b.id
        WHERE a.id = ?
    """, (id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    return dict(row)

@app.post("/avaliacoes", response_model=AvaliacaoOut, status_code=201, tags=["Avaliações"])
def criar_avaliacao(data: AvaliacaoCreate):
    """Registra uma nova avaliação no diário."""
    conn = get_db()
    data_visita = data.data_visita or str(date.today())
    cur = conn.execute(
        "INSERT INTO avaliacao (cafeteria_id, bebida_id, nota, comentario, data_visita) VALUES (?,?,?,?,?)",
        (data.cafeteria_id, data.bebida_id, data.nota, data.comentario, data_visita)
    )
    conn.commit()
    row = conn.execute("""
        SELECT a.*, c.nome as cafeteria_nome, b.nome as bebida_nome
        FROM avaliacao a
        LEFT JOIN cafeteria c ON a.cafeteria_id = c.id
        LEFT JOIN bebida b ON a.bebida_id = b.id
        WHERE a.id = ?
    """, (cur.lastrowid,)).fetchone()
    conn.close()
    return dict(row)

@app.put("/avaliacoes/{id}", response_model=AvaliacaoOut, tags=["Avaliações"])
def atualizar_avaliacao(id: int, data: AvaliacaoCreate):
    """Atualiza uma avaliação existente."""
    conn = get_db()
    row = conn.execute("SELECT * FROM avaliacao WHERE id = ?", (id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    data_visita = data.data_visita or str(date.today())
    conn.execute(
        "UPDATE avaliacao SET cafeteria_id=?, bebida_id=?, nota=?, comentario=?, data_visita=? WHERE id=?",
        (data.cafeteria_id, data.bebida_id, data.nota, data.comentario, data_visita, id)
    )
    conn.commit()
    row = conn.execute("""
        SELECT a.*, c.nome as cafeteria_nome, b.nome as bebida_nome
        FROM avaliacao a
        LEFT JOIN cafeteria c ON a.cafeteria_id = c.id
        LEFT JOIN bebida b ON a.bebida_id = b.id
        WHERE a.id = ?
    """, (id,)).fetchone()
    conn.close()
    return dict(row)

@app.delete("/avaliacoes/{id}", tags=["Avaliações"])
def deletar_avaliacao(id: int):
    """Remove uma avaliação do diário."""
    conn = get_db()
    row = conn.execute("SELECT * FROM avaliacao WHERE id = ?", (id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    conn.execute("DELETE FROM avaliacao WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return {"message": "Avaliação removida com sucesso"}

# ─── STATS ─────────────────────────────────────────────────────────────────────

@app.get("/stats", tags=["Dashboard"])
def estatisticas():
    """Retorna estatísticas gerais do diário."""
    conn = get_db()
    total_avaliacoes = conn.execute("SELECT COUNT(*) FROM avaliacao").fetchone()[0]
    total_cafeterias = conn.execute("SELECT COUNT(*) FROM cafeteria").fetchone()[0]
    total_bebidas = conn.execute("SELECT COUNT(*) FROM bebida").fetchone()[0]
    media_nota = conn.execute("SELECT ROUND(AVG(nota), 1) FROM avaliacao").fetchone()[0]
    top_cafeteria = conn.execute("""
        SELECT c.nome, ROUND(AVG(a.nota),1) as media
        FROM avaliacao a JOIN cafeteria c ON a.cafeteria_id = c.id
        GROUP BY c.id ORDER BY media DESC LIMIT 1
    """).fetchone()
    conn.close()
    return {
        "total_avaliacoes": total_avaliacoes,
        "total_cafeterias": total_cafeterias,
        "total_bebidas": total_bebidas,
        "media_geral": media_nota,
        "top_cafeteria": dict(top_cafeteria) if top_cafeteria else None
    }
