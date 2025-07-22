'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCultos } from '@/hooks/useFirestore';
import { cultoSchema, type CultoFormData } from '@/lib/validations';
import {
  Button,
  Input,
  Select,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Alert,
} from '@/components/ui';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NovoCultoPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { create } = useCultos();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CultoFormData>({
    resolver: zodResolver(cultoSchema),
  });

  const onSubmit = async (data: CultoFormData) => {
    setLoading(true);
    setError('');

    try {
      const cultoData = {
        ...data,
        criancasPresentes: [],
        supervisor: '',
      };

      const id = await create(cultoData);
      if (id) {
        router.push('/cultos');
      } else {
        setError('Erro ao criar culto. Tente novamente.');
      }
    } catch {
      setError('Erro ao criar culto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const salaOptions = [
    { value: 'BABY', label: 'Baby (2-3 anos)' },
    { value: 'PRIMARIO', label: 'Primário (4-6 anos)' },
    { value: 'JARDIM', label: 'Jardim (7-8 anos)' },
    { value: 'TEENS', label: 'Teens (9-12 anos)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/cultos">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Novo Culto</h1>
            <p className="text-gray-600">Agende um novo culto no sistema</p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && <Alert variant="error">{error}</Alert>}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Culto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Data */}
              <Input
                label="Data do Culto"
                type="date"
                {...register('data')}
                error={errors.data?.message}
              />

              {/* Sala */}
              <Select
                label="Sala"
                options={salaOptions}
                {...register('sala')}
                error={errors.sala?.message}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link href="/cultos">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" loading={loading} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Agendar Culto
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
