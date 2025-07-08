'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="to-purple-50 relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="to-purple-200 absolute left-10 top-20 h-72 w-72 rounded-full bg-gradient-to-r from-blue-200 opacity-70 mix-blend-multiply blur-xl filter"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="to-pink-200 absolute right-10 top-40 h-96 w-96 rounded-full bg-gradient-to-r from-yellow-200 opacity-70 mix-blend-multiply blur-xl filter"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/2 h-64 w-64 rounded-full bg-gradient-to-r from-green-200 to-blue-200 opacity-70 mix-blend-multiply blur-xl filter"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-blue-300 opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
        <motion.div
          className="mx-auto flex w-full max-w-2xl flex-col items-center text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Animated icon container */}
          <motion.div
            className="relative mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              type: 'spring',
              bounce: 0.4,
            }}
          >
            <div className="to-purple-600 relative flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 shadow-2xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              <Sparkles className="h-16 w-16 text-white drop-shadow-lg" />

              {/* Floating sparkles around the icon */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-3 w-3 rounded-full bg-yellow-300"
                  style={{
                    left: `${50 + 40 * Math.cos((i * 60 * Math.PI) / 180)}%`,
                    top: `${50 + 40 * Math.sin((i * 60 * Math.PI) / 180)}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Error code with gradient animation */}
          <motion.h1
            className="via-purple-600 to-pink-600 mb-4 bg-gradient-to-r from-blue-600 bg-clip-text text-8xl font-black text-transparent drop-shadow-sm md:text-9xl"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
          >
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="text-gradient via-purple-600 to-pink-600 bg-300% bg-gradient-to-r from-blue-600 bg-clip-text text-transparent"
            >
              404
            </motion.span>
          </motion.h1>

          {/* Error message */}
          <motion.h2
            className="text-gray-800 mb-4 text-3xl font-bold tracking-tight md:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Oops! Trang không tồn tại
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-gray-600 mb-8 max-w-md text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Có vẻ như bạn đã lạc vào một vùng đất kỳ diệu mà chúng tôi chưa khám phá. Hãy quay về
            trang chủ để tiếp tục hành trình của bạn!
          </motion.p>

          {/* Action buttons */}
          <motion.div
            className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <Button
              asChild
              size="lg"
              className="to-purple-600 hover:to-purple-700 group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:shadow-xl"
            >
              <Link href="/">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <Home className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Về trang chủ
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-gray-200 hover:border-purple-300 hover:bg-purple-50 group rounded-xl border-2 bg-white/80 px-8 py-3 font-semibold backdrop-blur-sm transition-all duration-300"
              onClick={() => window.history.back()}
            >
              <RefreshCw className="mr-2 h-5 w-5 transition-transform duration-500 group-hover:rotate-180" />
              Quay lại
            </Button>
          </motion.div>

          {/* Search suggestion */}
          <motion.div
            className="border-gray-200 mt-12 rounded-2xl border bg-white/60 p-6 shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <div className="text-gray-600 flex items-center justify-center">
              <Search className="text-purple-500 mr-2 h-5 w-5" />
              <span className="text-sm">Hoặc thử tìm kiếm nội dung bạn cần trong trang chủ</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer message */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <p className="text-gray-500 border-gray-200 rounded-full border bg-white/50 px-6 py-3 text-sm backdrop-blur-sm">
            Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ với quản trị viên hệ thống.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
