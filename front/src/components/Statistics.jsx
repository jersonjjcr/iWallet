import React, { useState, useEffect } from 'react';
import { expensesAPI, categoriesAPI } from '../services/api';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  PieChart,
  BarChart3,
  Activity
} from 'lucide-react';

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month'); // month, year

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas generales
      const statsResponse = await expensesAPI.getStats();
      setStats(statsResponse.data);

      // Cargar estadísticas por categoría
      const categoryStatsResponse = await expensesAPI.getCategoryStats(period);
      setCategoryStats(categoryStatsResponse.data);

      // Cargar estadísticas mensuales
      const monthlyStatsResponse = await expensesAPI.getMonthlyStats();
      setMonthlyStats(monthlyStatsResponse.data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount || 0);
  };

  const getPercentageChange = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getLastMonthExpense = () => {
    if (monthlyStats.length < 2) return 0;
    return monthlyStats[monthlyStats.length - 2]?.total || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 animate-fade-in">
        <div className="animate-spin-slow rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const currentMonthChange = getPercentageChange(
    stats?.thisMonth || 0,
    getLastMonthExpense()
  );

  return (
    <div className="space-y-6 p-6 bg-primary min-h-screen animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-slide-in-down">
        <div className="animate-slide-in-left">
          <h2 className="text-2xl font-bold text-primary">Estadísticas</h2>
          <p className="text-secondary">Análisis detallado de tus gastos</p>
        </div>
        <div className="mt-4 sm:mt-0 animate-slide-in-right" style={{ animationDelay: '200ms' }}>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="input-field hover:shadow-md transition-all duration-300"
          >
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in-up" style={{ animationDelay: '400ms' }}>
        <div className="bg-secondary rounded-xl p-6 shadow-lg animate-scale-in" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-red-600 animate-float" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-secondary truncate">
                  Total Gastado
                </dt>
                <dd className="text-lg font-semibold text-primary animate-slide-in-right" style={{ animationDelay: '600ms' }}>
                  {formatCurrency(stats?.total)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-secondary rounded-xl p-6 shadow-lg animate-scale-in" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-blue-600 animate-float" style={{ animationDelay: '100ms' }} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-secondary truncate">
                  Este Mes
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-lg font-semibold text-primary animate-slide-in-right" style={{ animationDelay: '700ms' }}>
                    {formatCurrency(stats?.thisMonth)}
                  </div>
                  {currentMonthChange !== 0 && (
                    <div className={`ml-2 flex items-baseline text-sm font-semibold animate-bounce-gentle ${
                      currentMonthChange > 0 ? 'text-red-600' : 'text-green-600'
                    }`} style={{ animationDelay: '800ms' }}>
                      {currentMonthChange > 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(currentMonthChange).toFixed(1)}%
                    </div>
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-secondary rounded-xl p-6 shadow-lg animate-scale-in" style={{ animationDelay: '700ms' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-green-600 animate-float" style={{ animationDelay: '200ms' }} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-secondary truncate">
                  Promedio Mensual
                </dt>
                <dd className="text-lg font-semibold text-primary animate-slide-in-right" style={{ animationDelay: '800ms' }}>
                  {formatCurrency(stats?.avgPerMonth)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-secondary rounded-xl p-6 shadow-lg animate-scale-in" style={{ animationDelay: '800ms' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-purple-600 animate-float" style={{ animationDelay: '300ms' }} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-secondary truncate">
                  Total Gastos
                </dt>
                <dd className="text-lg font-semibold text-primary animate-slide-in-right" style={{ animationDelay: '900ms' }}>
                  {stats?.count || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in-up" style={{ animationDelay: '1000ms' }}>
        {/* Category Statistics */}
        <div className="bg-secondary rounded-xl p-6 shadow-lg animate-scale-in" style={{ animationDelay: '1100ms' }}>
          <div className="flex items-center justify-between mb-6 animate-slide-in-left" style={{ animationDelay: '1200ms' }}>
            <h3 className="text-lg font-medium text-primary">
              Gastos por Categoría
            </h3>
            <PieChart className="h-5 w-5 text-secondary animate-float" />
          </div>
          
          {categoryStats.length > 0 ? (
            <div className="space-y-4">
              {categoryStats.map((category, index) => {
                const percentage = (category.total / stats?.total) * 100;
                return (
                  <div key={category.category_id} className="flex items-center animate-slide-in-left" style={{ animationDelay: `${1300 + index * 100}ms` }}>
                    <div className="flex items-center flex-1">
                      <div
                        className="w-3 h-3 rounded-full mr-3 animate-pulse"
                        style={{ backgroundColor: category.category_color }}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-primary">
                            {category.category_name}
                          </span>
                          <span className="text-sm text-secondary animate-fade-in" style={{ animationDelay: `${1400 + index * 100}ms` }}>
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="w-full bg-tertiary rounded-full h-2 mr-3">
                            <div
                              className="h-2 rounded-full animate-fill-bar transition-all duration-1000 ease-out"
                              style={{
                                backgroundColor: category.category_color,
                                width: `${percentage}%`
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-primary whitespace-nowrap">
                            {formatCurrency(category.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <PieChart className="h-12 w-12 text-secondary mx-auto mb-4" />
              <p className="text-secondary">No hay datos de categorías disponibles</p>
            </div>
          )}
        </div>

        {/* Monthly Trend */}
        <div className="bg-secondary rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-primary">
              Tendencia Mensual
            </h3>
            <BarChart3 className="h-5 w-5 text-secondary" />
          </div>

          {monthlyStats.length > 0 ? (
            <div className="flex flex-col items-center">
              {/* Donut Chart */}
              <div className="relative w-64 h-64 mb-8">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="24"
                  />
                  
                  {/* Monthly segments */}
                  {(() => {
                    const recentMonths = monthlyStats.slice(-6);
                    const totalSum = recentMonths.reduce((sum, m) => sum + m.total, 0);
                    const colors = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
                    const circumference = 2 * Math.PI * 70;
                    let currentOffset = 0;
                    
                    return recentMonths.map((month, index) => {
                      const percentage = (month.total / totalSum) * 100;
                      const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                      const strokeDashoffset = -currentOffset;
                      currentOffset += (percentage / 100) * circumference;
                      
                      return (
                        <circle
                          key={month.month}
                          cx="100"
                          cy="100"
                          r="70"
                          fill="none"
                          stroke={colors[index % colors.length]}
                          strokeWidth="24"
                          strokeLinecap="round"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-1000 ease-out"
                          style={{
                            transform: 'rotate(-90deg)',
                            transformOrigin: '100px 100px',
                            opacity: 0,
                            animation: `fadeInSegment 0.8s ease-out ${index * 0.15}s forwards`
                          }}
                        />
                      );
                    });
                  })()}
                  
                  {/* Center content */}
                  <foreignObject x="50" y="50" width="100" height="100">
                    <div className="w-full h-full flex flex-col items-center justify-center text-center bg-tertiary rounded-full shadow-inner">
                      <div className="text-xl font-bold text-primary">
                        {formatCurrency(monthlyStats.slice(-6).reduce((sum, m) => sum + m.total, 0))}
                      </div>
                      <div className="text-xs text-secondary font-semibold">TOTAL</div>
                      <div className="text-xs text-secondary">6 meses</div>
                    </div>
                  </foreignObject>
                </svg>
              </div>
              
              {/* Legend */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                {monthlyStats.slice(-6).map((month, index) => {
                  const colors = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
                  const color = colors[index % colors.length];
                  const totalSum = monthlyStats.slice(-6).reduce((sum, m) => sum + m.total, 0);
                  const percentage = ((month.total / totalSum) * 100).toFixed(1);
                  
                  return (
                    <div key={month.month} className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border border-gray-200 shadow-sm">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 shadow-md border-2 border-white"
                        style={{ backgroundColor: color }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-primary truncate">
                            {new Date(month.month + '-01').toLocaleDateString('es-ES', { 
                              month: 'short', 
                              year: '2-digit' 
                            }).toUpperCase()}
                          </span>
                          <span className="text-xs text-white bg-primary px-2 py-1 rounded-full font-bold">
                            {percentage}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-primary font-bold">
                            {formatCurrency(month.total)}
                          </span>
                          <span className="text-xs text-secondary bg-tertiary px-2 py-1 rounded-full">
                            {month.count} gastos
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay datos mensuales disponibles</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      {stats && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Resumen del Período
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="border-r border-gray-200 last:border-r-0">
              <div className="text-2xl font-bold text-gray-900">
                {stats.count || 0}
              </div>
              <div className="text-sm text-gray-500">Total de gastos</div>
            </div>
            <div className="border-r border-gray-200 last:border-r-0">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency((stats.total || 0) / (stats.count || 1))}
              </div>
              <div className="text-sm text-gray-500">Gasto promedio</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {categoryStats.length}
              </div>
              <div className="text-sm text-gray-500">Categorías utilizadas</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}