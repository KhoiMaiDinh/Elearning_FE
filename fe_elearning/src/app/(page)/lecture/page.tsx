'use client';
import AnimateWrapper from '@/components/animations/animateWrapper';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
import { APIGetListInstructor } from '@/utils/instructor';
import { Input } from '@/components/ui/input';
import LecturersBlock from '@/components/block/lecturers-block';
import { Lecture } from '@/types/registerLectureFormType';
import { Category } from '@/types/categoryType';
import { debounce } from 'lodash';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [listLecture, setListLecture] = useState<Lecture[]>([]);
  const [isLoadingLecture, setIsLoadingLecture] = useState(false);
  const [category, setCategory] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Initialize params from URL
  const [paramsLecture, setParamsLecture] = useState({
    page: 1,
    limit: 12,
    specialty: searchParams.get('specialty') || undefined,
    is_approved: true,
    q: searchParams.get('search') || undefined,
  });

  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState(paramsLecture.q || '');

  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const handleGetLecture = async () => {
    setIsLoadingLecture(true);
    const response = await APIGetListInstructor(paramsLecture);
    if (response?.status === 200) {
      setListLecture(response.data);
    }
    setIsLoadingLecture(false);
    const total = response?.total;
    const limit = paramsLecture.limit;
    const totalPages = Math.ceil(total / limit);
    setTotalPages(totalPages);
  };

  const handleGetCategory = async () => {
    try {
      const response = await APIGetCategory({
        language: 'vi',
        with_children: true,
      });

      setCategory(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedSearch = useRef(
    debounce((value: string) => {
      handleFilterChange('q', value.trim() === '' ? undefined : value);
    }, 400)
  ).current;

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

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
    const newParams = { ...paramsLecture, [key]: value, page: 1 };
    setParamsLecture(newParams);
    updateURL({ [key]: value, page: 1 });
  };

  const clearFilters = () => {
    const clearedParams = {
      page: 1,
      limit: 12,
      specialty: undefined,
      q: undefined,
      is_approved: true,
    };
    setParamsLecture(clearedParams);
    setSortBy('newest');
    router.push('/lecture');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (paramsLecture.specialty) count++;
    if (paramsLecture.q) count++;
    return count;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setParamsLecture((prev) => ({ ...prev, page })); // Update paramsCourse to trigger API call
  };

  // Calculate total pages based on the listCourse length and limit

  useEffect(() => {
    handleGetLecture();
  }, [paramsLecture]);

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
            value={paramsLecture.specialty || 'all'}
            onValueChange={(value) =>
              handleFilterChange('specialty', value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {Array.isArray(category) &&
                category.length > 0 &&
                category.map((cat: Category) => (
                  <SelectItem key={cat.slug} value={cat.slug}>
                    {cat.translations[0]?.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <Label>Tìm kiếm</Label>
          <Input value={searchInput} onChange={handleSearchInput} />
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
      {/* Giang vien uu tu */}
      <section className="py-12  overflow-hidden">
        <AnimateWrapper direction="up">
          <div className="text-center mb-8">
            <h2 className="md:text-2xl text-xl font-bold text-black dark:text-white">
              Gương mặt ưu tú
            </h2>
            <p className="md:text-sm text-xs text-muted-foreground mt-2">
              Những giảng viên xuất sắc đồng hành cùng bạn
            </p>
          </div>
        </AnimateWrapper>

        <div className="relative w-full whitespace-nowrap">
          <AnimateWrapper direction="up">
            <div className="inline-flex animate-marquee space-x-4 md:space-x-6 gap-4 md:gap-10">
              {listLecture &&
                listLecture.length > 0 &&
                listLecture.concat(listLecture).map((lecture: Lecture, idx: number) => (
                  <div
                    key={idx}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white dark:border-darkSilver shadow-md"
                  >
                    {/* <img
                    src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${lecture?.user?.profile_image?.key}`}
                    alt={`Lecturer ${idx}`}
                    className="object-cover text-cosmicCobalt w-full h-full"
                  /> */}
                    <Avatar className="w-full h-full border-4 shadow-lg">
                      <AvatarImage
                        src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${lecture?.user?.profile_image?.key}`}
                        alt={lecture?.user?.last_name + ' ' + lecture?.user?.first_name || ''}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-PaleViolet/50 text-white text-xl">
                        {lecture?.user?.last_name +
                          '' +
                          lecture?.user?.first_name
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('') || 'GV'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                ))}
            </div>
          </AnimateWrapper>
        </div>
      </section>

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
                  <h2 className="text-2xl font-bold">Danh sách giảng viên</h2>
                  <p className="text-muted-foreground">
                    {isLoadingLecture ? 'Đang tải...' : `Tìm thấy ${listLecture.length} giảng viên`}
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
                  {paramsLecture.specialty && (
                    <Badge variant="secondary" className="gap-1">
                      {
                        category.find((c: Category) => c.slug === paramsLecture.specialty)
                          ?.translations[0]?.name
                      }
                      <button onClick={() => handleFilterChange('specialty', undefined)}>×</button>
                    </Badge>
                  )}
                  {paramsLecture.q && (
                    <Badge variant="secondary" className="gap-1">
                      {paramsLecture.q}
                      <button onClick={() => handleFilterChange('q', undefined)}>×</button>
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Course Grid/List */}
            <AnimateWrapper delay={0} direction="up" amount={0.01}>
              {isLoadingLecture ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : listLecture.length > 0 ? (
                <div
                  className={`grid gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-2'
                      : 'grid-cols-1'
                  }`}
                >
                  {listLecture &&
                    listLecture.length > 0 &&
                    listLecture?.map((lecture: Lecture, index: number) => (
                      <LecturersBlock
                        key={index}
                        avatar={lecture?.user?.profile_image?.key}
                        name={lecture?.user?.first_name + ' ' + lecture?.user?.last_name}
                        rating={lecture?.avg_rating}
                        major={lecture?.category?.translations[0]?.name}
                        numberCourse={lecture?.total_courses}
                        numberStudent={lecture?.total_students}
                        description={lecture?.biography}
                        username={lecture?.user?.username}
                      />
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Không tìm thấy giảng viên nào phù hợp với bộ lọc của bạn.
                  </p>
                  <Button onClick={clearFilters} className="mt-4">
                    Xóa bộ lọc
                  </Button>
                </div>
              )}
            </AnimateWrapper>

            {/* Pagination */}
            {listLecture.length > 0 && (
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
