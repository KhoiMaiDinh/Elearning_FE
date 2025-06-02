import { useCallback, useEffect, useState } from 'react';
import { APIGetCategory } from '@/utils/category';

interface CategoryChild {
  id: string;
  value: string;
}

interface CategoryData {
  id: string;
  value: string;
  children?: CategoryChild[];
}

type UseCategoryProps = {
  parentSlugOfDefaultCategory?: string;
  defaultChildSlug?: string;
  language?: string;
};

export function useCategoryFetcher({
  parentSlugOfDefaultCategory,
  language = 'vi',
}: UseCategoryProps = {}) {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState<string>(
    parentSlugOfDefaultCategory || ''
  );
  const [childCategories, setChildCategories] = useState<CategoryChild[]>([]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await APIGetCategory({
        language,
        with_children: true,
      });

      if (response?.status !== 200) return;

      const formattedData: CategoryData[] = response.data.map((item: any) => ({
        id: item.slug,
        value: item?.translations?.[0]?.name || item.slug,
        children:
          item.children?.map((child: any) => ({
            id: child.slug,
            value: child?.translations?.[0]?.name || child.slug,
          })) || [],
      }));

      setCategoryData(formattedData);

      if (parentSlugOfDefaultCategory) {
        const parentCategory = formattedData.find((cat) => cat.id === parentSlugOfDefaultCategory);
        if (parentCategory?.children) {
          setChildCategories(parentCategory.children);
        }
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, [parentSlugOfDefaultCategory, language]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleParentCategoryChange = (slug: string) => {
    setSelectedParentCategory(slug);
    const selected = categoryData.find((cat) => cat.id === slug);
    setChildCategories(selected?.children || []);
  };

  return {
    categoryData,
    selectedParentCategory,
    childCategories,
    handleParentCategoryChange,
  };
}
