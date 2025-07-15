export type Sexo = 'M' | 'F';

export type Sala = 'BABY' | 'PRIMARIO' | 'JARDIM' | 'TEENS';

export type TipoUsuario = 'parents' | 'servants';

export type StatusCheckIn = 'PENDENTE' | 'CONFIRMADO' | 'CHECKOUT';

export interface Crianca {
  id: string;
  foto: string;
  nome: string;
  dataNascimento: string;
  sexo: Sexo;
  observacoes?: string;
  responsavelId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Responsavel {
  id: string;
  foto: string;
  cpf: string;
  nome: string;
  grauParentesco: string;
  telefone: string;
  endereco: string;
  email: string;
  criancasIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Tio {
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

export interface Culto {
  id: string;
  data: string;
  sala: Sala;
  criancasPresentes: CriancaPresente[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CriancaPresente {
  criancaId: string;
  checkIn: {
    horario: Date;
    responsavelId: string;
    fotoResponsavel: string;
    confirmadoPor: string;
    fotoServo: string;
  };
  checkOut?: {
    horario: Date;
    responsavelId: string;
    fotoResponsavel: string;
    confirmadoPor: string;
    fotoServo: string;
  };
  status: StatusCheckIn;
}

export interface Usuario {
  uid: string;
  email: string;
  tipo: TipoUsuario;
  nome: string;
  foto?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckInRequest {
  criancaId: string;
  responsavelId: string;
  cultoId: string;
}

export interface CheckOutRequest {
  criancaId: string;
  responsavelId: string;
  cultoId: string;
}

export interface ConfirmacaoCheckIn {
  criancaId: string;
  cultoId: string;
  servoId: string;
}

export interface ConfirmacaoCheckOut {
  criancaId: string;
  cultoId: string;
  servoId: string;
} 