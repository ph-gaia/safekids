'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTios } from '@/hooks/useFirestore';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Alert,
} from '@/components/ui';
import { Plus, UserCheck, Edit, Trash2, Eye, Phone, Mail } from 'lucide-react';
import { formatDate, formatCPF, formatPhone } from '@/utils';
import { Tio } from '@/types';

export default function TiosPage() {
  const { data: tios, loading, error, remove } = useTios();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este tio?')) return;

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
          <p className="mt-4 text-gray-600">Carregando tios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tios Autorizados</h1>
          <p className="text-gray-600">
            Gerencie o cadastro de tios autorizados para retirada
          </p>
        </div>
        <Link href="/tios/novo">
          <Button className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Novo Tio
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
              <div className="p-2 rounded-lg bg-purple-50">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total de Tios
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {tios.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tios List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Tios Autorizados</CardTitle>
        </CardHeader>
        <CardContent>
          {tios.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum tio cadastrado
              </h3>
              <p className="text-gray-600 mb-6">
                Comece cadastrando o primeiro tio autorizado no sistema.
              </p>
              <Link href="/tios/novo">
                <Button>Cadastrar Primeiro Tio</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CPF
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Crianças Autorizadas
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
                  {tios.map((tio: Tio) => (
                    <tr key={tio.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={tio.foto || '/placeholder-avatar.png'}
                            alt={tio.nome}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {tio.nome}
                            </div>
                            <div className="text-sm text-gray-500">
                              {tio.grauParentesco}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCPF(tio.cpf)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{formatPhone(tio.telefone)}</span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{tio.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tio.criancasAutorizadasIds?.length || 0} criança(s)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(tio.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/tios/${tio.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/tios/${tio.id}/editar`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(tio.id)}
                            disabled={deletingId === tio.id}
                            loading={deletingId === tio.id}
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
