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
  const [minError, setMinError] = useState(false);
  const [maxError, setMaxError] = useState(false);

  const presetRanges = [
    { label: 'Dưới 100k', min: 0, max: 100000 },
    { label: '100k - 500k', min: 100000, max: 500000 },
    { label: '500k - 1tr', min: 500000, max: 1000000 },
    { label: '1tr - 2tr', min: 1000000, max: 2000000 },
    { label: 'Trên 2tr', min: 2000000, max: undefined },
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
    // Lấy chỉ các số từ input
    const rawNumber = value.replace(/[^\d]/g, '');

    // Giới hạn độ dài không quá 9 chữ số (100,000,000)
    if (rawNumber.length > 9) {
      setMinError(true);
      setTimeout(() => setMinError(false), 2000);
      return;
    }

    setMinError(false);
    const numValue = parseInt(rawNumber) || 0;
    setMinValue(rawNumber);
    const maxNum = parseInt(maxValue) || 100000000;

    if (numValue <= maxNum) {
      debouncedPriceChange(numValue, maxNum);
    }
  };

  const handleMaxChange = (value: string) => {
    // Lấy chỉ các số từ input
    const rawNumber = value.replace(/[^\d]/g, '');

    // Giới hạn độ dài không quá 9 chữ số (100,000,000)
    if (rawNumber.length > 9) {
      setMaxError(true);
      setTimeout(() => setMaxError(false), 2000);
      return;
    }

    setMaxError(false);
    const numValue = parseInt(rawNumber) || 100000000;
    setMaxValue(rawNumber);
    const minNum = parseInt(minValue) || 0;

    if (numValue >= minNum) {
      debouncedPriceChange(minNum, numValue);
    }
  };

  const handlePresetClick = (min: number, max?: number) => {
    setMinValue(min.toString());
    setMaxValue(max ? max.toString() : '');
    // Preset clicks should trigger immediately, not debounced
    onPriceChange(min, max || 100000000);
  };

  const formatCurrency = (value: string) => {
    const number = parseInt(value.replace(/[^\d]/g, '')) || 0;
    return number.toLocaleString('vi-VN');
  };

  const currentMinPrice = parseInt(minValue) || 0;
  const currentMaxPrice = maxValue ? parseInt(maxValue) || 100000000 : null;

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
              className={`pr-8 ${minError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
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
              placeholder="100,000,000"
              className={`pr-2 ${maxError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              đ
            </span>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {(minError || maxError) && (
        <div className="text-xs text-red-500 mt-1">
          {minError && <p>Giá tối thiểu không được vượt quá 100,000,000đ</p>}
          {maxError && <p>Giá tối đa không được vượt quá 100,000,000đ</p>}
        </div>
      )}

      {/* Preset Buttons */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Khoảng giá phổ biến</Label>
        <div className="grid grid-cols-2 gap-2">
          {presetRanges.map((preset, index) => (
            <Button
              key={index}
              variant={
                currentMinPrice === preset.min &&
                (preset.max ? currentMaxPrice === preset.max : currentMaxPrice === null)
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
      {(currentMinPrice > 0 || (currentMaxPrice && currentMaxPrice < 100000000)) && (
        <div className="pt-2">
          <Badge variant="secondary" className="text-xs">
            {currentMinPrice.toLocaleString('vi-VN')}đ -{' '}
            {currentMaxPrice && currentMaxPrice < 100000000
              ? `${currentMaxPrice.toLocaleString('vi-VN')}đ`
              : 'không giới hạn'}
          </Badge>
        </div>
      )}
    </div>
  );
};
