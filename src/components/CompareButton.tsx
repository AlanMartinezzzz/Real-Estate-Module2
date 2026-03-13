import { Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CompareButtonProps {
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function CompareButton({ isSelected, onToggle, disabled }: CompareButtonProps) {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="icon"
      className={cn(
        "h-8 w-8 transition-all",
        isSelected && "bg-blue-600 hover:bg-blue-700"
      )}
      onClick={(e) => {
        e.preventDefault(); // Evita que se abra el detalle al hacer clic en el botón
        onToggle();
      }}
      disabled={disabled && !isSelected}
      title={isSelected ? "Quitar de comparar" : "Agregar a comparar"}
    >
      {isSelected ? (
        <Check className="h-4 w-4 text-white" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
    </Button>
  );
}