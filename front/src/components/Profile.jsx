import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Save,
  LogOut
} from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Aquí podrías implementar la actualización del perfil
      console.log('Updating profile:', formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Perfil</h2>
        <p className="text-gray-600">Gestiona tu información personal</p>
      </div>

      {/* Profile Card */}
      <div className="card max-w-2xl">
        <div className="flex items-center mb-6">
          <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-primary-600" />
          </div>
          <div className="ml-6">
            <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <div className="relative">
                <User className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className={`input-field pl-10 ${!isEditing ? 'bg-gray-50 text-gray-500' : ''}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className={`input-field pl-10 ${!isEditing ? 'bg-gray-50 text-gray-500' : ''}`}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Información de la cuenta</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Miembro desde</div>
                  <div className="text-sm font-medium text-gray-900">
                    {user?.created_at ? formatDate(user.created_at) : 'No disponible'}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <Shield className="h-4 w-4 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Estado de la cuenta</div>
                  <div className="text-sm font-medium text-green-600">Activa</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            {isEditing ? (
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar cambios
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Editar perfil
              </button>
            )}

            <button
              type="button"
              onClick={logout}
              className="btn-secondary text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </button>
          </div>
        </form>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">-</div>
          <div className="text-sm text-gray-500">Total gastado</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">-</div>
          <div className="text-sm text-gray-500">Gastos registrados</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">-</div>
          <div className="text-sm text-gray-500">Categorías creadas</div>
        </div>
      </div>
    </div>
  );
}