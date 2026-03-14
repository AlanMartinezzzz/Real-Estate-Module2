import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice, formatArea } from '@/lib/utils';
import type { Property } from '@/types/property';

interface ComparePageProps {
  compareList: Property[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function ComparePage({ compareList, onRemove, onClear }: ComparePageProps) {
  const navigate = useNavigate();

  // Lógica para encontrar los mejore valores y resaltarlos en la comparacionn
  const bestValues = useMemo(() => {
    if (compareList.length === 0) return null;
    return {
      minPrice: Math.min(...compareList.map(p => p.price)),
      maxArea: Math.max(...compareList.map(p => p.area)),
    };
  }, [compareList]);

  if (compareList.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">No hay propiedades para comparar</h2>
        <p className="text-muted-foreground mb-8">Selecciona hasta 3 propiedades desde el inicio.</p>
        <Button onClick={() => navigate('/')}>Volver al inicio</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>
        <h1 className="text-3xl font-bold">Comparación de Propiedades</h1>
        <Button variant="outline" onClick={onClear} className="text-destructive">
          Limpiar todo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Columna de Etiquetas */}
        <div className="hidden md:flex flex-col pt-[200px] gap-8 font-semibold text-muted-foreground">
          <div className="h-12 flex items-center">Precio</div>
          <div className="h-12 flex items-center">Habitaciones</div>
          <div className="h-12 flex items-center">Baños</div>
          <div className="h-12 flex items-center">Área</div>
          <div className="h-12 flex items-center">Precio por m²</div>
        </div>

        {/* Columnas de Propiedades */}
        {compareList.map((property) => {
          const isBestPrice = property.price === bestValues?.minPrice;
          const isBestArea = property.area === bestValues?.maxArea;
          const pricePerM2 = property.price / property.area;

          return (
            <Card key={property.id} className="relative overflow-hidden border-2">
              <div className="h-40 overflow-hidden relative">
                <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                <Button 
                  variant="destructive" size="icon" 
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => onRemove(property.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <CardContent className="p-4 flex flex-col gap-8">
                <h3 className="font-bold text-sm h-12 line-clamp-2 mb-2">{property.title}</h3>
                
                {/* Precio */}
                <div className={`h-12 flex items-center gap-2 font-bold ${isBestPrice ? 'text-green-600' : ''}`}>
                  {formatPrice(property.price)}
                  {isBestPrice && <Trophy className="h-4 w-4 text-yellow-500" />}
                </div>

                {/* Habitaciones */}
                <div className="h-12 flex items-center">{property.bedrooms}</div>

                {/* Baños */}
                <div className="h-12 flex items-center">{property.bathrooms}</div>

                {/* Área */}
                <div className={`h-12 flex items-center gap-2 ${isBestArea ? 'text-blue-600 font-bold' : ''}`}>
                  {formatArea(property.area)}
                  {isBestArea && <Trophy className="h-4 w-4 text-yellow-500" />}
                </div>

                {/* Precio/m2 */}
                <div className="h-12 flex items-center">
                  {formatPrice(pricePerM2)} /m²
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}