'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Clock,
  AlertTriangle
} from 'lucide-react';
import { formatDate } from '@/utils';

interface DashboardStats {
  totalCriancas: number;
  totalResponsaveis: number;
  totalTios: number;
  cultosHoje: number;
  checkInsPendentes: number;
  checkOutsPendentes: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCriancas: 0,
    totalResponsaveis: 0,
    totalTios: 0,
    cultosHoje: 0,
    checkInsPendentes: 0,
    checkOutsPendentes: 0,
  });

  useEffect(() => {
    // TODO: Implementar busca de estatísticas do Firebase
    // Por enquanto, usando dados mockados
    setStats({
      totalCriancas: 45,
      totalResponsaveis: 32,
      totalTios: 15,
      cultosHoje: 2,
      checkInsPendentes: 8,
      checkOutsPendentes: 3,
    });
  }, []);

  const statCards = [
    {
      title: 'Total de Crianças',
      value: stats.totalCriancas,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Responsáveis',
      value: stats.totalResponsaveis,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Tios Autorizados',
      value: stats.totalTios,
      icon: UserCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Cultos Hoje',
      value: stats.cultosHoje,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const alertCards = [
    {
      title: 'Check-ins Pendentes',
      value: stats.checkInsPendentes,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Aguardando confirmação dos servos',
    },
    {
      title: 'Check-outs Pendentes',
      value: stats.checkOutsPendentes,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Aguardando retirada das crianças',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Bem-vindo de volta, {user?.nome}! Aqui está um resumo do sistema.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {alertCards.map((alert) => {
          const Icon = alert.icon;
          return (
            <Card key={alert.title} className="border-l-4 border-l-yellow-400">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${alert.bgColor}`}>
                    <Icon className={`h-6 w-6 ${alert.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {alert.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {alert.value}
                    </p>
                    <p className="text-sm text-gray-500">
                      {alert.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Check-in confirmado
                </p>
                <p className="text-sm text-gray-500">
                  Maria Silva confirmou presença de João Silva
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(new Date())}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Nova criança cadastrada
                </p>
                <p className="text-sm text-gray-500">
                  Ana Costa foi adicionada ao sistema
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(new Date())}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Check-out solicitado
                </p>
                <p className="text-sm text-gray-500">
                  Pedro Santos solicitou retirada de Sofia Santos
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(new Date())}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 