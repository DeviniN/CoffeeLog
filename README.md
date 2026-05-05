# ☕ Diário de Cafés

API Web com Python (FastAPI) + Frontend React  
**Projeto Integrador – Nicole Rodrigues**

---

## 🚀 Como rodar o projeto

### Pré-requisitos
- Python 3.10+
- Node.js 18+

---

### 1. Backend (FastAPI)

```bash
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar (Windows)
venv\Scripts\activate

# Ativar (Mac/Linux)
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Rodar o servidor
uvicorn main:app --reload
```

O backend estará rodando em: **http://localhost:8000**  
Documentação automática (Swagger): **http://localhost:8000/docs**

---

### 2. Frontend (React)

Em outro terminal:

```bash
cd frontend

# Instalar dependências
npm install

# Rodar o servidor de desenvolvimento
npm run dev
```

O frontend estará em: **http://localhost:5173**

---

## 📊 Banco de Dados

SQLite — arquivo `diario_cafes.db` criado automaticamente na pasta `backend/`.

### Tabelas

| Tabela      | Campos                                                     |
|-------------|------------------------------------------------------------|
| cafeteria   | id, nome, localizacao                                      |
| bebida      | id, nome                                                   |
| avaliacao   | id, cafeteria_id, bebida_id, nota, comentario, data_visita |

### Relacionamentos
```
Cafeteria (1) ──── (N) Avaliacao (N) ──── (1) Bebida
```

---

## 🔗 Rotas da API

### Cafeterias
| Método | Rota                  | Descrição              |
|--------|-----------------------|------------------------|
| GET    | /cafeterias           | Listar todas           |
| GET    | /cafeterias/{id}      | Buscar por ID          |
| POST   | /cafeterias           | Criar nova             |
| PUT    | /cafeterias/{id}      | Atualizar              |
| DELETE | /cafeterias/{id}      | Remover                |

### Bebidas
| Método | Rota             | Descrição   |
|--------|------------------|-------------|
| GET    | /bebidas         | Listar todas|
| POST   | /bebidas         | Criar nova  |
| PUT    | /bebidas/{id}    | Atualizar   |
| DELETE | /bebidas/{id}    | Remover     |

### Avaliações
| Método | Rota                | Descrição                          |
|--------|---------------------|------------------------------------|
| GET    | /avaliacoes         | Listar (filtros: cafeteria, bebida, nota_min) |
| GET    | /avaliacoes/{id}    | Buscar por ID                      |
| POST   | /avaliacoes         | Criar nova                         |
| PUT    | /avaliacoes/{id}    | Atualizar                          |
| DELETE | /avaliacoes/{id}    | Remover                            |

### Dashboard
| Método | Rota    | Descrição            |
|--------|---------|----------------------|
| GET    | /stats  | Estatísticas gerais  |

---

## 🛠 Tecnologias

- **Backend**: Python, FastAPI, SQLite, Pydantic, Uvicorn
- **Frontend**: React 18, Vite
- **Docs da API**: Swagger UI (automático pelo FastAPI)

---

## 🎨 Paleta de Cores

| Nome         | Hex     |
|--------------|---------|
| Dark Chocolate | #443025 |
| Aloewood     | #7F5836 |
| Milk Tea     | #AA7F66 |
| Sakura       | #EC9C9D |
| Misty Rose   | #F2CF2A |
