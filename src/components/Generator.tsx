import React, { useState } from 'react';
import { Download, Loader2, Wand2, Trash2 } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

interface ApiResponse {
  url: string;
  prompt: string;
  id: string;
}

function Generator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<ApiResponse | null>(null);
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Por favor ingresa una descripción');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.neoglow.net/webhook/isabela/nails-creator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'O2WJWuNAH4VamJIy'
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(data.message);
        }
        throw new Error('Error al generar la imagen');
      }

      setGeneratedImage(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setGeneratedImage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!generatedImage?.id) return;

    try {
      setDeleting(true);
      
      const response = await fetch('https://api.neoglow.net/webhook/isabela/delete-image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'O2WJWuNAH4VamJIy'
        },
        body: JSON.stringify({ id: generatedImage.id })
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      setGeneratedImage(null);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Error al eliminar la imagen. Por favor intenta de nuevo.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage?.id) return;
    
    try {
      setDownloading(true);
      
      const response = await fetch('https://api.neoglow.net/webhook/isabela/download-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'O2WJWuNAH4VamJIy'
        },
        body: JSON.stringify({ id: generatedImage.id })
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
        link.download = `nail-design-${generatedImage.id}.png`;
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
        link.download = `nail-design-${generatedImage.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Download error:', err);
      setError('Error al descargar la imagen. Por favor intenta de nuevo.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="mb-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe cómo quieres tus uñas..."
            className="w-full h-32 px-4 py-3 rounded-lg border border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 resize-none transition-colors"
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <button
              onClick={generateImage}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generar Diseño</span>
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      {generatedImage && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-red-900 mb-2">Nail prompt</h2>
            <p className="text-red-600 text-sm">{generatedImage.prompt}</p>
          </div>
          <div className="relative rounded-lg overflow-hidden bg-red-50">
            <img
              src={generatedImage.url}
              alt="AI Generated"
              className="w-full h-auto"
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={deleting}
                className="bg-white/90 hover:bg-white text-red-600 p-3 rounded-full shadow-lg transition-colors disabled:opacity-50"
                title="Eliminar imagen"
              >
                {deleting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="bg-white/90 hover:bg-white text-red-600 p-3 rounded-full shadow-lg transition-colors disabled:opacity-50"
                title="Descargar imagen"
              >
                {downloading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar imagen"
        message="¿Estás seguro de que quieres eliminar esta imagen? Esta acción no se puede deshacer."
      />
    </>
  );
}

export default Generator;
