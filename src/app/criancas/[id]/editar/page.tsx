'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { Crianca } from '@/types';
import Link from 'next/link';

export default function EditarCriancaPage() {
  const params = useParams();
  const router = useRouter();
  const { getById, update } = useCriancas();
  const { data: responsaveis } = useResponsaveis();
  const { uploadImage } = useImageUpload();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [crianca, setCrianca] = useState<Crianca | null>(null);

  const id = params.id as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CriancaFormData>({
    resolver: zodResolver(criancaSchema),
  });

  const foto = watch('foto');

  useEffect(() => {
    const fetchCrianca = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const criancaData = await getById(id);

        if (criancaData) {
          const criancaItem = criancaData as Crianca;
          setCrianca(criancaItem);

          // Preencher formulário
          reset({
            nome: criancaItem.nome,
            dataNascimento: criancaItem.dataNascimento,
            sexo: criancaItem.sexo,
            observacoes: criancaItem.observacoes,
            responsavelId: criancaItem.responsavelId,
            foto: criancaItem.foto,
          });
        } else {
          setError('Criança não encontrada');
        }
      } catch {
        setError('Erro ao carregar dados da criança');
      } finally {
        setLoading(false);
      }
    };

    fetchCrianca();
  }, [id, getById, reset]);

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const path = `criancas/${Date.now()}_${file.name}`;
    return uploadImage(file, path);
  };

  const onSubmit = async (data: CriancaFormData) => {
    if (!crianca) return;

    setSaving(true);
    setError('');

    try {
      const criancaData = {
        ...data,
        foto: foto || '',
      };

      const success = await update(crianca.id, criancaData);
      if (success) {
        router.push(`/criancas/${crianca.id}`);
      } else {
        setError('Erro ao atualizar criança. Tente novamente.');
      }
    } catch {
      setError('Erro ao atualizar criança. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const responsavelOptions = responsaveis.map((resp) => ({
    value: resp.id,
    label: resp.nome,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados da criança...</p>
        </div>
      </div>
    );
  }

  if (error || !crianca) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/criancas">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
        <Alert variant="error">{error || 'Criança não encontrada'}</Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/criancas/${crianca.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Criança</h1>
            <p className="text-gray-600">Atualize os dados de {crianca.nome}</p>
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
              <Link href={`/criancas/${crianca.id}`}>
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" loading={saving} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
