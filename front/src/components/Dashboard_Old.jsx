import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { expensesAPI, categoriesAPI } from '../services/api';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Plus,
  CreditCard,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, expensesRes, categoriesRes] = await Promise.all([
        expensesAPI.getStats(),
        expensesAPI.getAll({ limit: 5, sortBy: 'date', sortOrder: 'DESC' }),
        categoriesAPI.getStats()
      ]);

      setStats(statsRes.data);
      setRecentExpenses(expensesRes.data.expenses);
      setCategoryStats(categoriesRes.data.slice(0, 4));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Gastado',
      value: stats?.totalAmount || 0,
      icon: DollarSign,
      color: 'bg-blue-500',
      formatted: formatCurrency(stats?.totalAmount || 0)
    },
    {
      title: 'Gastos Este Mes',
      value: stats?.totalExpenses || 0,
      icon: CreditCard,
      color: 'bg-green-500',
      formatted: `${stats?.totalExpenses || 0} gastos`
    },
    {
      title: 'Promedio por Gasto',
      value: stats?.averageExpense || 0,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      formatted: formatCurrency(stats?.averageExpense || 0)
    },
    {
      title: 'Gasto Máximo',
      value: stats?.maxExpense || 0,
      icon: ArrowUpRight,
      color: 'bg-red-500',
      formatted: formatCurrency(stats?.maxExpense || 0)
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="text-lg font-semibold text-gray-900">{card.formatted}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/expenses?action=new"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200"
          >
            <Plus className="h-8 w-8 text-gray-400 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Nuevo Gasto</p>
              <p className="text-sm text-gray-500">Agregar gasto rápido</p>
            </div>
          </Link>

          <Link
            to="/categories"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200"
          >
            <PieChart className="h-8 w-8 text-gray-400 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Categorías</p>
              <p className="text-sm text-gray-500">Gestionar categorías</p>
            </div>
          </Link>

          <Link
            to="/stats"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200"
          >
            <TrendingUp className="h-8 w-8 text-gray-400 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Estadísticas</p>
              <p className="text-sm text-gray-500">Ver reportes</p>
            </div>
          </Link>

          <Link
            to="/expenses"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200"
          >
            <Calendar className="h-8 w-8 text-gray-400 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Ver Gastos</p>
              <p className="text-sm text-gray-500">Historial completo</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Expenses */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Gastos Recientes</h3>
            <Link
              to="/expenses"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Ver todos →
            </Link>
          </div>
          <div className="space-y-3">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: expense.category_color }}
                      ></span>
                      <p className="text-xs text-gray-500">{expense.category_name}</p>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-500">{formatDate(expense.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-sm font-semibold text-red-600">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay gastos registrados aún</p>
                <Link
                  to="/expenses?action=new"
                  className="btn-primary mt-4 inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar primer gasto
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Top Categories */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Categorías Principales</h3>
          <div className="space-y-3">
            {categoryStats.length > 0 ? (
              categoryStats.map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <span
                      className="inline-block w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                    ></span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{category.name}</p>
                      <p className="text-xs text-gray-500">{category.expense_count} gastos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(category.total_spent)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay datos de categorías aún</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}