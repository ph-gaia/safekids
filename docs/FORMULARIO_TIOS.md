# Formulário de Cadastro de Tios

## Visão Geral

O formulário de cadastro de tios foi criado para permitir o registro completo de pessoas autorizadas para retirar crianças do sistema. O formulário inclui validações, upload de foto e uma interface intuitiva.

## Funcionalidades Implementadas

### 1. **Campos do Formulário**

- **Nome Completo**: Campo obrigatório com validação de mínimo 2 caracteres
- **CPF**: Campo obrigatório com validação de formato (11-14 dígitos)
- **Grau de Parentesco**: Campo obrigatório (Ex: Tio, Tia, Avô, Avó)
- **Telefone**: Campo obrigatório com validação de mínimo 10 dígitos
- **E-mail**: Campo obrigatório com validação de formato de e-mail
- **Endereço**: Campo obrigatório com validação de mínimo 5 caracteres
- **Foto**: Campo opcional com upload de imagem

### 2. **Upload de Foto**

- **Interface**: Componente `ImageUpload` com preview
- **Validações**:
  - Apenas arquivos de imagem
  - Máximo 5MB
  - Preview em tempo real
- **Armazenamento**: Firebase Storage em pasta `tios/`

### 3. **Validações**

- **Zod Schema**: Validação completa com mensagens em português
- **React Hook Form**: Integração com validação em tempo real
- **Feedback Visual**: Erros exibidos abaixo de cada campo

### 4. **Layout Responsivo**

- **Desktop**: Grid 2 colunas para campos, sidebar para foto
- **Mobile**: Layout empilhado com cards
- **Tablet**: Adaptação automática

## Estrutura do Código

### Schema de Validação

```typescript
export const tioSchema = z.object({
  cpf: z
    .string()
    .min(11, 'CPF deve ter 11 dígitos')
    .max(14, 'CPF deve ter no máximo 14 caracteres'),
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  grauParentesco: z.string().min(1, 'Grau de parentesco é obrigatório'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  endereco: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  email: z.string().email('E-mail inválido'),
  criancasAutorizadasIds: z.array(z.string()).optional(),
});
```

### Tipo Estendido

```typescript
type TioFormDataWithFoto = TioFormData & { foto?: string };
```

### Hook de Upload

```typescript
const { uploadImage } = useImageUpload();

const handlePhotoUpload = async (file: File) => {
  // Upload para Firebase Storage
  const photoUrl = await uploadImage(file, `tios/${Date.now()}_${file.name}`);
  return photoUrl;
};
```

## Componentes Utilizados

### UI Components

- `Card`, `CardHeader`, `CardContent`, `CardTitle`
- `Input` (com validação de erros)
- `Button` (várias variantes)
- `Alert` (para mensagens de erro)
- `ImageUpload` (para upload de foto)

### Icons (Lucide React)

- `ArrowLeft`, `UserCheck`, `Save`, `Upload`

### Hooks Customizados

- `useTios()`: Para criar tio no Firestore
- `useImageUpload()`: Para upload de foto no Storage

## Fluxo de Funcionamento

### 1. **Carregamento da Página**

- Formulário inicializado com valores padrão
- Validações configuradas com Zod
- Componente ImageUpload pronto para upload

### 2. **Preenchimento do Formulário**

- Validação em tempo real dos campos
- Feedback visual de erros
- Upload de foto com preview

### 3. **Submissão**

- Validação completa antes do envio
- Upload da foto (se fornecida)
- Criação do documento no Firestore
- Redirecionamento para lista de tios

### 4. **Tratamento de Erros**

- Erros de validação exibidos nos campos
- Erros de upload exibidos no topo
- Erros de criação exibidos no topo

## Validações Específicas

### CPF

- Mínimo 11 dígitos
- Máximo 14 caracteres (incluindo formatação)
- Formato: 000.000.000-00

### Telefone

- Mínimo 10 dígitos
- Formato: (11) 99999-9999

### E-mail

- Formato válido de e-mail
- Validação com regex

### Foto

- Apenas arquivos de imagem
- Máximo 5MB
- Formatos aceitos: jpg, jpeg, png, gif, webp

## Integração com Firestore

### Estrutura do Documento

```typescript
interface Tio {
  id: string;
  foto: string;
  cpf: string;
  nome: string;
  grauParentesco: string;
  telefone: string;
  endereco: string;
  email: string;
  criancasAutorizadasIds: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Criação no Firestore

```typescript
const tioId = await create({
  ...data,
  foto: (data as TioFormDataWithFoto).foto || '',
  criancasAutorizadasIds: data.criancasAutorizadasIds || [],
});
```

## Responsividade

### Desktop (lg+)

- Grid 2 colunas para campos
- Sidebar com foto e informações
- Layout otimizado para telas grandes

### Tablet (md)

- Grid 2 colunas mantido
- Sidebar adaptada
- Campos responsivos

### Mobile (sm)

- Layout empilhado
- Campos em coluna única
- Sidebar abaixo do formulário

## Próximos Passos

### 1. **Funcionalidades Pendentes**

- **Associação de Crianças**: Selecionar crianças autorizadas
- **Edição**: Página de edição de tios existentes
- **Validação de CPF**: Verificação de CPF válido
- **Máscaras**: Aplicar máscaras nos campos CPF e telefone

### 2. **Melhorias**

- **Auto-complete**: Sugestões de endereço
- **Validação de Telefone**: Verificação de número válido
- **Upload Múltiplo**: Permitir múltiplas fotos
- **Preview Avançado**: Cropping e redimensionamento

### 3. **Testes**

- **Testes Unitários**: Validações e hooks
- **Testes de Integração**: Formulário completo
- **Testes E2E**: Fluxo completo de cadastro

## Como Usar

1. **Navegue** para `/tios/novo`
2. **Preencha** todos os campos obrigatórios
3. **Faça upload** de uma foto (opcional)
4. **Clique** em "Cadastrar Tio"
5. **Aguarde** o redirecionamento para a lista

## Tratamento de Erros

### Erros de Validação

- Exibidos abaixo de cada campo
- Prevenem submissão do formulário
- Mensagens em português

### Erros de Upload

- Exibidos no topo da página
- Não impedem submissão
- Permitem continuar sem foto

### Erros de Criação

- Exibidos no topo da página
- Impedem redirecionamento
- Permitem tentar novamente
