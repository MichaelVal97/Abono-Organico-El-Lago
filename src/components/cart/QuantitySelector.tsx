'use client';

import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  maxStock: number;
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  maxStock,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    onQuantityChange(Math.max(1, quantity - 1));
  };

  const handleIncrement = () => {
    onQuantityChange(Math.min(maxStock, quantity + 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
        onQuantityChange(Math.max(1, Math.min(maxStock, value)));
    } else if (e.target.value === '') {
        onQuantityChange(1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleDecrement}
        disabled={quantity <= 1}
      >
        <Minus className="h-4 w-4" />
        <span className="sr-only">Disminuir cantidad</span>
      </Button>
      <Input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        className="h-8 w-14 text-center"
        min="1"
        max={maxStock}
      />
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleIncrement}
        disabled={quantity >= maxStock}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Aumentar cantidad</span>
      </Button>
    </div>
  );
}
