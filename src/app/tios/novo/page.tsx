'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTios, useImageUpload } from '@/hooks/useFirestore';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Alert,
  ImageUpload,
} from '@/components/ui';
import { ArrowLeft, UserCheck, Save, Upload } from 'lucide-react';
import { tioSchema, type TioFormData } from '@/lib/validations';

type TioFormDataWithFoto = TioFormData & { foto?: string };
import Link from 'next/link';

export default function NovoTioPage() {
  const router = useRouter();
  const { create } = useTios();
  const { uploadImage } = useImageUpload();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TioFormDataWithFoto>({
    resolver: zodResolver(tioSchema),
    defaultValues: {
      criancasAutorizadasIds: [],
      foto: '',
    },
  });

  const watchedFoto = watch('foto');

  const handlePhotoUpload = async (file: File) => {
    if (!file) return null;

    setUploadingPhoto(true);
    try {
      const photoUrl = await uploadImage(
        file,
        `tios/${Date.now()}_${file.name}`
      );
      return photoUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      setError('Erro ao fazer upload da foto');
      return null;
    } finally {
      setUploadingPhoto(false);
    }
  };

  const onSubmit = async (data: TioFormData) => {
    setLoading(true);
    setError('');

    try {
      const tioId = await create({
        ...data,
        foto: (data as TioFormDataWithFoto).foto || '',
        criancasAutorizadasIds: data.criancasAutorizadasIds || [],
      });

      if (tioId) {
        router.push('/tios');
      } else {
        setError('Erro ao cadastrar tio');
      }
    } catch (error) {
      console.error('Erro ao cadastrar tio:', error);
      setError('Erro ao cadastrar tio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/tios">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Novo Tio</h1>
            <p className="text-gray-600">Cadastre um novo tio autorizado</p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && <Alert variant="error">{error}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário Principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Nome Completo"
                    {...register('nome')}
                    error={errors.nome?.message}
                    placeholder="Digite o nome completo"
                  />

                  <Input
                    label="CPF"
                    {...register('cpf')}
                    error={errors.cpf?.message}
                    placeholder="000.000.000-00"
                  />

                  <Input
                    label="Grau de Parentesco"
                    {...register('grauParentesco')}
                    error={errors.grauParentesco?.message}
                    placeholder="Ex: Tio, Tia, Avô, Avó"
                  />

                  <Input
                    label="Telefone"
                    {...register('telefone')}
                    error={errors.telefone?.message}
                    placeholder="(11) 99999-9999"
                  />

                  <Input
                    label="E-mail"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    placeholder="email@exemplo.com"
                  />

                  <Input
                    label="Endereço"
                    {...register('endereco')}
                    error={errors.endereco?.message}
                    placeholder="Rua, número, bairro, cidade"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Foto */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Foto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={watchedFoto}
                  onChange={(url) => setValue('foto', url)}
                  onUpload={handlePhotoUpload}
                  label="Foto do tio"
                />
              </CardContent>
            </Card>

            {/* Informações Adicionais */}
            <Card>
              <CardHeader>
                <CardTitle>Informações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-900">
                      Crianças Autorizadas
                    </p>
                    <p>Serão associadas posteriormente</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Permissões</p>
                    <p>Poderá retirar crianças autorizadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <Link href="/tios">
            <Button variant="outline">Cancelar</Button>
          </Link>
          <Button
            type="submit"
            loading={loading}
            disabled={loading || uploadingPhoto}
          >
            <Save className="h-4 w-4 mr-2" />
            Cadastrar Tio
          </Button>
        </div>
      </form>
    </div>
  );
}
