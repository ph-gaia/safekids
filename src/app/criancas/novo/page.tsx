'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCriancas,
  useResponsaveis,
  useImageUpload,
} from '@/hooks/useFirestore';
import { criancaSchema, type CriancaFormData } from '@/lib/validations';
import {
  Button,
  Input,
  Select,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Alert,
  ImageUpload,
} from '@/components/ui';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NovaCriancaPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { create } = useCriancas();
  const { data: responsaveis } = useResponsaveis();
  const { uploadImage } = useImageUpload();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CriancaFormData>({
    resolver: zodResolver(criancaSchema),
  });

  const foto = watch('foto');

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const path = `criancas/${Date.now()}_${file.name}`;
    return uploadImage(file, path);
  };

  const onSubmit = async (data: CriancaFormData) => {
    setLoading(true);
    setError('');

    try {
      const criancaData = {
        ...data,
        foto: foto || '',
      };

      const id = await create(criancaData);
      if (id) {
        router.push('/criancas');
      } else {
        setError('Erro ao criar criança. Tente novamente.');
      }
    } catch {
      setError('Erro ao criar criança. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const responsavelOptions = responsaveis.map((resp) => ({
    value: resp.id,
    label: resp.nome,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/criancas">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nova Criança</h1>
            <p className="text-gray-600">
              Cadastre uma nova criança no sistema
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && <Alert variant="error">{error}</Alert>}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Dados da Criança</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Foto */}
              <div className="md:col-span-2">
                <ImageUpload
                  label="Foto da Criança"
                  value={foto}
                  onChange={(url) => setValue('foto', url)}
                  onUpload={handleImageUpload}
                  error={errors.foto?.message}
                />
              </div>

              {/* Nome */}
              <Input
                label="Nome Completo"
                {...register('nome')}
                error={errors.nome?.message}
                placeholder="Digite o nome completo"
              />

              {/* Data de Nascimento */}
              <Input
                label="Data de Nascimento"
                type="date"
                {...register('dataNascimento')}
                error={errors.dataNascimento?.message}
              />

              {/* Sexo */}
              <Select
                label="Sexo"
                options={[
                  { value: 'M', label: 'Masculino' },
                  { value: 'F', label: 'Feminino' },
                ]}
                {...register('sexo')}
                error={errors.sexo?.message}
              />

              {/* Responsável */}
              <Select
                label="Responsável"
                options={responsavelOptions}
                {...register('responsavelId')}
                error={errors.responsavelId?.message}
              />

              {/* Observações */}
              <div className="md:col-span-2">
                <Input
                  label="Observações"
                  {...register('observacoes')}
                  error={errors.observacoes?.message}
                  placeholder="Observações importantes sobre a criança"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link href="/criancas">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" loading={loading} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Criança
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
