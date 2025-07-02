'use client';

import { Users, Target, Eye, Heart, BookOpen, Award, Zap, Shield } from 'lucide-react';
import Image from 'next/image';
import AnimateWrapper from '@/components/animations/animateWrapper';

const AboutPage = () => {
  const stats = [
    { number: '50,000+', label: 'Học viên' },
    { number: '1,000+', label: 'Khóa học' },
    { number: '500+', label: 'Giảng viên' },
    { number: '98%', label: 'Hài lòng' },
  ];

  const values = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Chất lượng giáo dục',
      description: 'Cam kết mang đến những khóa học chất lượng cao, cập nhật xu hướng mới nhất',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Cộng đồng học tập',
      description: 'Xây dựng môi trường học tập tích cực, hỗ trợ lẫn nhau để cùng phát triển',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Đổi mới sáng tạo',
      description: 'Ứng dụng công nghệ tiên tiến để tạo ra trải nghiệm học tập tối ưu',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Tin cậy & Uy tín',
      description: 'Đảm bảo tính minh bạch, bảo mật thông tin và quyền lợi người học',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-eerieBlack">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimateWrapper delay={0.1} direction="up">
            <div className="text-center ">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Về <span className="text-LavenderIndigo">NovaLearn</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Nền tảng học tập trực tuyến hàng đầu Việt Nam, nơi tri thức gặp gỡ công nghệ để tạo
                nên những trải nghiệm học tập vượt trội.
              </p>
            </div>
          </AnimateWrapper>

          {/* Stats */}
          <AnimateWrapper delay={0.3} direction="up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-LavenderIndigo mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimateWrapper>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimateWrapper delay={0.2} direction="left">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Câu chuyện của chúng tôi
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  NovaLearn được thành lập vào năm 2020 với sứ mệnh dân chủ hóa giáo dục, mang kiến
                  thức chất lượng cao đến với mọi người, mọi lúc, mọi nơi.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Chúng tôi tin rằng mỗi người đều có tiềm năng để học hỏi và phát triển. Với đội
                  ngũ chuyên gia giàu kinh nghiệm và công nghệ tiên tiến, chúng tôi không ngừng cải
                  tiến để mang đến trải nghiệm học tập tốt nhất.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Từ những khóa học đầu tiên đến hôm nay, chúng tôi đã đồng hành cùng hàng chục
                  nghìn học viên trên hành trình chinh phục tri thức và phát triển sự nghiệp.
                </p>
              </div>
            </AnimateWrapper>

            <AnimateWrapper delay={0.4} direction="right">
              <div className="relative">
                <Image
                  src="/images/dashboard_bg.jpg"
                  alt="NovaLearn Story"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg object-cover"
                />
              </div>
            </AnimateWrapper>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <AnimateWrapper delay={0.2} direction="up">
              <div className="text-center">
                <div className="w-16 h-16 bg-LavenderIndigo rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sứ mệnh</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Dân chủ hóa giáo dục bằng cách cung cấp các khóa học chất lượng cao, giá cả phải
                  chăng và dễ tiếp cận cho mọi người trên toàn thế giới. Chúng tôi cam kết trao
                  quyền cho người học để họ có thể đạt được mục tiêu cá nhân và nghề nghiệp.
                </p>
              </div>
            </AnimateWrapper>

            <AnimateWrapper delay={0.4} direction="up">
              <div className="text-center">
                <div className="w-16 h-16 bg-LavenderIndigo rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tầm nhìn</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Trở thành nền tảng học tập trực tuyến hàng đầu tại Việt Nam và khu vực, nơi mà
                  việc học tập trở nên thú vị, hiệu quả và phù hợp với từng cá nhân. Chúng tôi hướng
                  tới một tương lai nơi mọi người đều có cơ hội phát triển bản thân thông qua giáo
                  dục.
                </p>
              </div>
            </AnimateWrapper>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <AnimateWrapper delay={0.2} direction="up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Giá trị cốt lõi
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Những nguyên tắc định hướng mọi hoạt động của chúng tôi
              </p>
            </div>
          </AnimateWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <AnimateWrapper key={index} delay={0.2 + index * 0.1} direction="up">
                <div className="text-center p-6 h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-LavenderIndigo mb-4 flex justify-center">{value.icon}</div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </AnimateWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <AnimateWrapper delay={0.2} direction="up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Cùng chúng tôi kiến tạo tương lai
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Tham gia cộng đồng học tập NovaLearn và bắt đầu hành trình phát triển bản thân của bạn
              ngay hôm nay
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/course"
                className="border border-LavenderIndigo text-LavenderIndigo hover:bg-LavenderIndigo hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Khám phá khóa học
              </a>
            </div>
          </AnimateWrapper>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
