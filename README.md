# CourseSphere

Plataforma web de gestão de cursos online colaborativa, desenvolvida com Ruby on Rails no backend e React no frontend.

## Tecnologias

**Backend:** Ruby on Rails 8, PostgreSQL, JWT  
**Frontend:** React 19, Vite, Tailwind CSS, React Router, React Hot Toast

---

## Funcionalidades

- Registro e login de usuários com autenticação JWT
- CRUD completo de cursos e aulas
- Permissões: apenas o criador pode editar ou excluir seus cursos e aulas
- Aulas com status `draft` (rascunho) ou `published` (publicado)
- Rascunhos visíveis apenas para o criador do curso
- Embed de vídeos do YouTube diretamente na aula
- Conteúdo textual por aula
- Inscrição e cancelamento de inscrição em cursos
- Página de perfil com cursos criados e inscritos
- Busca e ordenação de cursos no backend
- Paginação de cursos
- Filtro de aulas por status (apenas para o criador)
- Instrutor convidado aleatório via [RandomUser API](https://randomuser.me)
- Contagem de aulas publicadas e rascunhos por curso
- Modal de confirmação para exclusões
- Toast notifications para feedback de ações
- Loading skeleton no dashboard
- Página 404 customizada

---

## Pré-requisitos

- Ruby 3.2.2
- Rails 8.x
- Node.js 20.x
- PostgreSQL

---

## Rodando o backend

```bash
cd coursesphere-api

# Instala dependências
bundle install

# Configura o banco — edite config/database.yml com seu usuário e senha do PostgreSQL
rails db:create db:migrate

# Popular banco com dados de teste (opcional)
rails db:seed

# Inicia o servidor
rails server
```

O backend roda em `http://localhost:3000`.

---

## Rodando o frontend

```bash
cd coursesphere-web

# Instala dependências
npm install

# Inicia o servidor
npm run dev
```

O frontend roda em `http://localhost:5173`.

---

## Usuário de teste

| Nome | Email | Senha | Observação |
|------|-------|-------|------------|
| Teste | teste@email.com | 123456 | Possui cursos e aulas criados |
| t3 | t3@email.com | 234567 | Usuário sem cursos para testar inscrição |

Ou registre um novo usuário pela tela de registro.

---

## Estrutura do projeto

```
coursesphere/
├── coursesphere-api/    # Backend Rails
│   ├── app/
│   │   ├── controllers/
│   │   └── models/
│   └── config/
└── coursesphere-web/    # Frontend React
    └── src/
        ├── pages/
        ├── components/
        ├── services/
        └── context/
```

---

## API — Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /auth/register | Registro |
| POST | /auth/login | Login |
| GET | /courses | Lista cursos (busca, ordenação, paginação) |
| POST | /courses | Cria curso |
| GET | /courses/:id | Detalhes do curso |
| PATCH | /courses/:id | Atualiza curso |
| DELETE | /courses/:id | Exclui curso |
| POST | /courses/:id/enroll | Inscreve no curso |
| DELETE | /courses/:id/unenroll | Cancela inscrição |
| GET | /courses/:id/lessons | Lista aulas do curso |
| POST | /courses/:id/lessons | Cria aula |
| PATCH | /lessons/:id | Atualiza aula |
| DELETE | /lessons/:id | Exclui aula |
| GET | /profile | Perfil do usuário autenticado |