'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCriancas, useResponsaveis, useTios } from '@/hooks/useFirestore';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Alert,
  Modal,
  Select,
} from '@/components/ui';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Plus,
  Users,
  UserCheck,
} from 'lucide-react';
import { formatDate } from '@/utils';
import { Crianca, Responsavel, Tio } from '@/types';
import Link from 'next/link';

export default function CriancaDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const { getById, remove } = useCriancas();
  const { data: responsaveis } = useResponsaveis();
  const { data: tios } = useTios();

  const [crianca, setCrianca] = useState<Crianca | null>(null);
  const [criancaResponsaveis, setCriancaResponsaveis] = useState<Responsavel[]>(
    []
  );
  const [criancaTios, setCriancaTios] = useState<Tio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [deleting, setDeleting] = useState(false);

  // Estados para modais
  const [showAddResponsavel, setShowAddResponsavel] = useState(false);
  const [showAddTio, setShowAddTio] = useState(false);
  const [selectedResponsavelId, setSelectedResponsavelId] = useState('');
  const [selectedTioId, setSelectedTioId] = useState('');

  const id = params.id as string;

  useEffect(() => {
    const fetchCrianca = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const criancaData = await getById(id);

        if (criancaData) {
          setCrianca(criancaData as Crianca);
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
  }, [id, getById]);

  // Efeito separado para buscar responsáveis e tios quando a criança for carregada
  useEffect(() => {
    if (!crianca) return;

    // Buscar responsáveis da criança
    const responsaveisDaCrianca = responsaveis.filter((r) =>
      r.criancasIds.includes(crianca.id)
    );
    setCriancaResponsaveis(responsaveisDaCrianca);

    // Buscar tios autorizados da criança
    const tiosDaCrianca = tios.filter((t) =>
      t.criancasAutorizadasIds.includes(crianca.id)
    );
    setCriancaTios(tiosDaCrianca);
  }, [crianca, responsaveis, tios]);

  const handleDelete = async () => {
    if (!crianca || !confirm('Tem certeza que deseja excluir esta criança?'))
      return;

    setDeleting(true);
    try {
      const success = await remove(crianca.id);
      if (success) {
        router.push('/criancas');
      } else {
        setError('Erro ao excluir criança');
      }
    } catch {
      setError('Erro ao excluir criança');
    } finally {
      setDeleting(false);
    }
  };

  const handleAddResponsavel = () => {
    setShowAddResponsavel(true);
  };

  const handleAddTio = () => {
    setShowAddTio(true);
  };

  const handleConfirmAddResponsavel = async () => {
    if (!selectedResponsavelId || !crianca) return;

    try {
      // TODO: Implementar lógica para adicionar responsável à criança
      console.log(
        'Adicionar responsável:',
        selectedResponsavelId,
        'à criança:',
        crianca.id
      );
      setShowAddResponsavel(false);
      setSelectedResponsavelId('');
    } catch (error) {
      console.error('Erro ao adicionar responsável:', error);
    }
  };

  const handleConfirmAddTio = async () => {
    if (!selectedTioId || !crianca) return;

    try {
      // TODO: Implementar lógica para adicionar tio à criança
      console.log('Adicionar tio:', selectedTioId, 'à criança:', crianca.id);
      setShowAddTio(false);
      setSelectedTioId('');
    } catch (error) {
      console.error('Erro ao adicionar tio:', error);
    }
  };

  // Filtrar responsáveis que ainda não estão associados à criança
  const responsaveisDisponiveis = responsaveis.filter(
    (r) => !r.criancasIds.includes(crianca?.id || '')
  );

  // Filtrar tios que ainda não estão autorizados para a criança
  const tiosDisponiveis = tios.filter(
    (t) => !t.criancasAutorizadasIds.includes(crianca?.id || '')
  );

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
          <Link href="/criancas">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/criancas/${crianca.id}/editar`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={deleting}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      {/* Nome da Criança e Botão Check-in */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{crianca.nome}</h1>
        <Button className="bg-green-600 hover:bg-green-700">
          <Calendar className="h-4 w-4 mr-2" />
          Fazer Check-in
        </Button>
      </div>

      {/* Informações Básicas */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <p className="text-gray-900">{crianca.nome}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de nascimento
              </label>
              <p className="text-gray-900">
                {formatDate(crianca.dataNascimento)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <p className="text-gray-900">
                {crianca.observacoes || 'Nada a declarar.'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sala
              </label>
              <p className="text-gray-900">Refukids 2</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção Responsáveis */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Responsáveis
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleAddResponsavel}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {criancaResponsaveis.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      E-mail
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grau Parentesco
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {criancaResponsaveis.map((responsavel) => (
                    <tr key={responsavel.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {responsavel.nome}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {responsavel.telefone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {responsavel.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {responsavel.grauParentesco}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Nenhum responsável cadastrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seção Tios */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <UserCheck className="h-5 w-5 mr-2" />
              Tios
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleAddTio}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {criancaTios.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      E-mail
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grau Parentesco
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {criancaTios.map((tio) => (
                    <tr key={tio.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {tio.nome}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tio.telefone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tio.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tio.grauParentesco}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Nenhum tio cadastrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Adicionar Responsável */}
      <Modal
        isOpen={showAddResponsavel}
        onClose={() => setShowAddResponsavel(false)}
        title="Adicionar Responsável"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione um responsável
            </label>
            <Select
              value={selectedResponsavelId}
              onChange={(e) => setSelectedResponsavelId(e.target.value)}
              options={responsaveisDisponiveis.map((responsavel) => ({
                value: responsavel.id,
                label: `${responsavel.nome} - ${responsavel.grauParentesco}`,
              }))}
            />
          </div>

          {responsaveisDisponiveis.length === 0 && (
            <Alert variant="error">
              Todos os responsáveis já estão associados a esta criança.
            </Alert>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddResponsavel(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmAddResponsavel}
              disabled={!selectedResponsavelId}
            >
              Adicionar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Adicionar Tio */}
      <Modal
        isOpen={showAddTio}
        onClose={() => setShowAddTio(false)}
        title="Adicionar Tio"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione um tio
            </label>
            <Select
              value={selectedTioId}
              onChange={(e) => setSelectedTioId(e.target.value)}
              options={tiosDisponiveis.map((tio) => ({
                value: tio.id,
                label: `${tio.nome} - ${tio.grauParentesco}`,
              }))}
            />
          </div>

          {tiosDisponiveis.length === 0 && (
            <Alert variant="error">
              Todos os tios já estão autorizados para esta criança.
            </Alert>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowAddTio(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmAddTio} disabled={!selectedTioId}>
              Adicionar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
