import React, { useState, useEffect } from 'react';
import { Download, Loader2, X, Maximize2, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

interface NailDesign {
  ID: string;
  Prompt: string;
  imagenUrl: string;
  creadoEn: string;
}

interface ModalProps {
  design: NailDesign;
  onClose: () => void;
  onDownload: (id: string) => Promise<void>;
  onDelete: (id: string) => void;
}

const ImageModal: React.FC<ModalProps> = ({ design, onClose, onDownload, onDelete }) => {
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<'image' | 'details'>('image');

  const handleDownloadClick = async () => {
    setDownloading(true);
    await onDownload(design.ID);
    setDownloading(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="md:hidden flex items-center justify-center border-b border-red-100 bg-white">
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'image' 
                ? 'text-red-600 border-b-2 border-red-600' 
                : 'text-gray-500'
            }`}
          >
            Imagen
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'details' 
                ? 'text-red-600 border-b-2 border-red-600' 
                : 'text-gray-500'
            }`}
          >
            Detalles
          </button>
        </div>

        <div className="hidden md:flex absolute top-4 right-4 z-10 gap-2">
          <button
            onClick={() => onDelete(design.ID)}
            className="p-2 bg-white/90 hover:bg-white rounded-full text-red-600 transition-colors shadow-lg"
            title="Eliminar imagen"
          >
            <Trash2 className="w-6 h-6" />
          </button>
          <button
            onClick={handleDownloadClick}
            disabled={downloading}
            className="p-2 bg-white/90 hover:bg-white rounded-full text-red-600 transition-colors shadow-lg disabled:opacity-50"
            title="Descargar imagen"
          >
            {downloading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Download className="w-6 h-6" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-white/90 hover:bg-white rounded-full text-red-600 transition-colors shadow-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          <div 
            className={`relative bg-red-50 flex items-center justify-center p-4 ${
              activeTab === 'details' ? 'hidden md:flex' : 'flex'
            }`}
          >
            <img
              src={design.imagenUrl}
              alt={design.Prompt}
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
            />
          </div>

          <div 
            className={`p-6 overflow-y-auto ${
              activeTab === 'image' ? 'hidden md:block' : 'block'
            }`}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Nail prompt</h3>
                <p className="text-red-600 whitespace-pre-wrap">{design.Prompt}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Fecha de Creación</h3>
                <p className="text-red-600">
                  {new Date(design.creadoEn).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden fixed bottom-4 left-0 right-0 flex justify-center items-center gap-3">
          <button
            onClick={() => setActiveTab('image')}
            className={`p-2 rounded-full ${
              activeTab === 'image'
                ? 'bg-red-600 text-white'
                : 'bg-white text-red-600'
            } shadow-lg`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => onDelete(design.ID)}
            className="p-2 bg-white rounded-full text-red-600 shadow-lg"
            title="Eliminar imagen"
          >
            <Trash2 className="w-6 h-6" />
          </button>

          <button
            onClick={handleDownloadClick}
            disabled={downloading}
            className="p-2 bg-white rounded-full text-red-600 shadow-lg disabled:opacity-50"
            title="Descargar imagen"
          >
            {downloading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Download className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={onClose}
            className="p-2 bg-white rounded-full text-red-600 shadow-lg"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`p-2 rounded-full ${
              activeTab === 'details'
                ? 'bg-red-600 text-white'
                : 'bg-white text-red-600'
            } shadow-lg`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

function Gallery() {
  const [designs, setDesigns] = useState<NailDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDesign, setSelectedDesign] = useState<NailDesign | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    designId: string | null;
  }>({
    isOpen: false,
    designId: null
  });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchDesigns();
  }, [sortOrder]);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.neoglow.net/webhook/isabela/fetch-nails?sort=${sortOrder}`, {
        headers: {
          'apikey': 'O2WJWuNAH4VamJIy'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      if (!responseData[0]?.data) {
        throw new Error('API response does not contain data array');
      }

      setDesigns(responseData[0].data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Gallery error:', errorMessage);
      setError(`Failed to load nail designs: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      
      const response = await fetch('https://api.neoglow.net/webhook/isabela/delete-image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'O2WJWuNAH4VamJIy'
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      setDesigns(designs.filter(design => design.ID !== id));
      
      if (selectedDesign?.ID === id) {
        setSelectedDesign(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Error al eliminar la imagen. Por favor intenta de nuevo.');
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      setDownloading(id);
      
      const response = await fetch('https://api.neoglow.net/webhook/isabela/download-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'O2WJWuNAH4VamJIy'
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        throw new Error('Failed to download image');
      }

      const data = await response.json();
      
      const base64Data = data.base64.replace(/^data:image\/\w+;base64,/, '');
      
      try {
        const byteString = atob(base64Data);
        const mimeString = 'image/png';
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        
        const blob = new Blob([ab], { type: mimeString });
        
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `nail-design-${id}.png`;
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          window.URL.revokeObjectURL(downloadUrl);
          document.body.removeChild(link);
        }, 100);
      } catch (error) {
        console.error('Error processing base64:', error);
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${base64Data}`;
        link.download = `nail-design-${id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Download error:', err);
      setError('Error al descargar la imagen. Por favor intenta de nuevo.');
    } finally {
      setDownloading(null);
    }
  };

  const openDeleteConfirmation = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      designId: id
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-12">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => {
            setError('');
            setLoading(true);
            fetchDesigns();
          }}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (designs.length === 0) {
    return (
      <div className="text-center p-12">
        <p className="text-red-600">No hay diseños disponibles en este momento.</p>
        <button 
          onClick={() => {
            setLoading(true);
            fetchDesigns();
          }}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Actualizar
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <label htmlFor="sortOrder" className="text-red-700 mr-2">
          Ordenar por:
        </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="px-4 py-2 rounded-lg border border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors"
        >
          <option value="desc">Más Reciente</option>
          <option value="asc">Más Antiguo</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {designs.map((design) => (
          <div key={design.ID + design.creadoEn} className="bg-white rounded-xl shadow-lg overflow-hidden group">
            <div className="relative">
              <div className="aspect-square overflow-hidden bg-red-50">
                <img
                  src={design.imagenUrl}
                  alt={design.Prompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
                  }}
                />
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setSelectedDesign(design)}
                  className="bg-white hover:bg-red-50 text-red-600 p-3 rounded-full shadow-lg transition-colors"
                  title="Ver en grande"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => openDeleteConfirmation(design.ID)}
                  disabled={deleting === design.ID}
                  className="bg-white hover:bg-red-50 text-red-600 p-3 rounded-full shadow-lg transition-colors disabled:opacity-50"
                  title="Eliminar"
                >
                  {deleting === design.ID ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => handleDownload(design.ID)}
                  disabled={downloading === design.ID}
                  className="bg-white hover:bg-red-50 text-red-600 p-3 rounded-full shadow-lg transition-colors disabled:opacity-50"
                  title="Descargar"
                >
                  {downloading === design.ID ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-red-600 line-clamp-2">{design.Prompt}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(design.creadoEn).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedDesign && (
        <ImageModal 
          design={selectedDesign} 
          onClose={() => setSelectedDesign(null)}
          onDownload={handleDownload}
          onDelete={() => openDeleteConfirmation(selectedDesign.ID)}
        />
      )}

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, designId: null })}
        onConfirm={() => {
          if (deleteConfirmation.designId) {
            handleDelete(deleteConfirmation.designId);
          }
          setDeleteConfirmation({ isOpen: false, designId: null });
        }}
        title="Eliminar imagen"
        message="¿Estás seguro de que quieres eliminar esta imagen? Esta acción no se puede deshacer."
      />
    </>
  );
}

export default Gallery;
