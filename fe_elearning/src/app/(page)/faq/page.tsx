'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import AnimateWrapper from '@/components/animations/animateWrapper';

const FAQPage = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      title: 'Tài khoản & Đăng ký',
      items: [
        {
          question: 'Làm thế nào để tạo tài khoản NovaLearn?',
          answer:
            'Bạn có thể tạo tài khoản bằng cách click vào nút "Đăng ký" ở góc phải trên cùng, sau đó điền thông tin cần thiết hoặc đăng ký qua Google.',
        },
        {
          question: 'Tôi quên mật khẩu, làm sao để khôi phục?',
          answer:
            'Click vào "Quên mật khẩu" ở trang đăng nhập, nhập email đã đăng ký và làm theo hướng dẫn trong email chúng tôi gửi.',
        },
        {
          question: 'Có thể thay đổi thông tin cá nhân không?',
          answer: 'Có, bạn có thể cập nhật thông tin cá nhân trong phần "Hồ sơ" sau khi đăng nhập.',
        },
      ],
    },
    {
      title: 'Khóa học & Học tập',
      items: [
        {
          question: 'Làm thế nào để mua khóa học?',
          answer:
            'Chọn khóa học bạn quan tâm, click "Mua ngay" và làm theo hướng dẫn thanh toán. Sau khi thanh toán thành công, bạn sẽ có quyền truy cập ngay lập tức.',
        },
        {
          question: 'Tôi có thể học offline không?',
          answer:
            'Hiện tại chưa hỗ trợ download video để học offline. Bạn cần kết nối internet để xem các bài học.',
        },
        {
          question: 'Khóa học có thời hạn không?',
          answer:
            'Sau khi mua, bạn có quyền truy cập trọn đời vào khóa học, bao gồm tất cả cập nhật trong tương lai.',
        },
        {
          question: 'Có chứng chỉ hoàn thành khóa học không?',
          answer:
            'Có, sau khi hoàn thành 100% nội dung khóa học và vượt qua bài kiểm tra cuối khóa, bạn sẽ nhận được chứng chỉ.',
        },
      ],
    },
    {
      title: 'Thanh toán & Hoàn tiền',
      items: [
        {
          question: 'Những phương thức thanh toán nào được hỗ trợ?',
          answer:
            'Chúng tôi hỗ trợ thanh toán qua thẻ tín dụng, thẻ ghi nợ, ví điện tử (MoMo, ZaloPay) và chuyển khoản ngân hàng.',
        },
        {
          question: 'Chính sách hoàn tiền như thế nào?',
          answer:
            'Bạn có thể yêu cầu hoàn tiền trong vòng 7 ngày đầu tiên nếu chưa hoàn thành quá 20% khóa học.',
        },
        {
          question: 'Có mã giảm giá hay khuyến mãi không?',
          answer:
            'Chúng tôi thường xuyên có các chương trình khuyến mãi. Đăng ký newsletter để nhận thông báo về các ưu đãi mới nhất.',
        },
      ],
    },
    {
      title: 'Kỹ thuật & Hỗ trợ',
      items: [
        {
          question: 'Video không tải được hoặc lag, phải làm sao?',
          answer:
            'Hãy thử refresh trang, kiểm tra kết nối internet hoặc thử trình duyệt khác. Nếu vẫn gặp vấn đề, liên hệ support.',
        },
        {
          question: 'Tôi có thể học trên điện thoại không?',
          answer:
            'Có, website NovaLearn được tối ưu cho mobile. Bạn có thể học mọi lúc mọi nơi trên điện thoại hoặc tablet.',
        },
        {
          question: 'Làm sao để liên hệ hỗ trợ kỹ thuật?',
          answer:
            'Bạn có thể liên hệ qua email support@novallearn.com, live chat trên website hoặc gọi hotline 1900-xxx-xxx.',
        },
      ],
    },
  ];

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const id = categoryIndex * 100 + itemIndex;
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <div className="min-h-screen bg-white dark:bg-eerieBlack">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimateWrapper delay={0.1} direction="up">
            <div className="text-center ">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Câu hỏi thường gặp
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Tìm câu trả lời nhanh chóng cho các thắc mắc phổ biến về NovaLearn
              </p>

              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm câu hỏi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-LavenderIndigo"
                />
              </div>
            </div>
          </AnimateWrapper>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {filteredCategories.map((category, categoryIndex) => (
            <AnimateWrapper key={categoryIndex} delay={0.2 + categoryIndex * 0.1} direction="up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {category.title}
                </h2>

                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => {
                    const id = categoryIndex * 100 + itemIndex;
                    const isOpen = openItems.includes(id);

                    return (
                      <div
                        key={itemIndex}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(categoryIndex, itemIndex)}
                          className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {item.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-LavenderIndigo" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-LavenderIndigo" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-4 border-t border-gray-200 dark:border-gray-600">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed pt-4">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </AnimateWrapper>
          ))}

          {filteredCategories.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Không tìm thấy câu hỏi nào phù hợp với "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <AnimateWrapper delay={0.2} direction="up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Không tìm thấy câu trả lời?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-LavenderIndigo hover:bg-LavenderIndigo/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Liên hệ hỗ trợ
              </a>
              <a
                href="/support"
                className="border border-LavenderIndigo text-LavenderIndigo hover:bg-LavenderIndigo hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Trung tâm trợ giúp
              </a>
            </div>
          </AnimateWrapper>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
