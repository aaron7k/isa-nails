import React, { useState } from 'react';
import { Download, Loader2, Wand2, Image as ImageIcon } from 'lucide-react';
import Generator from './components/Generator';
import Gallery from './components/Gallery';

function App() {
  const [view, setView] = useState<'generator' | 'gallery'>('generator');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Wand2 className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-red-900 mb-2">AI Nails Generator</h1>
            <p className="text-red-700 mb-2">Visualiza las uñas que te imagines</p>
            <p className="text-red-400 text-sm italic">For Isabela ♥</p>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setView('generator')}
              className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                view === 'generator'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-red-600 hover:bg-red-50'
              }`}
            >
              <Wand2 className="w-5 h-5" />
              Generador
            </button>
            <button
              onClick={() => setView('gallery')}
              className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                view === 'gallery'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-red-600 hover:bg-red-50'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              Galería
            </button>
          </div>

          {/* Content */}
          {view === 'generator' ? <Generator /> : <Gallery />}
        </div>
      </div>
    </div>
  );
}

export default App;
