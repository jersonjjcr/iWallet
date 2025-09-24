import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { settingsAPI } from '../services/api';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Moon, 
  Sun, 
  Globe, 
  Trash2, 
  Save, 
  Eye, 
  EyeOff, 
  Camera,
  Key,
  Download,
  Upload,
  AlertTriangle,
  Monitor,
  Loader2
} from 'lucide-react';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { theme, changeTheme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    expenses: true,
    budgets: true,
    reports: false,
    marketing: false
  });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [settings, setSettings] = useState({
    language: 'es',
    currency: 'USD',
    dateFormat: 'DD/MM/YYYY'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getSettings();
      const serverSettings = response.data;
      
      setSettings({
        language: serverSettings.language,
        currency: serverSettings.currency,
        dateFormat: serverSettings.dateFormat
      });
      
      setNotifications(serverSettings.notifications);
      
      // Sincronizar tema con el contexto
      if (serverSettings.theme !== theme) {
        changeTheme(serverSettings.theme);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await settingsAPI.updateSettings({
        theme,
        language: settings.language,
        currency: settings.currency,
        dateFormat: settings.dateFormat,
        notifications
      });
      
      alert('Configuraciones guardadas exitosamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error al guardar configuraciones');
    } finally {
      setSaving(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await settingsAPI.updateProfile({
        name: formData.name,
        email: formData.email
      });
      
      // Actualizar el contexto de usuario
      updateUser(response.data.user);
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.error || 'Error al actualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    try {
      setSaving(true);
      await settingsAPI.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      // Limpiar formulario
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      alert('Contraseña actualizada exitosamente');
    } catch (error) {
      console.error('Error changing password:', error);
      alert(error.response?.data?.error || 'Error al cambiar contraseña');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleExportData = () => {
    // Lógica para exportar datos
    console.log('Exporting data...');
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Lógica para importar datos
      console.log('Importing data from:', file.name);
    }
  };

  const handleDeleteAccount = () => {
    // Lógica para eliminar cuenta
    console.log('Deleting account...');
  };

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
    { id: 'security', name: 'Seguridad', icon: Shield },
    { id: 'appearance', name: 'Apariencia', icon: Palette },
    { id: 'data', name: 'Datos', icon: Download }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
          <p className="text-gray-600">Gestiona tu cuenta y preferencias de la aplicación</p>
        </div>

        {/* Mobile Tab Selector */}
        <div className="lg:hidden mb-6">
          <select 
            value={activeTab} 
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base touch-manipulation"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`} />
                      {tab.name}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6 sm:p-8">
                  <div className="flex items-center mb-8">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-10 w-10 text-gray-600" />
                      </div>
                      <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors touch-manipulation">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="ml-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {user?.name || 'Usuario'}
                      </h2>
                      <p className="text-gray-600">{user?.email}</p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre completo
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base touch-manipulation"
                          placeholder="Tu nombre completo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base touch-manipulation"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Idioma
                        </label>
                        <select 
                          value={settings.language}
                          onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base touch-manipulation"
                        >
                          <option value="es">Español</option>
                          <option value="en">English</option>
                          <option value="pt">Português</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Moneda
                        </label>
                        <select 
                          value={settings.currency}
                          onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base touch-manipulation"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="COP">COP ($)</option>
                          <option value="MXN">MXN ($)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-all touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-5 w-5 mr-2" />
                        )}
                        {saving ? 'Guardando...' : 'Guardar cambios'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Seguridad</h2>
                  
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña actual
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base touch-manipulation"
                          placeholder="Tu contraseña actual"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center touch-manipulation"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nueva contraseña
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.newPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base touch-manipulation"
                          placeholder="Nueva contraseña"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirmar contraseña
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base touch-manipulation"
                          placeholder="Confirmar nueva contraseña"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-all touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        ) : (
                          <Key className="h-5 w-5 mr-2" />
                        )}
                        {saving ? 'Cambiando...' : 'Cambiar contraseña'}
                      </button>
                    </div>
                  </form>

                  {/* Danger Zone */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-red-600 mb-4">Zona de peligro</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="font-medium text-red-800 mb-2">Eliminar cuenta</h4>
                      <p className="text-red-700 text-sm mb-4">
                        Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate.
                      </p>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-all touch-manipulation min-h-[44px]"
                      >
                        <Trash2 className="h-5 w-5 mr-2" />
                        Eliminar cuenta
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notificaciones</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-gray-200">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">Gastos nuevos</h3>
                        <p className="text-sm text-gray-500">Recibe notificaciones cuando agregues nuevos gastos</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('expenses')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors touch-manipulation ${
                          notifications.expenses ? 'bg-gray-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.expenses ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-200">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">Alertas de presupuesto</h3>
                        <p className="text-sm text-gray-500">Recibe alertas cuando te acerques al límite de tu presupuesto</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('budgets')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors touch-manipulation ${
                          notifications.budgets ? 'bg-gray-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.budgets ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-200">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">Reportes mensuales</h3>
                        <p className="text-sm text-gray-500">Recibe un resumen mensual de tus finanzas</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('reports')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors touch-manipulation ${
                          notifications.reports ? 'bg-gray-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.reports ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-4">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">Marketing y promociones</h3>
                        <p className="text-sm text-gray-500">Recibe información sobre nuevas funciones y ofertas</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('marketing')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors touch-manipulation ${
                          notifications.marketing ? 'bg-gray-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.marketing ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Apariencia</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Tema de la aplicación</h3>
                      <p className="text-sm text-gray-600 mb-6">
                        Personaliza la apariencia de iWallet según tus preferencias.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button
                          onClick={() => changeTheme('light')}
                          className={`group flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all touch-manipulation min-h-[120px] ${
                            theme === 'light' 
                              ? 'border-gray-900 bg-gray-50 shadow-md scale-105' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="p-3 bg-yellow-100 rounded-full mb-3 group-hover:bg-yellow-200 transition-colors">
                            <Sun className="h-6 w-6 text-yellow-600" />
                          </div>
                          <span className="font-medium text-gray-900">Claro</span>
                          <span className="text-xs text-gray-500 mt-1 text-center">Tema claro para uso diurno</span>
                        </button>

                        <button
                          onClick={() => changeTheme('dark')}
                          className={`group flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all touch-manipulation min-h-[120px] ${
                            theme === 'dark' 
                              ? 'border-gray-900 bg-gray-50 shadow-md scale-105' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="p-3 bg-slate-200 rounded-full mb-3 group-hover:bg-slate-300 transition-colors">
                            <Moon className="h-6 w-6 text-slate-700" />
                          </div>
                          <span className="font-medium text-gray-900">Oscuro</span>
                          <span className="text-xs text-gray-500 mt-1 text-center">Tema oscuro para uso nocturno</span>
                        </button>

                        <button
                          onClick={() => changeTheme('system')}
                          className={`group flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all touch-manipulation min-h-[120px] ${
                            theme === 'system' 
                              ? 'border-gray-900 bg-gray-50 shadow-md scale-105' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="p-3 bg-blue-100 rounded-full mb-3 group-hover:bg-blue-200 transition-colors">
                            <Monitor className="h-6 w-6 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">Sistema</span>
                          <span className="text-xs text-gray-500 mt-1 text-center">Sigue las preferencias del sistema</span>
                        </button>
                      </div>

                      {/* Theme Status */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-3 ${isDark ? 'bg-slate-600' : 'bg-yellow-500'}`}></div>
                            <span className="text-sm font-medium text-gray-700">
                              Estado actual: <span className="capitalize">{theme}</span>
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {isDark ? 'Modo oscuro activo' : 'Modo claro activo'}
                          </span>
                        </div>
                        
                        {theme === 'system' && (
                          <div className="mt-2 text-xs text-gray-500">
                            <Globe className="inline h-3 w-3 mr-1" />
                            Detectando automáticamente las preferencias de tu dispositivo
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Configuraciones adicionales</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Formato de fecha
                          </label>
                          <select 
                            value={settings.dateFormat}
                            onChange={(e) => setSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base touch-manipulation"
                          >
                            <option value="DD/MM/YYYY">DD/MM/YYYY (24/09/2025)</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY (09/24/2025)</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD (2025-09-24)</option>
                            <option value="DD-MM-YYYY">DD-MM-YYYY (24-09-2025)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Formato de moneda
                          </label>
                          <select 
                            value={settings.currency}
                            onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base touch-manipulation"
                          >
                            <option value="USD">Dólar estadounidense ($)</option>
                            <option value="EUR">Euro (€)</option>
                            <option value="COP">Peso colombiano ($)</option>
                            <option value="MXN">Peso mexicano ($)</option>
                            <option value="ARS">Peso argentino ($)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end pt-6">
                        <button
                          type="button"
                          onClick={saveSettings}
                          disabled={saving}
                          className="flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-all touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {saving ? (
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          ) : (
                            <Save className="h-5 w-5 mr-2" />
                          )}
                          {saving ? 'Guardando...' : 'Guardar preferencias'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Tab */}
              {activeTab === 'data' && (
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de datos</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Exportar datos</h3>
                      <p className="text-gray-600 mb-4">
                        Descarga todos tus datos en formato JSON para hacer respaldo o migrar a otra aplicación.
                      </p>
                      <button
                        onClick={handleExportData}
                        className="flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-all touch-manipulation min-h-[44px]"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Exportar datos
                      </button>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Importar datos</h3>
                      <p className="text-gray-600 mb-4">
                        Importa datos desde un archivo JSON previamente exportado.
                      </p>
                      <label className="flex items-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-all touch-manipulation min-h-[44px]">
                        <Upload className="h-5 w-5 mr-2 text-gray-600" />
                        <span className="text-gray-700">Seleccionar archivo</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportData}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">¿Eliminar cuenta?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 touch-manipulation min-h-[44px]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleDeleteAccount();
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 touch-manipulation min-h-[44px]"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}