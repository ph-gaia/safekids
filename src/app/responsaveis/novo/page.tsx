'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResponsaveis, useImageUpload } from '@/hooks/useFirestore';
import { responsavelSchema, type ResponsavelFormData } from '@/lib/validations';
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Alert,
  ImageUpload,
} from '@/components/ui';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NovoResponsavelPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { create } = useResponsaveis();
  const { uploadImage } = useImageUpload();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ResponsavelFormData>({
    resolver: zodResolver(responsavelSchema),
  });

  const foto = watch('foto');

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const path = `responsaveis/${Date.now()}_${file.name}`;
    return uploadImage(file, path);
  };

  const onSubmit = async (data: ResponsavelFormData) => {
    setLoading(true);
    setError('');

    try {
      const responsavelData = {
        ...data,
        foto: foto || '',
        criancasIds: [],
      };

      const id = await create(responsavelData);
      if (id) {
        router.push('/responsaveis');
      } else {
        setError('Erro ao criar responsável. Tente novamente.');
      }
    } catch {
      setError('Erro ao criar responsável. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/responsaveis">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Novo Responsável
            </h1>
            <p className="text-gray-600">
              Cadastre um novo responsável no sistema
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && <Alert variant="error">{error}</Alert>}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Responsável</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Foto */}
              <div className="md:col-span-2">
                <ImageUpload
                  label="Foto do Responsável"
                  value={foto}
                  onChange={(url) => setValue('foto', url)}
                  onUpload={handleImageUpload}
                  error={errors.foto?.message}
                />
              </div>

              {/* CPF */}
              <Input
                label="CPF"
                {...register('cpf')}
                error={errors.cpf?.message}
                placeholder="000.000.000-00"
              />

              {/* Nome */}
              <Input
                label="Nome Completo"
                {...register('nome')}
                error={errors.nome?.message}
                placeholder="Digite o nome completo"
              />

              {/* Grau de Parentesco */}
              <Input
                label="Grau de Parentesco"
                {...register('grauParentesco')}
                error={errors.grauParentesco?.message}
                placeholder="Ex: Pai, Mãe, Avô, etc."
              />

              {/* Telefone */}
              <Input
                label="Telefone"
                {...register('telefone')}
                error={errors.telefone?.message}
                placeholder="(00) 00000-0000"
              />

              {/* Email */}
              <Input
                label="E-mail"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="seu@email.com"
              />

              {/* Endereço */}
              <div className="md:col-span-2">
                <Input
                  label="Endereço Completo"
                  {...register('endereco')}
                  error={errors.endereco?.message}
                  placeholder="Rua, número, bairro, cidade - estado"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link href="/responsaveis">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" loading={loading} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Responsável
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
