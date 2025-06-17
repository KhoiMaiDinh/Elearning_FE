'use client';

import type React from 'react';

import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import {
  BadgeCheck,
  Bell,
  CreditCard,
  Heart,
  LogOut,
  Menu,
  Moon,
  Sun,
  Search,
  X,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { APIGetCurrentUser } from '@/utils/user';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from '@/constants/userSlice';
import type { RootState } from '@/constants/store';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationCenter } from './notifications/notificationComponent';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { APIGetListCourse } from '@/utils/course';
import { debounce } from 'lodash';
import { clearBankAccount } from '@/constants/bankAccount';
import { clearComment } from '@/constants/comment';
import { clearNotifications } from '@/constants/notificationSlice';
import { clearCourse } from '@/constants/course';
import { clearOrders } from '@/constants/orderSlice';
import { clearStatisticItemCourse } from '@/constants/statisticItemCourse';

const Header = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const router = useRouter();
  const pathname = usePathname();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);

  const menuItems = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Khóa học', path: '/course' },
    { label: 'Giảng viên', path: '/lecture' },
    { label: 'Liên hệ', path: '/contact' },
  ];

  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleGetCurrentUser = async () => {
    const response = await APIGetCurrentUser();
    if (response?.status === 200) {
      if (userInfo !== response.data) {
        dispatch(setUser(response.data));
      }
    }
  };

  const handleLogOut = () => {
    router.push('/login');
    localStorage.setItem('access_token', '');
    localStorage.setItem('refresh_token', '');
    localStorage.setItem('expires_at', '');
    dispatch(clearUser());
    // window.location.reload();
    router.push('/');
    dispatch(clearUser());
    dispatch(clearBankAccount({}));
    dispatch(clearComment({}));
    dispatch(clearNotifications());
    dispatch(clearCourse({}));
    dispatch(clearOrders({}));
    dispatch(clearStatisticItemCourse({}));

    dispatch(clearUser());
  };

  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
    setShowDropdown(results.length > 0);
  };

  const handleSearchBlur = () => {
    // Delay to allow dropdown clicks to register
    setTimeout(() => {
      if (!searchValue) {
        setIsSearchExpanded(false);
      }
      setShowDropdown(false);
    }, 150);
  };

  // Xóa ô input
  const handleSearchClose = () => {
    setSearchValue('');
    setResults([]);
    setShowDropdown(false);
    setHighlightIndex(-1);
    setIsSearchExpanded(false);
    inputRef.current?.blur();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setShowDropdown(false);
      router.push(`/course?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleGetListCourse = async (val: string) => {
    const response = await APIGetListCourse({ q: val });
    if (response?.status === 200) {
      const data = response.data.map((item: any) => item.title); // chỉ lấy ra title
      setResults(data);
    }
  };

  const debouncedFetch = useRef(
    debounce((val: string) => {
      handleGetListCourse(val);
    }, 400)
  ).current;

  useEffect(() => {
    if (searchValue.trim() === '') {
      setResults([]);
      setShowDropdown(false);
      setHighlightIndex(-1);
      return;
    }
    debouncedFetch(searchValue);
    if (isSearchExpanded) {
      setShowDropdown(true);
    }
  }, [searchValue, isSearchExpanded]);

  const handleSelectCourse = (name: string) => {
    setSearchValue(name);
    setShowDropdown(false);
    router.push(`/course?search=${encodeURIComponent(name)}`);
  };

  // Xử lý enter, phím lên xuống
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || results.length === 0) {
      if (e.key === 'Escape') {
        handleSearchClose();
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < results.length) {
        handleSelectCourse(results[highlightIndex]);
      } else if (searchValue.trim() !== '') {
        router.push(`/course?search=${encodeURIComponent(searchValue.trim())}`);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      handleSearchClose();
    }
  };

  // Xử lý nút tìm kiếm bấm
  const handleSearchClick = () => {
    if (searchValue.trim() !== '') {
      setShowDropdown(false);
      router.push(`/course?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  useEffect(() => {
    handleGetCurrentUser();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 flex h-16 items-center">
        {/* Mobile Menu - Hidden when search is expanded */}
        {!isSearchExpanded && (
          <div className="flex items-center sm:hidden mr-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <nav className="flex flex-col space-y-4">
                    {Array.isArray(menuItems) &&
                      menuItems.length > 0 &&
                      menuItems.map((item) => (
                        <Button
                          key={item.path}
                          variant="ghost"
                          onClick={() => {
                            router.push(item.path);
                            const closeEvent = new Event('close-sheet');
                            window.dispatchEvent(closeEvent);
                          }}
                          className={`justify-start ${
                            pathname === item.path
                              ? 'bg-muted font-medium text-LavenderIndigo dark:text-PaleViolet'
                              : ''
                          }`}
                        >
                          {item.label}
                        </Button>
                      ))}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        router.push('/favorites');
                        const closeEvent = new Event('close-sheet');
                        window.dispatchEvent(closeEvent);
                      }}
                      className={`justify-start ${
                        pathname === '/favorites'
                          ? 'bg-muted font-medium text-LavenderIndigo dark:text-PaleViolet'
                          : ''
                      }`}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Khóa học yêu thích
                    </Button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}

        {/* Logo */}
        <div className="flex items-center">
          <div className="cursor-pointer" onClick={() => router.push('/')}>
            <img src="/images/logo.png" alt="NovaLearn Logo" className="w-10 h-10" />
          </div>
        </div>

        {/* Desktop Navigation - Hidden when search is expanded */}
        {!isSearchExpanded && (
          <nav className="hidden sm:flex items-center space-x-8 ml-8">
            {Array.isArray(menuItems) &&
              menuItems.length > 0 &&
              menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.path
                      ? 'text-LavenderIndigo dark:text-PaleViolet font-semibold'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
          </nav>
        )}

        {/* Search Section - Expands to fill available space */}
        <div
          className={`flex items-center transition-all duration-300 ${
            isSearchExpanded ? 'flex-1 mx-4' : 'ml-auto mr-4 w-48 sm:w-64'
          }`}
        >
          <div className="relative w-full">
            <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
              <div className="relative w-full">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  onClick={() => searchValue && handleSearchClick()}
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  onKeyDown={handleKeyDown}
                  className="pl-10 pr-20 h-10 rounded-full bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-LavenderIndigo w-full outline-none"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={handleSearchClose}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full hover:bg-muted flex items-center justify-center"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Search Dropdown */}
            {showDropdown && results.length > 0 && (
              <ul className="absolute z-50 w-full max-h-60 overflow-auto bg-background border rounded-md mt-1 shadow-lg">
                {results &&
                  results.length > 0 &&
                  results.map((course, index) => (
                    <li
                      key={course}
                      onMouseDown={() => handleSelectCourse(course)}
                      className={`cursor-pointer px-4 py-2 hover:bg-muted ${index === highlightIndex ? 'bg-muted' : ''}`}
                    >
                      {course}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Action Buttons - Hidden when search is expanded on mobile */}
          {!isSearchExpanded && (
            <>
              {/* Favorites Button */}

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full bg-muted/50 hover:bg-muted hidden sm:flex"
              >
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 transition-all" />
                ) : (
                  <Sun className="h-5 w-5 transition-all" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </>
          )}

          {/* Notifications */}
          <NotificationCenter />

          {/* User Menu or Login Button */}
          {!userInfo.id ? (
            <Button
              className="bg-gradient-to-r from-LavenderIndigo to-majorelleBlue hover:brightness-110 text-white dark:text-black"
              onClick={() => router.push('/login')}
            >
              Đăng nhập
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 rounded-full border-2 border-muted">
                    <AvatarImage
                      src={
                        process.env.NEXT_PUBLIC_BASE_URL_IMAGE + userInfo.profile_image?.key ||
                        '/placeholder.svg' ||
                        '/placeholder.svg'
                      }
                      alt={userInfo.username || 'User'}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xs">
                      {userInfo.first_name?.[0]}
                      {userInfo.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-xl" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userInfo.first_name} {userInfo.last_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">{userInfo.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push('/profile/student')}>
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    <span>Tài khoản</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/billing')}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Thanh toán</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-carminePink focus:text-carminePink"
                  onClick={handleLogOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
