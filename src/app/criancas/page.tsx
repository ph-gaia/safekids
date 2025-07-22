'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCriancas } from '@/hooks/useFirestore';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Alert,
} from '@/components/ui';
import { Plus, Users, Edit, Trash2, Eye } from 'lucide-react';
import { formatDate, calculateAge, getSexoLabel } from '@/utils';
import { Crianca } from '@/types';

export default function CriancasPage() {
  const { data: criancas, loading, error, remove } = useCriancas();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta criança?')) return;

    setDeletingId(id);
    try {
      await remove(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando crianças...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crianças</h1>
          <p className="text-gray-600">
            Gerencie o cadastro de todas as crianças
          </p>
        </div>
        <Link href="/criancas/novo">
          <Button className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nova Criança
          </Button>
        </Link>
      </div>

      {/* Error Alert */}
      {error && <Alert variant="error">{error}</Alert>}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-50">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total de Crianças
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {criancas.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crianças List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Crianças</CardTitle>
        </CardHeader>
        <CardContent>
          {criancas.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma criança cadastrada
              </h3>
              <p className="text-gray-600 mb-6">
                Comece cadastrando a primeira criança no sistema.
              </p>
              <Link href="/criancas/novo">
                <Button>Cadastrar Primeira Criança</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Criança
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Idade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sexo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cadastrado em
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {criancas.map((crianca: Crianca) => (
                    <tr key={crianca.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={crianca.foto || '/placeholder-avatar.png'}
                            alt={crianca.nome}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {crianca.nome}
                            </div>
                            {crianca.observacoes && (
                              <div className="text-sm text-gray-500">
                                {crianca.observacoes}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {calculateAge(crianca.dataNascimento)} anos
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getSexoLabel(crianca.sexo)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(crianca.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/criancas/${crianca.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/criancas/${crianca.id}/editar`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(crianca.id)}
                            disabled={deletingId === crianca.id}
                            loading={deletingId === crianca.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
