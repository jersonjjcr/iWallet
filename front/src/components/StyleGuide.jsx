import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Check,
  AlertCircle,
  Info,
  AlertTriangle,
  Star,
  Heart,
  Download,
  Upload,
  Search,
  Filter,
  Settings,
  User,
  Users,
  Bell,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Shield,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Home,
  Building,
  Car,
  Plane,
  Camera,
  Music,
  Book,
  Coffee,
  Gamepad2,
  Gift,
  ShoppingCart,
  Utensils,
  Dumbbell,
  Palette,
  Code,
  Briefcase,
  GraduationCap
} from 'lucide-react';

export default function StyleGuide() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('buttons');
  const [formData, setFormData] = useState({
    text: '',
    email: '',
    password: '',
    select: '',
    checkbox: false,
    radio: '',
    textarea: ''
  });

  const sampleData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', amount: 1250.50 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', amount: 875.25 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'pending', amount: 2100.00 },
  ];

  const categories = [
    { name: 'Comida', color: '#EF4444', icon: Utensils },
    { name: 'Transporte', color: '#3B82F6', icon: Car },
    { name: 'Entretenimiento', color: '#8B5CF6', icon: Music },
    { name: 'Salud', color: '#10B981', icon: Heart },
    { name: 'Trabajo', color: '#F59E0B', icon: Briefcase },
    { name: 'Educación', color: '#6366F1', icon: GraduationCap },
  ];

  const tabs = [
    { id: 'buttons', name: 'Botones' },
    { id: 'forms', name: 'Formularios' },
    { id: 'cards', name: 'Cards' },
    { id: 'badges', name: 'Badges' },
    { id: 'tables', name: 'Tablas' },
    { id: 'alerts', name: 'Alertas' },
    { id: 'stats', name: 'Estadísticas' },
    { id: 'icons', name: 'Iconos' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Guía de Estilos</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Demostración de todos los componentes y estilos disponibles en IWallet
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {/* Buttons */}
        {selectedTab === 'buttons' && (
          <div className="space-y-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-6">Botones Primarios</h3>
              <div className="flex flex-wrap gap-4 mb-6">
                <button className="btn-primary">Botón Primario</button>
                <button className="btn-primary btn-sm">Pequeño</button>
                <button className="btn-primary btn-lg">Grande</button>
                <button className="btn-primary" disabled>Deshabilitado</button>
              </div>
              
              <h4 className="text-lg font-medium mb-4">Con Iconos</h4>
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary"><Plus className="h-4 w-4 mr-2" />Agregar</button>
                <button className="btn-primary"><Save className="h-4 w-4 mr-2" />Guardar</button>
                <button className="btn-primary"><Download className="h-4 w-4 mr-2" />Descargar</button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-6">Botones Secundarios</h3>
              <div className="flex flex-wrap gap-4 mb-6">
                <button className="btn-secondary">Secundario</button>
                <button className="btn-danger">Peligro</button>
                <button className="btn-success">Éxito</button>
                <button className="btn-warning">Advertencia</button>
                <button className="btn-ghost">Fantasma</button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-6">Botones con Estados</h3>
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary">
                  <div className="spinner w-4 h-4 mr-2"></div>
                  Cargando...
                </button>
                <button className="btn-success">
                  <Check className="h-4 w-4 mr-2" />
                  Completado
                </button>
                <button className="btn-danger">
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Forms */}
        {selectedTab === 'forms' && (
          <div className="space-y-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-6">Campos de Formulario</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Texto Normal</label>
                  <input type="text" className="input-field" placeholder="Ingresa tu texto" />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" className="input-field" placeholder="tu@email.com" />
                </div>
                <div>
                  <label className="label">Contraseña</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label className="label">Número</label>
                  <input type="number" className="input-field" placeholder="123" />
                </div>
                <div>
                  <label className="label">Fecha</label>
                  <input type="date" className="input-field" />
                </div>
                <div>
                  <label className="label">Select</label>
                  <select className="input-field">
                    <option>Selecciona una opción</option>
                    <option>Opción 1</option>
                    <option>Opción 2</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-6">Estados de Campos</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Campo Normal</label>
                  <input type="text" className="input-field" placeholder="Campo normal" />
                  <p className="help-text">Texto de ayuda para el campo</p>
                </div>
                <div>
                  <label className="label">Campo con Error</label>
                  <input type="text" className="input-field input-error" placeholder="Campo con error" />
                  <p className="error-text">Este campo tiene un error</p>
                </div>
                <div>
                  <label className="label">Campo con Éxito</label>
                  <input type="text" className="input-field input-success" placeholder="Campo exitoso" />
                  <p className="text-sm text-success-600 mt-1">Campo completado correctamente</p>
                </div>
                <div>
                  <label className="label">Campo Deshabilitado</label>
                  <input type="text" className="input-field" disabled placeholder="Campo deshabilitado" />
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-6">Textarea y Checkboxes</h3>
              <div className="space-y-6">
                <div>
                  <label className="label">Descripción</label>
                  <textarea className="input-field" rows="4" placeholder="Escribe una descripción..."></textarea>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-900">Acepto los términos y condiciones</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" checked />
                    <span className="ml-2 text-sm text-gray-900">Recibir notificaciones por email</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cards */}
        {selectedTab === 'cards' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card">
                <h4 className="text-lg font-semibold mb-2">Card Básica</h4>
                <p className="text-gray-600">Esta es una card básica con contenido simple.</p>
              </div>
              
              <div className="card-compact">
                <h4 className="text-lg font-semibold mb-2">Card Compacta</h4>
                <p className="text-gray-600">Card con menos padding para espacios reducidos.</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <h4 className="text-lg font-semibold">Con Header</h4>
                </div>
                <p className="text-gray-600">Card con header separado por línea.</p>
                <div className="card-footer">
                  <button className="btn-primary btn-sm">Acción</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">John Doe</h4>
                    <p className="text-gray-600">Desarrollador Frontend</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Especialista en React y diseño de interfaces de usuario.
                </p>
                <div className="flex space-x-2">
                  <button className="btn-primary btn-sm">Contactar</button>
                  <button className="btn-secondary btn-sm">Ver Perfil</button>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">Estadísticas</h4>
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ventas</span>
                    <span className="font-semibold">$12,450</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Badges */}
        {selectedTab === 'badges' && (
          <div className="space-y-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-6">Badges de Estado</h3>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="badge-primary">Primario</span>
                <span className="badge-success">Éxito</span>
                <span className="badge-warning">Advertencia</span>
                <span className="badge-danger">Peligro</span>
                <span className="badge-gray">Neutral</span>
              </div>
              
              <h4 className="text-lg font-medium mb-4">Badges en Contexto</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Usuario Activo</span>
                  <span className="badge-success">Activo</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Pago Pendiente</span>
                  <span className="badge-warning">Pendiente</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Cuenta Suspendida</span>
                  <span className="badge-danger">Suspendido</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tables */}
        {selectedTab === 'tables' && (
          <div className="space-y-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-6">Tabla de Datos</h3>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Estado</th>
                      <th>Monto</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.map((item) => (
                      <tr key={item.id}>
                        <td className="font-medium">{item.name}</td>
                        <td>{item.email}</td>
                        <td>
                          <span className={`badge ${
                            item.status === 'active' ? 'badge-success' :
                            item.status === 'inactive' ? 'badge-danger' :
                            'badge-warning'
                          }`}>
                            {item.status === 'active' ? 'Activo' :
                             item.status === 'inactive' ? 'Inactivo' : 'Pendiente'}
                          </span>
                        </td>
                        <td className="font-semibold">${item.amount.toLocaleString()}</td>
                        <td>
                          <div className="flex space-x-2">
                            <button className="text-primary-600 hover:text-primary-900">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Alerts */}
        {selectedTab === 'alerts' && (
          <div className="space-y-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-6">Alertas y Notificaciones</h3>
              <div className="space-y-4">
                <div className="bg-primary-50 border border-primary-200 text-primary-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    <span>Esta es una alerta informativa.</span>
                  </div>
                </div>

                <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    <span>Operación completada exitosamente.</span>
                  </div>
                </div>

                <div className="bg-warning-50 border border-warning-200 text-warning-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <span>Advertencia: Revisa esta configuración.</span>
                  </div>
                </div>

                <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>Error: Algo salió mal.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {selectedTab === 'stats' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="stat-card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="stat-label">Ingresos Totales</div>
                    <div className="stat-value">$45,231</div>
                    <div className="stat-change positive">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +12.5%
                    </div>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-success-500 to-success-600 rounded-lg flex items-center justify-center shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="stat-label">Usuarios Activos</div>
                    <div className="stat-value">2,341</div>
                    <div className="stat-change positive">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +5.4%
                    </div>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-warning-500 to-warning-600 rounded-lg flex items-center justify-center shadow-lg">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="stat-label">Conversiones</div>
                    <div className="stat-value">12.3%</div>
                    <div className="stat-change negative">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      -2.1%
                    </div>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="stat-label">Meta del Mes</div>
                    <div className="stat-value">87%</div>
                    <div className="stat-change positive">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      En progreso
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h4 className="text-lg font-semibold mb-6">Categorías Populares</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 shadow-sm"
                        style={{ backgroundColor: category.color }}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">
                          {Math.floor(Math.random() * 50) + 10} gastos
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          ${(Math.random() * 1000 + 100).toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500">promedio</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Icons */}
        {selectedTab === 'icons' && (
          <div className="space-y-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-6">Iconos Disponibles</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4">
                {[
                  User, Mail, Phone, MapPin, Calendar, Clock, DollarSign, CreditCard,
                  TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Target,
                  Award, Shield, Lock, Unlock, Eye, EyeOff, Home, Building,
                  Car, Plane, Camera, Music, Book, Coffee, Gamepad2, Gift,
                  ShoppingCart, Utensils, Dumbbell, Palette, Code, Briefcase,
                  GraduationCap, Star, Heart, Plus, Edit2, Trash2, Save,
                  X, Check, AlertCircle, Info, AlertTriangle, Search,
                  Filter, Settings, Bell, Download, Upload
                ].map((Icon, index) => (
                  <div key={index} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                    <Icon className="h-6 w-6 text-gray-600 group-hover:text-primary-600 transition-colors" />
                    <span className="text-xs text-gray-500 mt-1 text-center">{Icon.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Button */}
      <div className="card text-center">
        <h3 className="text-xl font-semibold mb-4">Modal de Ejemplo</h3>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          Abrir Modal
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="modal-content max-w-md w-full p-6 animate-slide-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Modal de Ejemplo</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 focus-ring rounded-md"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Este es un modal de ejemplo que demuestra el diseño y la funcionalidad.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-primary"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}