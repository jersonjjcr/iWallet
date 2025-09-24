import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../services/api';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Tag,
  Palette,
  TrendingUp,
  Calendar
} from 'lucide-react';

const predefinedColors = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
  '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
  '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
  '#EC4899', '#F43F5E', '#6B7280', '#374151', '#1F2937'
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    description: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, formData);
      } else {
        await categoriesAPI.create(formData);
      }
      await loadCategories();
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
      description: category.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (category) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la categoría "${category.name}"?`)) {
      return;
    }

    try {
      await categoriesAPI.delete(category.id);
      await loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('No se puede eliminar la categoría. Es posible que tenga gastos asociados.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#3B82F6',
      description: ''
    });
    setEditingCategory(null);
    setShowModal(false);
  };

  const getCategoryExpenseCount = (category) => {
    return Math.floor(Math.random() * 20 + 1); // Simulado
  };

  const getCategoryMonthlyTotal = (category) => {
    return Math.floor(Math.random() * 1000 + 100); // Simulado
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Categorías</h1>
              <p className="text-gray-600">Organiza y gestiona las categorías de tus gastos</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 sm:mt-0 flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-all shadow-sm min-h-[44px] touch-manipulation"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nueva Categoría
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando categorías...</p>
            </div>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center flex-1 min-w-0">
                    <div
                      className="w-12 h-12 rounded-xl mr-4 flex-shrink-0 shadow-sm border-2 border-white"
                      style={{ 
                        backgroundColor: category.color,
                        boxShadow: `0 0 0 1px ${category.color}20`
                      }}
                    ></div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="mb-4 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Este mes</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      ${getCategoryMonthlyTotal(category).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-blue-50 p-2 rounded-lg text-center">
                      <div className="font-semibold text-blue-800">{getCategoryExpenseCount(category)}</div>
                      <div className="text-blue-600">Gastos</div>
                    </div>
                    <div className="bg-purple-50 p-2 rounded-lg text-center">
                      <div className="font-semibold text-purple-800">${Math.floor(getCategoryMonthlyTotal(category) / getCategoryExpenseCount(category))}</div>
                      <div className="text-purple-600">Promedio</div>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center text-xs text-gray-400 mb-4">
                  <Calendar className="h-3 w-3 mr-1" />
                  Creada: {new Date(category.created_at || new Date()).toLocaleDateString('es-ES')}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all touch-manipulation group-hover:scale-110 min-h-[36px] min-w-[36px]"
                      title="Editar categoría"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all touch-manipulation group-hover:scale-110 min-h-[36px] min-w-[36px]"
                      title="Eliminar categoría"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    #{category.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Tag className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay categorías
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Crea tu primera categoría para empezar a organizar tus gastos de manera más efectiva.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-all shadow-sm min-h-[44px] touch-manipulation"
            >
              <Plus className="h-5 w-5 mr-2" />
              Crear primera categoría
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all touch-manipulation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la categoría
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base touch-manipulation"
                  placeholder="ej. Alimentación, Transporte..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base touch-manipulation resize-none"
                  rows={3}
                  placeholder="Descripción de la categoría..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Palette className="inline h-4 w-4 mr-1" />
                  Color de la categoría
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-12 h-12 rounded-lg border-2 transition-all touch-manipulation hover:scale-110 ${
                        formData.color === color
                          ? 'border-gray-900 shadow-lg scale-110'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                
                <div className="mt-4">
                  <label className="block text-xs text-gray-500 mb-1">Color personalizado</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer touch-manipulation"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all touch-manipulation min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-all touch-manipulation min-h-[44px]"
                >
                  {editingCategory ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}