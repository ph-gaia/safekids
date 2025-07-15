import { z } from 'zod';

export const criancaSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  sexo: z.enum(['M', 'F']),
  observacoes: z.string().optional(),
  responsavelId: z.string().min(1, 'Responsável é obrigatório'),
  foto: z.string().optional(),
});

export const responsavelSchema = z.object({
  cpf: z.string()
    .min(11, 'CPF deve ter 11 dígitos')
    .max(14, 'CPF deve ter no máximo 14 caracteres'),
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  grauParentesco: z.string().min(1, 'Grau de parentesco é obrigatório'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  endereco: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  email: z.string().email('E-mail inválido'),
  foto: z.string().optional(),
});

export const tioSchema = z.object({
  cpf: z.string()
    .min(11, 'CPF deve ter 11 dígitos')
    .max(14, 'CPF deve ter no máximo 14 caracteres'),
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  grauParentesco: z.string().min(1, 'Grau de parentesco é obrigatório'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  endereco: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  email: z.string().email('E-mail inválido'),
  criancasAutorizadasIds: z.array(z.string()).optional(),
});

export const cultoSchema = z.object({
  data: z.string().min(1, 'Data é obrigatória'),
  sala: z.enum(['BABY', 'PRIMARIO', 'JARDIM', 'TEENS']),
});

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const checkInSchema = z.object({
  criancaId: z.string().min(1, 'Criança é obrigatória'),
  responsavelId: z.string().min(1, 'Responsável é obrigatório'),
  cultoId: z.string().min(1, 'Culto é obrigatório'),
});

export const checkOutSchema = z.object({
  criancaId: z.string().min(1, 'Criança é obrigatória'),
  responsavelId: z.string().min(1, 'Responsável é obrigatório'),
  cultoId: z.string().min(1, 'Culto é obrigatório'),
});

export type CriancaFormData = z.infer<typeof criancaSchema>;
export type ResponsavelFormData = z.infer<typeof responsavelSchema>;
export type TioFormData = z.infer<typeof tioSchema>;
export type CultoFormData = z.infer<typeof cultoSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type CheckInFormData = z.infer<typeof checkInSchema>;
export type CheckOutFormData = z.infer<typeof checkOutSchema>; 