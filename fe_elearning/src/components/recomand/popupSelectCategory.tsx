'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APIGetCategory } from '@/utils/category';
import { Category } from '@/types/categoryType';
import { APIGetPreference, APISavePreference } from '@/utils/preference';

interface CategorySelectionPopupProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialSelectedCategories?: string[];
  title?: string;
  description?: string;
  maxSelections?: number;
  minSelections?: number;
}

export function CategorySelectionPopup({
  isOpen = true,
  onClose,
  initialSelectedCategories = [],
  title = 'Chọn lĩnh vực yêu thích',
  description = 'Hãy chọn những lĩnh vực bạn quan tâm để chúng tôi có thể gợi ý khóa học phù hợp',
  maxSelections = 10,
  minSelections = 1,
}: CategorySelectionPopupProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialSelectedCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Reset selections when popup opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCategories(initialSelectedCategories);
    }
  }, [isOpen, initialSelectedCategories]);

  const handleGetCategory = async () => {
    const response = await APIGetCategory({
      language: 'vi',
      with_children: true,
    });
    if (response?.status === 200) {
      const allChildren = response.data.flatMap((parent: any) => {
        const { children, ...parentWithoutChildren } = parent;

        return (children || []).map((child: any) => ({
          ...child,
          parent_slug: parent.slug,
          parent: parentWithoutChildren,
        }));
      });
      setCategories(allChildren);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        // Remove category
        return prev.filter((id) => id !== categoryId);
      } else {
        // Add category (check max limit)
        if (prev.length >= maxSelections) {
          return prev;
        }
        return [...prev, categoryId];
      }
    });
  };

  const handleSave = async () => {
    if (selectedCategories.length < minSelections) {
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        categories: selectedCategories.map((slug) => ({ slug: slug })),
      };
      await handleSavePreference(data);
      onClose?.();
    } catch (error) {
      console.error('Error saving categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedCategories(initialSelectedCategories);
    onClose?.();
  };

  const handleSavePreference = async (data: any) => {
    const response = await APISavePreference(data);
  };
  useEffect(() => {
    handleGetCategory();
  }, []);

  const isValidSelection =
    selectedCategories.length >= minSelections && selectedCategories.length <= maxSelections;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl md:text-2xl font-bold flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-base">{description}</DialogDescription>
        </DialogHeader>

        {/* Selection counter */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
            <span className="text-sm font-medium">
              Đã chọn:{' '}
              <span className="text-majorelleBlue font-bold">{selectedCategories.length}</span>
              {maxSelections && `/${maxSelections}`}
            </span>
            {minSelections > 0 && selectedCategories.length < minSelections && (
              <span className="text-xs text-red-500">• Tối thiểu {minSelections}</span>
            )}
          </div>
        </div>

        {/* Categories grid */}
        <ScrollArea className="flex-1 max-h-[60vh] overflow-y-auto  ">
          <div className="grid grid-cols-2 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.isArray(categories) &&
              categories.length > 0 &&
              categories.map((category) => {
                const isSelected = selectedCategories.includes(category.slug);
                const isDisabled = !isSelected && selectedCategories.length >= maxSelections;

                return (
                  <div
                    key={category.slug}
                    className={cn(
                      'relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group',
                      'hover:shadow-md hover:scale-105 active:scale-95',
                      isSelected
                        ? 'border-majorelleBlue bg-majorelleBlue/10 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                      isDisabled && 'opacity-50 cursor-not-allowed hover:scale-100'
                    )}
                    onClick={() => !isDisabled && handleCategoryToggle(category.slug)}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-majorelleBlue rounded-full flex items-center justify-center shadow-lg">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}

                    {/* Category content */}
                    <div className="flex flex-col items-center text-center space-y-2">
                      {/* Icon */}
                      <div
                        className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors',
                          isSelected
                            ? 'bg-majorelleBlue text-white'
                            : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                        )}
                      >
                        {'📚'}
                      </div>

                      {/* Name */}
                      <h3
                        className={cn(
                          'font-semibold text-sm leading-tight transition-colors',
                          isSelected ? 'text-majorelleBlue' : 'text-gray-900 dark:text-gray-100'
                        )}
                      >
                        {category?.translations[0]?.name}
                      </h3>

                      {/* Description */}
                      {category?.translations[0]?.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {category?.translations[0]?.description}
                        </p>
                      )}
                    </div>

                    {/* Hover effect overlay */}
                    <div
                      className={cn(
                        'absolute inset-0 rounded-xl transition-opacity',
                        isSelected
                          ? 'bg-majorelleBlue/5'
                          : 'bg-gray-100/0 group-hover:bg-gray-100/50 dark:group-hover:bg-gray-800/50'
                      )}
                    />
                  </div>
                );
              })}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Heart className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Không có lĩnh vực nào</p>
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValidSelection || isLoading}
            className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-LavenderIndigo to-majorelleBlue hover:brightness-110 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              `Lưu lựa chọn (${selectedCategories.length})`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
