import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { expensesAPI, categoriesAPI } from '../services/api';
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Calendar,
  Activity,
  ArrowUpRight,
  Plus,
  PieChart,
  BarChart3,
  Target
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('Month');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
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
      <div className="flex items-center justify-center min-h-96 animate-fade-in">
        <div className="spinner w-8 h-8 animate-spin-slow"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-primary min-h-screen animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between animate-slide-in">
        <div>
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          <p className="text-secondary mt-1">Resumen de tus finanzas personales</p>
        </div>
        <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Period Selector */}
          <div className="flex items-center space-x-1 bg-secondary rounded-lg p-1 border-theme">
            {['Día', 'Semana', 'Mes', 'Año'].map((period, index) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  selectedPeriod === period
                    ? 'btn-primary text-white'
                    : 'text-secondary hover:text-primary hover:bg-tertiary'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in">
        {/* Total Gastado Card */}
        <div className="bg-primary rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-200">Total Gastado</h3>
            <DollarSign className="h-5 w-5 text-gray-300" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold">{formatCurrency(stats?.totalAmount || 0)}</span>
          </div>
          <div className="flex items-center mt-3">
            <TrendingUp className="h-4 w-4 text-green-300 mr-1" />
            <span className="text-sm text-green-300">Este mes</span>
          </div>
        </div>

        {/* Total Gastos */}
        <div className="card bg-secondary rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-secondary">Total Gastos</h3>
            <CreditCard className="h-5 w-5 text-secondary" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-primary">{stats?.totalExpenses || 0}</span>
          </div>
          <div className="flex items-center mt-3">
            <Activity className="h-4 w-4 text-blue-400 mr-1" />
            <span className="text-sm text-blue-400">transacciones</span>
          </div>
        </div>

        {/* Promedio por Gasto */}
        <div className="card bg-secondary rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-secondary">Promedio</h3>
            <TrendingUp className="h-5 w-5 text-secondary" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-primary">{formatCurrency(stats?.averageExpense || 0)}</span>
          </div>
          <div className="flex items-center mt-3">
            <Target className="h-4 w-4 text-yellow-600 mr-1" />
            <span className="text-sm text-yellow-600">por transacción</span>
          </div>
        </div>

        {/* Gasto Máximo */}
        <div className="card-modern bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-scale-in" style={{ animationDelay: '800ms' }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Gasto Máximo</h3>
            <ArrowUpRight className="h-5 w-5 text-gray-400 animate-float" style={{ animationDelay: '300ms' }} />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900 animate-slide-in-right" style={{ animationDelay: '900ms' }}>{formatCurrency(stats?.maxExpense || 0)}</span>
          </div>
          <div className="flex items-center mt-3 animate-fade-in" style={{ animationDelay: '1000ms' }}>
            <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
            <span className="text-sm text-red-600">mayor registro</span>
          </div>
        </div>
      </div>

      {/* Recent Expenses and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in-up" style={{ animationDelay: '1100ms' }}>
        {/* Recent Expenses */}
        <div className="card-modern bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-scale-in" style={{ animationDelay: '1200ms' }}>
          <div className="flex items-center justify-between mb-6 animate-slide-in-left" style={{ animationDelay: '1300ms' }}>
            <h3 className="text-lg font-semibold text-gray-900">Gastos Recientes</h3>
            <Link to="/expenses" className="link-elegant text-sm text-blue-600 hover:text-blue-700 flex items-center hover:animate-lift-gentle">
              Ver todos
              <ArrowUpRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense, index) => (
                <div key={expense.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-sm hover:scale-[1.01] animate-slide-in-left" style={{ animationDelay: `${1400 + index * 100}ms` }}>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center animate-pulse-gentle">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className="inline-block w-3 h-3 rounded-full animate-pulse"
                          style={{ backgroundColor: expense.category_color }}
                        ></span>
                        <p className="text-xs text-gray-500">{expense.category_name}</p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500">{formatDate(expense.date)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 animate-slide-in-right" style={{ animationDelay: `${1500 + index * 100}ms` }}>{formatCurrency(expense.amount)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 animate-fade-in" style={{ animationDelay: '1400ms' }}>
                <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4 animate-float" />
                <p className="text-gray-500 mb-4 animate-fade-in" style={{ animationDelay: '1500ms' }}>No hay gastos registrados aún</p>
                <Link
                  to="/expenses?action=new"
                  className="btn-primary inline-flex items-center animate-bounce-gentle"
                  style={{ animationDelay: '1600ms' }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar primer gasto
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Top Categories */}
        <div className="card-modern bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-scale-in" style={{ animationDelay: '1300ms' }}>
          <div className="flex items-center justify-between mb-6 animate-slide-in-right" style={{ animationDelay: '1400ms' }}>
            <h3 className="text-lg font-semibold text-gray-900">Categorías Principales</h3>
            <Link to="/categories" className="link-elegant text-sm text-blue-600 hover:text-blue-700 flex items-center hover:animate-lift-gentle">
              Ver todas
              <ArrowUpRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {categoryStats.length > 0 ? (
              categoryStats.map((category, index) => (
                <div key={category.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-sm hover:scale-[1.01] animate-slide-in-right" style={{ animationDelay: `${1500 + index * 100}ms` }}>
                  <div className="flex items-center space-x-3">
                    <span
                      className="inline-block w-4 h-4 rounded-full flex-shrink-0 animate-pulse"
                      style={{ backgroundColor: category.color }}
                    ></span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{category.name}</p>
                      <p className="text-xs text-gray-500">{category.expense_count} gastos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 animate-slide-in-left" style={{ animationDelay: `${1600 + index * 100}ms` }}>
                      {formatCurrency(category.total_spent)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 animate-fade-in" style={{ animationDelay: '1500ms' }}>
                <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-4 animate-float" />
                <p className="text-gray-500 mb-4">No hay datos de categorías aún</p>
                <Link
                  to="/categories"
                  className="btn-primary inline-flex items-center animate-bounce-gentle"
                  style={{ animationDelay: '1600ms' }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear categorías
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-modern bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-slide-in-up" style={{ animationDelay: '1700ms' }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 animate-fade-in" style={{ animationDelay: '1800ms' }}>Acciones Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/expenses?action=new"
            className="quick-action-card flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group hover:shadow-md hover:scale-105 animate-scale-in"
            style={{ animationDelay: '1900ms' }}
          >
            <Plus className="h-8 w-8 text-gray-400 group-hover:text-blue-600 mr-3 transition-all duration-200 group-hover:rotate-90" />
            <div>
              <p className="font-medium text-gray-900 group-hover:text-blue-900">Nuevo Gasto</p>
              <p className="text-sm text-gray-500">Registrar transacción</p>
            </div>
          </Link>

          <Link
            to="/categories"
            className="quick-action-card flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group hover:shadow-md hover:scale-105 animate-scale-in"
            style={{ animationDelay: '2000ms' }}
          >
            <PieChart className="h-8 w-8 text-gray-400 group-hover:text-blue-600 mr-3 transition-all duration-200 group-hover:rotate-12" />
            <div>
              <p className="font-medium text-gray-900 group-hover:text-blue-900">Categorías</p>
              <p className="text-sm text-gray-500">Gestionar etiquetas</p>
            </div>
          </Link>

          <Link
            to="/stats"
            className="quick-action-card flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group hover:shadow-md hover:scale-105 animate-scale-in"
            style={{ animationDelay: '2100ms' }}
          >
            <BarChart3 className="h-8 w-8 text-gray-400 group-hover:text-blue-600 mr-3 transition-all duration-200 group-hover:animate-wiggle" />
            <div>
              <p className="font-medium text-gray-900 group-hover:text-blue-900">Estadísticas</p>
              <p className="text-sm text-gray-500">Ver reportes</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}