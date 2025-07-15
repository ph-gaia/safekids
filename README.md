# SafeKids - Sistema de Gestão de Presença

Sistema completo de gestão de presença de crianças em cultos da igreja, com foco em segurança, organização e usabilidade.

## 🚀 Tecnologias

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Storage)
- **UI Components**: Headless UI + Heroicons + Lucide React
- **Form Validation**: React Hook Form + Zod
- **State Management**: React Hooks

## 📋 Funcionalidades

### 🔐 Autenticação e Controle de Acesso

- Firebase Auth com separação de usuários por função (pais/servos)
- UI adaptativa conforme tipo de usuário

### 👥 Gestão de Entidades (CRUD)

- **Crianças**: Cadastro com foto, dados pessoais e observações
- **Responsáveis**: Cadastro completo com CPF, contatos e endereço
- **Tios**: Cadastro de pessoas autorizadas para retirada
- **Cultos**: Agendamento e gestão de presenças

### ✅ Check-in e Check-out

- **Check-in**: Responsável faz solicitação → Servo confirma
- **Check-out**: Responsável/Tio solicita → Servo confirma
- Registro de fotos e horários em cada etapa

### 📊 Dashboard

- Estatísticas em tempo real
- Alertas de pendências
- Atividade recente

## 🛠️ Configuração

### 1. Clone o repositório

```bash
git clone <repository-url>
cd safekids
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Firebase

Crie um projeto no [Firebase Console](https://console.firebase.google.com/) e configure:

#### Firestore Database

Coleções necessárias:

- `criancas`
- `responsaveis`
- `tios`
- `cultos`
- `usuarios`

#### Authentication

- Habilite autenticação por email/senha
- Configure regras de segurança

#### Storage

- Configure regras para upload de imagens
- Organize por pastas: `/criancas/`, `/responsaveis/`, `/tios/`

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

### 5. Execute o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── auth/              # Páginas de autenticação
│   ├── dashboard/         # Dashboard principal
│   ├── criancas/          # Gestão de crianças
│   ├── responsaveis/      # Gestão de responsáveis
│   ├── tios/              # Gestão de tios
│   └── cultos/            # Gestão de cultos
├── components/            # Componentes reutilizáveis
│   └── ui/               # Componentes base da UI
├── hooks/                # Hooks personalizados
├── lib/                  # Configurações e utilitários
├── types/                # Definições TypeScript
└── utils/                # Funções utilitárias
```

## 🔐 Regras de Segurança Firebase

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever apenas seus próprios dados
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Pais podem ler/escrever dados de suas crianças
    match /criancas/{criancaId} {
      allow read, write: if request.auth != null &&
        (resource.data.responsavelId == request.auth.uid ||
         request.auth.token.tipo == 'servants');
    }

    // Servos têm acesso completo
    match /{document=**} {
      allow read, write: if request.auth != null &&
        request.auth.token.tipo == 'servants';
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /criancas/{childId} {
      allow read, write: if request.auth != null;
    }
    match /responsaveis/{userId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == userId;
    }
    match /tios/{userId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == userId;
    }
  }
}
```

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage
```

## 📦 Deploy

### Vercel (Recomendado)

```bash
npm run build
vercel --prod
```

### Firebase Hosting

```bash
npm run build
firebase deploy
```
