import type React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Tag, CheckSquare, Square as SquareOutline } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Property } from '@/types/property';
import { PROPERTY_TYPE_LABELS, OPERATION_TYPE_LABELS } from '@/types/property';
import { formatPrice, formatArea, truncateText } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  onDelete?: (id: string) => void;
  isCompared?: boolean;
  compareCount?: number;
  onToggleCompare?: () => void;
}

export function PropertyCard({ 
  property, 
  onDelete,
  isCompared = false,
  compareCount = 0,
  onToggleCompare 
}: PropertyCardProps): React.ReactElement {
  
  const imageUrl =
    property.images?.[0] ?? `https://placehold.co/800x600/e2e8f0/64748b?text=${encodeURIComponent(property.propertyType)}`;

  const isCompareFull = compareCount >= 3 && !isCompared;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        <span
          className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full ${property.operationType === 'venta'
            ? 'bg-green-500 text-white'
            : 'bg-blue-500 text-white'
            }`}
        >
          {OPERATION_TYPE_LABELS[property.operationType]}
        </span>

        <span className="absolute top-3 right-3 px-3 py-1 bg-black/60 text-white text-xs rounded-full">
          {PROPERTY_TYPE_LABELS[property.propertyType]}
        </span>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{property.title}</h3>

        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="h-4 w-4" />
          <span>{truncateText(`${property.address}, ${property.city}`, 40)}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{formatArea(property.area)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-primary" />
          <span className="text-xl font-bold text-primary">
            {formatPrice(property.price)}
            {property.operationType === 'alquiler' && (
              <span className="text-sm font-normal text-muted-foreground">/mes</span>
            )}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button asChild className="flex-1">
          <Link to={`/property/${property.id}`}>Ver detalles</Link>
        </Button>

        {onToggleCompare && (
          <Button 
            variant={isCompared ? "secondary" : "outline"} 
            size="icon" 
            onClick={onToggleCompare}
            disabled={isCompareFull}
            title={isCompared ? "Quitar de comparar" : isCompareFull ? "Máximo 3 propiedades" : "Agregar para comparar"}
          >
            {isCompared ? <CheckSquare className="h-4 w-4 text-blue-600" /> : <SquareOutline className="h-4 w-4" />}
          </Button>
        )}

        {onDelete && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(property.id)}
            aria-label="Eliminar propiedad"
          >
            <span aria-hidden="true">×</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}