import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const closeModal = () => setIsOpen(false);

  // LOGICA DE TECLADO (Requisito indispensable del Lab)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, nextImage, prevImage]);

  return (
    <div className="space-y-4">
      {/* 1. Grid de Miniaturas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div 
            key={index} 
            className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg border bg-muted"
            onClick={() => {
              setCurrentIndex(index);
              setIsOpen(true);
            }}
          >
            <img src={img} alt={`Vista ${index}`} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Maximize2 className="text-white h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      {/* 2. Modal a Pantalla Completa */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4" onClick={closeModal}>
          <div className="relative w-full max-w-5xl flex flex-col items-center" onClick={e => e.stopPropagation()}>
            
            {/* Botón Cerrar */}
            <Button variant="ghost" className="absolute -top-12 right-0 text-white hover:bg-white/10" onClick={closeModal}>
              <X className="h-8 w-8" />
            </Button>

            {/* Navegación Mouse */}
            <Button variant="ghost" className="absolute left-0 top-1/2 -translate-y-1/2 text-white hidden md:flex" onClick={prevImage}>
              <ChevronLeft className="h-12 w-12" />
            </Button>

            <img src={images[currentIndex]} className="max-h-[80vh] rounded-lg shadow-2xl object-contain" alt="Imagen ampliada" />
            
            {/* CONTADOR (Requisito Lab) */}
            <div className="mt-6 px-4 py-1 bg-white/10 rounded-full text-white text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>

            <Button variant="ghost" className="absolute right-0 top-1/2 -translate-y-1/2 text-white hidden md:flex" onClick={nextImage}>
              <ChevronRight className="h-12 w-12" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}