import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minPrice,
  maxPrice,
  onPriceChange,
}) => {
  const [minValue, setMinValue] = useState(minPrice.toString());
  const [maxValue, setMaxValue] = useState(maxPrice.toString());

  const presetRanges = [
    { label: 'Dưới 100k', min: 0, max: 100000 },
    { label: '100k - 500k', min: 100000, max: 500000 },
    { label: '500k - 1tr', min: 500000, max: 1000000 },
    { label: '1tr - 2tr', min: 1000000, max: 2000000 },
    { label: 'Trên 2tr', min: 2000000, max: 5000000000000000000 },
  ];

  useEffect(() => {
    setMinValue(minPrice.toString());
    setMaxValue(maxPrice.toString());
  }, [minPrice, maxPrice]);

  // Debounce function to delay API calls
  const debounce = useCallback((func: (min: number, max: number) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (min: number, max: number) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(min, max), delay);
    };
  }, []);

  // Debounced API call function
  const debouncedPriceChange = useCallback(
    debounce((min: number, max: number) => {
      onPriceChange(min, max);
    }, 500),
    [onPriceChange, debounce]
  );

  const handleMinChange = (value: string) => {
    setMinValue(value);
    const numValue = parseInt(value.replace(/[^\d]/g, '')) || 0;
    const maxNum = parseInt(maxValue.replace(/[^\d]/g, '')) || 5000000;

    if (numValue <= maxNum) {
      debouncedPriceChange(numValue, maxNum);
    }
  };

  const handleMaxChange = (value: string) => {
    setMaxValue(value);
    const numValue = parseInt(value.replace(/[^\d]/g, '')) || 5000000;
    const minNum = parseInt(minValue.replace(/[^\d]/g, '')) || 0;

    if (numValue >= minNum) {
      debouncedPriceChange(minNum, numValue);
    }
  };

  const handlePresetClick = (min: number, max: number) => {
    setMinValue(min.toString());
    setMaxValue(max.toString());
    // Preset clicks should trigger immediately, not debounced
    onPriceChange(min, max);
  };

  const formatCurrency = (value: string) => {
    const number = parseInt(value.replace(/[^\d]/g, '')) || 0;
    return number.toLocaleString('vi-VN');
  };

  const currentMinPrice = parseInt(minValue.replace(/[^\d]/g, '')) || 0;
  const currentMaxPrice = parseInt(maxValue.replace(/[^\d]/g, '')) || 5000000;

  return (
    <div className="space-y-4">
      <Label>Khoảng giá</Label>

      {/* Input Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Từ</Label>
          <div className="relative">
            <Input
              value={formatCurrency(minValue)}
              onChange={(e) => handleMinChange(e.target.value)}
              placeholder="0"
              className="pr-8"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              đ
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Đến</Label>
          <div className="relative">
            <Input
              value={formatCurrency(maxValue)}
              onChange={(e) => handleMaxChange(e.target.value)}
              placeholder="5,000,000"
              className="pr-8"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              đ
            </span>
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Khoảng giá phổ biến</Label>
        <div className="grid grid-cols-2 gap-2">
          {presetRanges.map((preset, index) => (
            <Button
              key={index}
              variant={
                currentMinPrice === preset.min && currentMaxPrice === preset.max
                  ? 'default'
                  : 'outline'
              }
              size="sm"
              onClick={() => handlePresetClick(preset.min, preset.max)}
              className="text-xs h-8"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Current Range Display */}
      {(currentMinPrice > 0 || currentMaxPrice < 5000000) && (
        <div className="pt-2">
          <Badge variant="secondary" className="text-xs">
            {currentMinPrice.toLocaleString('vi-VN')}đ - {currentMaxPrice.toLocaleString('vi-VN')}đ
          </Badge>
        </div>
      )}
    </div>
  );
};
