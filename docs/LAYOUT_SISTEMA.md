# Sistema de Layout Compartilhado

## Visão Geral

Implementamos um sistema de layout consistente em todas as telas do SafeKids, com menu vertical e horizontal padronizados. Isso facilita a navegação e proporciona uma experiência de usuário uniforme.

## Estrutura do Layout

### 1. **Componente AppLayout**

- **Localização**: `src/components/layout/AppLayout.tsx`
- **Função**: Layout principal reutilizável para todas as páginas
- **Características**:
  - Menu lateral vertical (desktop)
  - Menu hambúrguer (mobile)
  - Barra superior horizontal
  - Área de conteúdo centralizada

### 2. **Layouts Específicos**

Cada seção tem seu próprio layout que usa o `AppLayout`:

- **Dashboard**: `src/app/dashboard/layout.tsx`
- **Crianças**: `src/app/criancas/layout.tsx`
- **Responsáveis**: `src/app/responsaveis/layout.tsx`
- **Tios**: `src/app/tios/layout.tsx`
- **Cultos**: `src/app/cultos/layout.tsx`

## Componentes do Layout

### 1. **Menu Lateral (Sidebar)**

```typescript
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Crianças', href: '/criancas', icon: Users },
  { name: 'Responsáveis', href: '/responsaveis', icon: UserCheck },
  { name: 'Tios', href: '/tios', icon: UserCheck },
  { name: 'Cultos', href: '/cultos', icon: Calendar },
];
```

**Características**:

- **Desktop**: Fixo à esquerda, largura 256px
- **Mobile**: Overlay com backdrop
- **Indicador ativo**: Página atual destacada em azul
- **Ícones**: Lucide React para cada seção

### 2. **Barra Superior (Top Bar)**

- **Menu hambúrguer**: Visível apenas no mobile
- **Logo**: SafeKids com ícone Shield
- **Informações do usuário**: Nome do usuário logado
- **Botão de logout**: Com ícone e texto

### 3. **Área de Conteúdo**

- **Padding**: 24px nas laterais
- **Largura máxima**: 1280px (max-w-7xl)
- **Responsivo**: Adapta-se a diferentes tamanhos de tela

## Funcionalidades Implementadas

### 1. **Navegação Inteligente**

- **Detecção de página ativa**: Usa `usePathname()` do Next.js
- **Highlight automático**: Item do menu destacado baseado na URL atual
- **Subpáginas**: Detecta páginas filhas (ex: `/criancas/novo`)

### 2. **Responsividade**

- **Desktop (lg+)**: Menu lateral fixo
- **Tablet (md)**: Menu lateral adaptado
- **Mobile (sm)**: Menu hambúrguer com overlay

### 3. **Autenticação**

- **Proteção de rotas**: Redireciona para login se não autenticado
- **Loading state**: Spinner durante verificação de auth
- **Logout**: Função integrada com Firebase Auth

## Como Usar

### 1. **Para Páginas Existentes**

As páginas já estão configuradas com o layout. Apenas certifique-se de que o conteúdo está dentro da área de conteúdo:

```typescript
// Exemplo: src/app/criancas/page.tsx
export default function CriancasPage() {
  return (
    <div className="space-y-6">
      {/* Seu conteúdo aqui */}
    </div>
  );
}
```

### 2. **Para Novas Páginas**

Crie um layout.tsx na pasta da seção:

```typescript
// src/app/nova-secao/layout.tsx
import { AppLayout } from '@/components/layout';

interface NovaSecaoLayoutProps {
  children: React.ReactNode;
}

export default function NovaSecaoLayout({ children }: NovaSecaoLayoutProps) {
  return <AppLayout>{children}</AppLayout>;
}
```

### 3. **Para Subpáginas**

Subpáginas herdam automaticamente o layout da seção pai:

```
src/app/criancas/
├── layout.tsx          # Layout da seção
├── page.tsx            # Lista de crianças
├── novo/
│   └── page.tsx        # Formulário de nova criança
└── [id]/
    ├── page.tsx        # Detalhes da criança
    └── editar/
        └── page.tsx    # Formulário de edição
```

## Estilos e Classes CSS

### 1. **Menu Ativo**

```css
/* Item ativo */
.bg-blue-50 text-blue-700 border-r-2 border-blue-700

/* Item inativo */
.text-gray-600 hover:bg-gray-50 hover:text-gray-900
```

### 2. **Layout Responsivo**

```css
/* Desktop sidebar */
.lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col

/* Main content offset */
.lg:pl-64

/* Mobile overlay */
.fixed inset-0 z-50 lg:hidden
```

### 3. **Top Bar**

```css
/* Sticky top bar */
.sticky top-0 z-40 flex h-16 shrink-0 items-center

/* Content area */
.py-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8
```

## Benefícios do Sistema

### 1. **Consistência**

- Todas as páginas têm o mesmo layout
- Navegação uniforme em toda a aplicação
- Experiência de usuário previsível

### 2. **Manutenibilidade**

- Código centralizado no `AppLayout`
- Mudanças aplicadas automaticamente a todas as páginas
- Fácil adição de novas funcionalidades

### 3. **Performance**

- Layout compartilhado evita re-renderizações desnecessárias
- Componentes otimizados com React
- Lazy loading de páginas

### 4. **Acessibilidade**

- Navegação por teclado
- Indicadores visuais claros
- Estrutura semântica adequada

## Próximos Passos

### 1. **Melhorias de UX**

- **Breadcrumbs**: Navegação hierárquica
- **Notificações**: Sistema de alertas na top bar
- **Tema escuro**: Opção de alternar tema

### 2. **Funcionalidades Avançadas**

- **Menu dinâmico**: Baseado em permissões do usuário
- **Favoritos**: Páginas favoritas no menu
- **Histórico**: Últimas páginas visitadas

### 3. **Otimizações**

- **Preload**: Carregamento antecipado de páginas
- **Cache**: Cache de navegação
- **Analytics**: Rastreamento de navegação

## Troubleshooting

### 1. **Menu não destaca página ativa**

- Verifique se a URL está correta no array `navigation`
- Confirme se `usePathname()` está funcionando

### 2. **Layout não aplica**

- Verifique se o layout.tsx está na pasta correta
- Confirme se está importando `AppLayout` corretamente

### 3. **Problemas de responsividade**

- Teste em diferentes tamanhos de tela
- Verifique as classes CSS responsivas
- Confirme se o menu mobile está funcionando

## Exemplos de Uso

### 1. **Página com Header Customizado**

```typescript
export default function MinhaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meu Título</h1>
        <Button>Nova Ação</Button>
      </div>
      {/* Resto do conteúdo */}
    </div>
  );
}
```

### 2. **Página com Cards**

```typescript
export default function MinhaPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Meu Card</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Conteúdo do card */}
        </CardContent>
      </Card>
    </div>
  );
}
```

O sistema de layout está pronto e funcionando! Todas as páginas agora têm navegação consistente e experiência de usuário uniforme.
