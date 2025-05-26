'use client';
import AnimateWrapper from '@/components/animations/animateWrapper';
import CoursesBlock from '@/components/block/courses-block';
import type { CourseForm } from '@/types/courseType';
import { APIGetListCourse } from '@/utils/course';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { APIGetCategory } from '@/utils/category';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [listCourse, setListCourse] = useState<CourseForm[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [category, setCategory] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Initialize params from URL
  const [paramsCourse, setParamsCourse] = useState({
    page: 1,
    limit: 12,
    category_slug: searchParams.get('category_slug') || undefined,
    level: searchParams.get('level') || undefined,
    min_price: searchParams.get('min_price')
      ? Number.parseInt(searchParams.get('min_price')!)
      : undefined,
    max_price: searchParams.get('max_price')
      ? Number.parseInt(searchParams.get('max_price')!)
      : undefined,
    min_rating: searchParams.get('min_rating')
      ? Number.parseInt(searchParams.get('min_rating')!)
      : undefined,
    q: searchParams.get('search') || undefined,
    instructor_username: undefined,
    with_instructor: true,
    with_category: true,
    include_disabled: false,
    with_thumbnail: true,
  });

  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [priceRange, setPriceRange] = useState([
    paramsCourse.min_price || 0,
    paramsCourse.max_price || 5000000,
  ]);

  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  const handleGetListCourse = async () => {
    try {
      setIsLoadingCourses(true);
      const response = await APIGetListCourse(paramsCourse);
      if (response && response.data) {
        setListCourse(response.data);
      }
    } catch (err) {
      console.error('Error during get list course:', err);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const handleGetCategory = async () => {
    try {
      const response = await APIGetCategory({
        language: 'vi',
        with_children: true,
      });

      const extractChildrenOnly = (categories: any[]): any[] => {
        let result: any[] = [];
        categories.forEach((category) => {
          if (category?.children && category?.children.length > 0) {
            category.children.forEach((child: any) => {
              result.push({
                id: child?.slug,
                value: child?.translations[0]?.name,
              });
              if (child.children && child.children.length > 0) {
                const deeper = extractChildrenOnly([child]);
                result = [...result, ...deeper];
              }
            });
          }
        });
        return result;
      };

      const childrenCategories = extractChildrenOnly(response?.data || []);
      setCategory(childrenCategories);
    } catch (error) {
      console.log(error);
    }
  };

  const updateURL = (newParams: any) => {
    const url = new URL(window.location.href);
    Object.keys(newParams).forEach((key) => {
      if (newParams[key] !== undefined && newParams[key] !== null && newParams[key] !== '') {
        url.searchParams.set(key, newParams[key].toString());
      } else {
        url.searchParams.delete(key);
      }
    });
    router.push(url.pathname + url.search);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newParams = { ...paramsCourse, [key]: value, page: 1 };
    setParamsCourse(newParams);
    updateURL({ [key]: value, page: 1 });
  };

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values);
    const newParams = {
      ...paramsCourse,
      min_price: values[0] > 0 ? values[0] : undefined,
      max_price: values[1] < 5000000 ? values[1] : undefined,
      page: 1,
    };
    setParamsCourse(newParams);
    updateURL({
      min_price: values[0] > 0 ? values[0] : undefined,
      max_price: values[1] < 5000000 ? values[1] : undefined,
      page: 1,
    });
  };

  const clearFilters = () => {
    const clearedParams = {
      page: 1,
      limit: 12,
      category_slug: undefined,
      level: undefined,
      min_price: undefined,
      max_price: undefined,
      min_rating: undefined,
      q: undefined,
      instructor_username: undefined,
      with_instructor: true,
      with_category: true,
      include_disabled: false,
      with_thumbnail: true,
    };
    setParamsCourse(clearedParams);
    setPriceRange([0, 5000000]);
    setSortBy('newest');
    router.push('/course');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (paramsCourse.category_slug) count++;
    if (paramsCourse.level) count++;
    if (paramsCourse.min_price || paramsCourse.max_price) count++;
    if (paramsCourse.min_rating) count++;
    if (paramsCourse.q) count++;
    return count;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setParamsCourse((prev) => ({ ...prev, page })); // Update paramsCourse to trigger API call
  };

  // Calculate total pages based on the listCourse length and limit
  const totalPages = Math.ceil(listCourse.length / paramsCourse.limit);

  useEffect(() => {
    handleGetListCourse();
  }, [paramsCourse]);

  useEffect(() => {
    handleGetCategory();
  }, []);

  const FilterSidebar = ({ className = '' }) => (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc
          </span>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary">{getActiveFiltersCount()}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-2">
          <Label>Danh mục</Label>
          <Select
            value={paramsCourse.category_slug || 'all'}
            onValueChange={(value) =>
              handleFilterChange('category_slug', value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {category.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Level Filter */}
        <div className="space-y-2">
          <Label>Cấp độ</Label>
          <Select
            value={paramsCourse.level || 'all'}
            onValueChange={(value) =>
              handleFilterChange('level', value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn cấp độ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả cấp độ</SelectItem>
              <SelectItem value="BEGINNER">Cơ bản</SelectItem>
              <SelectItem value="INTERMEDIATE">Trung cấp</SelectItem>
              <SelectItem value="ADVANCED">Nâng cao</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label>Khoảng giá</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              onValueCommit={handlePriceRangeChange}
              max={5000000}
              min={0}
              step={1000}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{priceRange[0].toLocaleString('vi-VN')}đ</span>
            <span>{priceRange[1].toLocaleString('vi-VN')}đ</span>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <Label>Đánh giá tối thiểu</Label>
          <Select
            value={paramsCourse.min_rating?.toString() || 'all'}
            onValueChange={(value) =>
              handleFilterChange('min_rating', value ? Number.parseInt(value) : undefined)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn đánh giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả đánh giá</SelectItem>
              <SelectItem value="4">4+ sao</SelectItem>
              <SelectItem value="3">3+ sao</SelectItem>
              <SelectItem value="2">2+ sao</SelectItem>
              <SelectItem value="1">1+ sao</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
          disabled={getActiveFiltersCount() === 0}
        >
          Xóa bộ lọc
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {/* <div className="bg-gradient-to-r from-LavenderIndigo to-majorelleBlue text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <AnimateWrapper delay={0} direction="left">
                <h1 className="text-4xl font-bold mb-4">Khám phá các khóa học chất lượng cao</h1>
                <p className="text-lg opacity-90 mb-6">
                  Học từ những chuyên gia hàng đầu với hàng nghìn khóa học được cập nhật liên tục
                </p>
                <div className="flex gap-4">
                  <Button size="lg" variant="secondary">
                    Bắt đầu học ngay
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-LavenderIndigo"
                  >
                    Tìm hiểu thêm
                  </Button>
                </div>
              </AnimateWrapper>
            </div>
            <div className="flex justify-center">
              <AnimateWrapper delay={0.2} direction="right">
                <img
                  src="/images/course_bg.png"
                  alt="Khóa học"
                  className="max-w-md w-full rounded-xl shadow-2xl"
                />
              </AnimateWrapper>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Top Filters and Controls */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Danh sách khóa học</h2>
                  <p className="text-muted-foreground">
                    {isLoadingCourses ? 'Đang tải...' : `Tìm thấy ${listCourse.length} khóa học`}
                  </p>
                </div>

                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowMobileFilter(true)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Bộ lọc
                  {getActiveFiltersCount() > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {getActiveFiltersCount()}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Top Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-2 items-center">
                  <Label htmlFor="sort">Sắp xếp:</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mới nhất</SelectItem>
                      <SelectItem value="oldest">Cũ nhất</SelectItem>
                      <SelectItem value="price_low">Giá thấp đến cao</SelectItem>
                      <SelectItem value="price_high">Giá cao đến thấp</SelectItem>
                      <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                      <SelectItem value="popular">Phổ biến nhất</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Active Filters */}
              {getActiveFiltersCount() > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {paramsCourse.category_slug && (
                    <Badge variant="secondary" className="gap-1">
                      {category.find((c) => c.id === paramsCourse.category_slug)?.value}
                      <button onClick={() => handleFilterChange('category_slug', undefined)}>
                        ×
                      </button>
                    </Badge>
                  )}
                  {paramsCourse.level && (
                    <Badge variant="secondary" className="gap-1">
                      {paramsCourse.level}
                      <button onClick={() => handleFilterChange('level', undefined)}>×</button>
                    </Badge>
                  )}
                  {(paramsCourse.min_price || paramsCourse.max_price) && (
                    <Badge variant="secondary" className="gap-1">
                      {paramsCourse.min_price?.toLocaleString('vi-VN')}đ -{' '}
                      {paramsCourse.max_price?.toLocaleString('vi-VN')}đ
                      <button onClick={() => handlePriceRangeChange([0, 5000000])}>×</button>
                    </Badge>
                  )}
                  {paramsCourse.min_rating && (
                    <Badge variant="secondary" className="gap-1">
                      {paramsCourse.min_rating}+ sao
                      <button onClick={() => handleFilterChange('min_rating', undefined)}>×</button>
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Course Grid/List */}
            <AnimateWrapper delay={0} direction="up" amount={0.01}>
              {isLoadingCourses ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : listCourse.length > 0 ? (
                <div
                  className={`grid gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1'
                  }`}
                >
                  {listCourse.map((course: CourseForm, index: number) => (
                    <CoursesBlock key={index} {...course} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Không tìm thấy khóa học nào phù hợp với bộ lọc của bạn.
                  </p>
                  <Button onClick={clearFilters} className="mt-4">
                    Xóa bộ lọc
                  </Button>
                </div>
              )}
            </AnimateWrapper>

            {/* Pagination */}
            {listCourse.length > 0 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </Button>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <Button
                      key={index + 1}
                      variant={currentPage === index + 1 ? 'default' : 'outline'}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilter && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="fixed right-0 top-0 h-full w-80 bg-background shadow-xl">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Bộ lọc</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowMobileFilter(false)}>
                  ×
                </Button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto h-full pb-20">
              <FilterSidebar className="border-0 shadow-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
