'use client';

import {
  Mail,
  Phone,
  MessageCircle,
  Clock,
  BookOpen,
  CreditCard,
  Settings,
  Users,
  FileText,
  Video,
} from 'lucide-react';
import AnimateWrapper from '@/components/animations/animateWrapper';

const SupportPage = () => {
  const supportChannels = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Live Chat',
      description: 'Trò chuyện trực tiếp với nhân viên hỗ trợ',
      availability: '24/7',
      action: 'Bắt đầu chat',
      color: 'bg-green-500',
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Email Support',
      description: 'Gửi email chi tiết về vấn đề của bạn',
      availability: 'Phản hồi trong 2-4 giờ',
      action: 'Gửi email',
      color: 'bg-blue-500',
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: 'Hotline',
      description: 'Gọi điện để được hỗ trợ ngay lập tức',
      availability: '8:00 - 22:00 hàng ngày',
      action: '1900-xxx-xxx',
      color: 'bg-purple-500',
    },
  ];

  const helpCategories = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Hướng dẫn học tập',
      description: 'Cách sử dụng nền tảng và tối ưu trải nghiệm học',
      topics: [
        'Cách đăng ký khóa học',
        'Sử dụng video player',
        'Theo dõi tiến độ học',
        'Làm bài tập và quiz',
      ],
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Thanh toán & Hoàn tiền',
      description: 'Thông tin về thanh toán, hóa đơn và chính sách hoàn tiền',
      topics: [
        'Các phương thức thanh toán',
        'Chính sách hoàn tiền',
        'Vấn đề thanh toán',
        'Hóa đơn và receipt',
      ],
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: 'Tài khoản & Cài đặt',
      description: 'Quản lý tài khoản, mật khẩu và thông tin cá nhân',
      topics: ['Đổi mật khẩu', 'Cập nhật thông tin', 'Xóa tài khoản', 'Cài đặt thông báo'],
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: 'Kỹ thuật & Lỗi',
      description: 'Khắc phục sự cố kỹ thuật và lỗi hệ thống',
      topics: ['Video không load', 'Lỗi đăng nhập', 'Trang web chậm', 'Lỗi thanh toán'],
    },
  ];

  const quickGuides = [
    {
      title: 'Cách đăng ký khóa học',
      steps: [
        'Tìm kiếm khóa học phù hợp',
        'Xem preview và thông tin chi tiết',
        'Click "Mua ngay" hoặc "Thêm vào giỏ"',
        'Điền thông tin thanh toán',
        'Xác nhận và hoàn tất thanh toán',
      ],
    },
    {
      title: 'Cách theo dõi tiến độ học',
      steps: [
        'Đăng nhập vào tài khoản',
        'Vào mục "Khóa học của tôi"',
        'Chọn khóa học muốn xem',
        'Kiểm tra thanh tiến độ',
        'Xem thống kê học tập chi tiết',
      ],
    },
    {
      title: 'Cách lấy chứng chỉ',
      steps: [
        'Hoàn thành 100% bài học',
        'Đạt điểm tối thiểu ở bài kiểm tra',
        'Vào phần "Chứng chỉ"',
        'Click "Tải xuống chứng chỉ"',
        'Lưu file PDF về máy',
      ],
    },
  ];

  const workingHours = [
    { day: 'Thứ 2 - Thứ 6', hours: '8:00 - 22:00' },
    { day: 'Thứ 7 - Chủ nhật', hours: '9:00 - 18:00' },
    { day: 'Ngày lễ', hours: '10:00 - 16:00' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-eerieBlack">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimateWrapper delay={0.1} direction="up">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Trung tâm trợ giúp
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Chúng tôi luôn sẵn sàng hỗ trợ bạn có trải nghiệm học tập tốt nhất tại NovaLearn
              </p>
            </div>
          </AnimateWrapper>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimateWrapper delay={0.2} direction="up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Liên hệ hỗ trợ
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Chọn cách thức liên hệ phù hợp nhất với bạn
              </p>
            </div>
          </AnimateWrapper>

          <div className="grid md:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => (
              <AnimateWrapper key={index} delay={0.2 + index * 0.1} direction="up">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                  <div
                    className={`${channel.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white`}
                  >
                    {channel.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {channel.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{channel.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {channel.availability}
                  </p>
                  <button className="w-full bg-LavenderIndigo hover:bg-LavenderIndigo/90 text-white py-2 px-4 rounded-lg font-semibold transition-colors">
                    {channel.action}
                  </button>
                </div>
              </AnimateWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <AnimateWrapper delay={0.2} direction="up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Tìm hiểu thêm
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Khám phá các chủ đề hỗ trợ phổ biến
              </p>
            </div>
          </AnimateWrapper>

          <div className="grid md:grid-cols-2 gap-8">
            {helpCategories.map((category, index) => (
              <AnimateWrapper key={index} delay={0.2 + index * 0.1} direction="up">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-LavenderIndigo mr-4">{category.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {category.topics.map((topic, idx) => (
                      <li key={idx} className="flex items-center text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-LavenderIndigo rounded-full mr-3"></div>
                        <a href="#" className="hover:text-LavenderIndigo transition-colors">
                          {topic}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Guides */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimateWrapper delay={0.2} direction="up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Hướng dẫn nhanh
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Các hướng dẫn từng bước cho những tác vụ phổ biến
              </p>
            </div>
          </AnimateWrapper>

          <div className="grid md:grid-cols-3 gap-8">
            {quickGuides.map((guide, index) => (
              <AnimateWrapper key={index} delay={0.2 + index * 0.1} direction="up">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {guide.title}
                  </h3>
                  <ol className="space-y-3">
                    {guide.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="bg-LavenderIndigo text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-gray-600 dark:text-gray-300 text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </AnimateWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Working Hours */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <AnimateWrapper delay={0.2} direction="up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Giờ làm việc
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Thời gian đội ngũ hỗ trợ có mặt để giúp đỡ bạn
              </p>
            </div>
          </AnimateWrapper>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="grid md:grid-cols-3 gap-6">
              {workingHours.map((schedule, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-LavenderIndigo mr-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">{schedule.day}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{schedule.hours}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-center text-sm text-blue-800 dark:text-blue-200">
                <strong>Lưu ý:</strong> Live chat và email support hoạt động 24/7. Hotline chỉ hoạt
                động trong giờ làm việc trên.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <AnimateWrapper delay={0.2} direction="up">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">
                Hỗ trợ khẩn cấp
              </h2>
              <p className="text-red-700 dark:text-red-300 mb-6">
                Nếu bạn gặp vấn đề nghiêm trọng ảnh hưởng đến việc học tập, hãy liên hệ ngay với
                chúng tôi qua:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:emergency@novallearn.com"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  emergency@novallearn.com
                </a>
                <a
                  href="tel:+84-xxx-xxx-xxx"
                  className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Hotline khẩn cấp: +84-xxx-xxx-xxx
                </a>
              </div>
            </div>
          </AnimateWrapper>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
