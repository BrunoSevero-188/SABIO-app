# SABIO - Plataforma de Estudos Inteligente

Uma aplicação Next.js 14+ completa para gerenciamento de estudos, com funcionalidades de sorteio de cursos, Pomodoro timer, quadro de anotações e questionários interativos.

## 🚀 Funcionalidades

- **🔐 Autenticação Completa** - Login, registro, recuperação de senha com Supabase Auth
- **🎲 Sorteio de Cursos** - Descubra novos cursos (gratuitos e pagos) aleatoriamente
- **⏱️ Pomodoro Timer** - Técnica Pomodoro com ciclos configuráveis e sons
- **📝 Quadro Negro** - Sistema de notas com cores, fixação, busca e exportação/importação
- **🧠 Questionários** - Quizzes interativos com timer, explicações e revisão de respostas
- **📊 Dashboard** - Visão geral de progresso e ações rápidas

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database/Auth**: Supabase
- **UI Components**: Custom components with Radix-like patterns
- **Icons**: Lucide React

## 📁 Estrutura do Projeto

```
SABIO-App/
├── src/
│   ├── app/
│   │   ├── (auth)/           # Rotas de autenticação (sem sidebar)
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── esqueci-senha/
│   │   │   └── role-select/  # Seleção de perfil (estudante/professor)
│   │   ├── (dashboard)/      # Rotas protegidas (com sidebar)
│   │   │   ├── pomodoro/
│   │   │   ├── quadro-negro/
│   │   │   ├── questionarios/
│   │   │   ├── sorteio/
│   │   │   ├── layout.tsx    # Layout com sidebar
│   │   │   └── page.tsx      # Dashboard principal
│   │   ├── api/              # API Routes
│   │   │   ├── auth/callback/
│   │   │   ├── questionarios/
│   │   │   └── sorteio/
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   └── ui/               # Componentes base reutilizáveis
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       ├── Label.tsx
│   │       ├── Select.tsx
│   │       ├── Textarea.tsx
│   │       ├── Slider.tsx
│   │       ├── RadioGroup.tsx
│   │       └── Separator.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── AuthForm.tsx
│   │   │   │   └── RoleSelector.tsx
│   │   │   └── hooks/
│   │   │       └── useAuth.ts
│   │   └── pomodoro/
│   │       └── hooks/
│   │           ├── usePomodoro.ts
│   │           └── useAudio.ts
│   ├── data/
│   │   ├── courses.ts        # Base de dados de cursos
│   │   └── quizzes.ts        # Base de dados de quizzes
│   ├── lib/
│   │   ├── supabase.ts       # Cliente Supabase
│   │   └── utils.ts          # Utilitários (cn, formatTime, etc)
│   ├── styles/
│   │   └── globals.css       # Estilos globais + Tailwind
│   └── types/
│       ├── index.ts          # Tipos principais
│       └── user.ts           # Tipos de autenticação
├── public/
│   └── audio/                # Sons para Pomodoro
├── sorteio-cursos/           # Projeto original (vanilla JS)
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── postcss.config.js
└── .env.local
```

## ⚙️ Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com suas credenciais do Supabase:

```bash
cp .env.example .env.local
```

Configure no Supabase:
- **Authentication > Providers > Email** - Habilite Email/Password
- **Authentication > URL Configuration** - Adicione `http://localhost:3000/auth/callback` nas Redirect URLs
- **Database** - Execute as migrações necessárias (ver seção Banco de Dados)

### 3. Banco de Dados (Supabase)

Execute no SQL Editor do Supabase:

```sql
-- Perfis de usuário
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  role text check (role in ('student', 'teacher')) default 'student',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc' now()),
  updated_at timestamp with time zone default timezone('utc' now())
);

-- Habilitar RLS
alter table profiles enable row level security;

-- Políticas
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Trigger para criar perfil automaticamente
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, role)
  values (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'role');
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 4. Executar em desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000`

## 📦 Build para Produção

```bash
npm run build
npm start
```

## 🎨 Personalização

### Cores (tailwind.config.js)

O tema usa CSS variables para suporte a dark/light mode. Personalize em `tailwind.config.js`:

```js
colors: {
  primary: { ... },     // Cor principal (azul)
  dark: {               // Tema escuro
    bg: '#1a1a2e',
    card: '#16213e',
    accent: '#e94560',  // Rosa/vermelho para destaques
  }
}
```

### Adicionar Novos Cursos

Edite `src/data/courses.ts` e adicione objetos ao array `courses`:

```ts
{
  id: '17',
  name: 'Nome do Curso',
  link: 'https://exemplo.com',
  type: 'free', // ou 'paid'
  category: 'Categoria',
  description: 'Descrição opcional',
}
```

### Adicionar Novos Quizzes

Edite `src/data/quizzes.ts` seguindo o mesmo padrão.

## 🔧 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Inicia servidor de produção |
| `npm run lint` | Executa ESLint |

## 📱 Responsividade

- **Mobile First** - Design adaptável a todos os tamanhos
- **Sidebar** - Colapsável em mobile com overlay
- **Grids** - Responsivos (1/2/3/4 colunas conforme largura)

## ♿ Acessibilidade

- Semântica HTML5 adequada
- ARIA labels e roles
- Navegação por teclado
- Contraste de cores WCAG AA
- Focus visible states

## 📄 Licença

MIT License - Veja [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

**SABIO** - Transformando seus estudos com inteligência 🧠✨