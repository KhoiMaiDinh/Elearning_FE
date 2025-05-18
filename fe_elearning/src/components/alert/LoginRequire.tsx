"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LogIn, X } from 'lucide-react'

interface LoginRequiredPopupProps {
  isOpen: boolean
  onClose: () => void
  featureName?: string
  onLogin?: () => void
}

export function LoginRequiredPopup({
  isOpen,
  onClose,
  featureName = "tính năng này",
  onLogin
}: LoginRequiredPopupProps) {
  const router = useRouter()

  const handleLogin = () => {
    if (onLogin) {
      onLogin()
    } else {
      router.push("/login")
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader className="gap-2">
          <DialogTitle className="text-xl font-bold text-center">Đăng nhập để tiếp tục</DialogTitle>
          <DialogDescription className="text-center">
            Bạn cần đăng nhập để sử dụng {featureName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-center py-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <LogIn className="h-8 w-8 text-majorelleBlue" />
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto order-1 sm:order-none"
          >
            Hủy
          </Button>
          <Button 
            onClick={handleLogin}
            className="w-full sm:w-auto bg-gradient-to-r from-LavenderIndigo to-majorelleBlue hover:brightness-110 text-white"
          >
            Đăng nhập
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
