"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { BadgeCheck, Bell, CreditCard, Heart, LogOut, Menu, Moon, Sun, Search, X } from "lucide-react"
import { useTheme } from "next-themes"
import { APIGetCurrentUser } from "@/utils/user"
import { useDispatch, useSelector } from "react-redux"
import { setUser, clearUser } from "@/constants/userSlice"
import type { RootState } from "@/constants/store"
import { usePathname, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationCenter } from "./notifications/notificationComponent"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"

const Header = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo)
  const router = useRouter()
  const pathname = usePathname()
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const menuItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Khóa học", path: "/course" },
    { label: "Giảng viên", path: "/lecture" },
    { label: "Liên hệ", path: "/contact" },
  ]

  const { theme, setTheme } = useTheme()
  const dispatch = useDispatch()

  // State cho thông báo
  const [_notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Khóa học mới đã được thêm!",
      date: "2025-03-07",
      link: "/course/new",
      isRead: false,
    },
    {
      id: 2,
      message: "Bạn có một tin nhắn mới.",
      date: "2025-03-06",
      link: "/messages",
      isRead: true,
    },
  ])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const handleGetCurrentUser = async () => {
    const response = await APIGetCurrentUser()
    if (response?.status === 200) {
      if (userInfo !== response.data) {
        dispatch(setUser(response.data))
      }
    }
  }

  const handleLogOut = () => {
    router.push("/login")
    localStorage.setItem("access_token", "")
    localStorage.setItem("refresh_token", "")
    localStorage.setItem("expires_at", "")
    dispatch(clearUser())
  }

  const handleSearchFocus = () => {
    setIsSearchExpanded(true)
  }

  const handleSearchBlur = () => {
    if (!searchValue) {
      setIsSearchExpanded(false)
    }
  }

  const handleSearchClose = () => {
    setSearchValue("")
    setIsSearchExpanded(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      // Handle search logic here
      console.log("Searching for:", searchValue)
      // You can navigate to search results page or perform search
    }
  }

  useEffect(() => {
    handleGetCurrentUser()
  }, [])

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
                    {menuItems.map((item) => (
                      <Button
                        key={item.path}
                        variant="ghost"
                        onClick={() => {
                          router.push(item.path)
                          const closeEvent = new Event("close-sheet")
                          window.dispatchEvent(closeEvent)
                        }}
                        className={`justify-start ${
                          pathname === item.path ? "bg-muted font-medium text-LavenderIndigo dark:text-PaleViolet" : ""
                        }`}
                      >
                        {item.label}
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        router.push("/favorites")
                        const closeEvent = new Event("close-sheet")
                        window.dispatchEvent(closeEvent)
                      }}
                      className={`justify-start ${
                        pathname === "/favorites" ? "bg-muted font-medium text-LavenderIndigo dark:text-PaleViolet" : ""
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
          <div
            className="text-xl font-bold cursor-pointer w-10 h-10 text-LavenderIndigo dark:text-PaleViolet"
            onClick={() => router.push("/")}
          >
            <img src="/images/logo.png" alt="Logo" className="w-10 h-10" />
          </div>
        </div>

        {/* Desktop Navigation - Hidden when search is expanded */}
        {!isSearchExpanded && (
          <nav className="hidden sm:flex items-center space-x-8 ml-8">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.path
                    ? "text-LavenderIndigo dark:text-PaleViolet font-semibold"
                    : "text-muted-foreground"
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
            isSearchExpanded ? "flex-1 mx-4" : "ml-auto mr-4 w-48 sm:w-64"
          }`}
        >
          <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform duration-300 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="pl-10 pr-10 h-10 rounded-full bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-LavenderIndigo"
              />
              {searchValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleSearchClose}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Action Buttons - Hidden when search is expanded on mobile */}
          {!isSearchExpanded && (
            <>
              {/* Favorites Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/favorites")}
                className="rounded-full bg-muted/50 hover:bg-muted hidden sm:flex"
                title="Khóa học yêu thích"
              >
                <Heart className="h-5 w-5 transition-all text-redPigment" fill="red" />
                <span className="sr-only">Khóa học yêu thích</span>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full bg-muted/50 hover:bg-muted hidden sm:flex"
              >
                {theme === "light" ? (
                  <Sun className="h-5 w-5 transition-all" />
                ) : (
                  <Moon className="h-5 w-5 transition-all" />
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
              className="bg-gradient-to-r from-LavenderIndigo to-majorelleBlue hover:brightness-110 text-white"
              onClick={() => router.push("/login")}
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
                        "/placeholder.svg" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt={userInfo.username || "User"}
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
                  <DropdownMenuItem onClick={() => router.push("/profile/student")}>
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    <span>Tài khoản</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/billing")}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Thanh toán</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Thông báo</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-carminePink focus:text-carminePink" onClick={handleLogOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
