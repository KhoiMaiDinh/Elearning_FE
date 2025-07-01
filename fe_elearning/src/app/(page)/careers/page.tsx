'use client';

import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Code,
  Palette,
  BarChart3,
  HeadphonesIcon,
} from 'lucide-react';
import AnimateWrapper from '@/components/animations/animateWrapper';

const CareersPage = () => {
  const jobPositions = [
    {
      title: 'Frontend Developer',
      department: 'Phát triển sản phẩm',
      location: 'Hồ Chí Minh',
      type: 'Full-time',
      salary: '20-35 triệu',
      icon: <Code className="w-6 h-6" />,
      description: 'Phát triển giao diện người dùng với React, NextJS và TypeScript',
      requirements: [
        '2+ năm kinh nghiệm React/NextJS',
        'Thành thạo TypeScript',
        'Kinh nghiệm responsive design',
      ],
    },
    {
      title: 'Backend Developer',
      department: 'Phát triển sản phẩm',
      location: 'Hồ Chí Minh',
      type: 'Full-time',
      salary: '25-40 triệu',
      icon: <Code className="w-6 h-6" />,
      description: 'Xây dựng và maintain hệ thống backend scalable',
      requirements: [
        '3+ năm kinh nghiệm Node.js/Python',
        'Kinh nghiệm database design',
        'Hiểu biết về microservices',
      ],
    },
    {
      title: 'Product Designer',
      department: 'Thiết kế',
      location: 'Hồ Chí Minh',
      type: 'Full-time',
      salary: '18-30 triệu',
      icon: <Palette className="w-6 h-6" />,
      description: 'Thiết kế trải nghiệm người dùng cho các sản phẩm giáo dục',
      requirements: [
        '3+ năm kinh nghiệm UX/UI',
        'Thành thạo Figma',
        'Portfolio mạnh về education products',
      ],
    },
    {
      title: 'Content Marketing Manager',
      department: 'Marketing',
      location: 'Hồ Chí Minh',
      type: 'Full-time',
      salary: '15-25 triệu',
      icon: <BarChart3 className="w-6 h-6" />,
      description: 'Phát triển và thực hiện chiến lược content marketing',
      requirements: [
        '2+ năm kinh nghiệm content marketing',
        'Kỹ năng viết tốt',
        'Hiểu biết về SEO',
      ],
    },
    {
      title: 'Customer Success Manager',
      department: 'Chăm sóc khách hàng',
      location: 'Hồ Chí Minh',
      type: 'Full-time',
      salary: '12-20 triệu',
      icon: <HeadphonesIcon className="w-6 h-6" />,
      description: 'Đảm bảo sự hài lòng và thành công của khách hàng',
      requirements: [
        '1+ năm kinh nghiệm customer service',
        'Kỹ năng giao tiếp tốt',
        'Tiếng Anh giao tiếp',
      ],
    },
    {
      title: 'DevOps Engineer',
      department: 'Phát triển sản phẩm',
      location: 'Remote',
      type: 'Full-time',
      salary: '30-50 triệu',
      icon: <Code className="w-6 h-6" />,
      description: 'Quản lý infrastructure và CI/CD pipeline',
      requirements: [
        '3+ năm kinh nghiệm DevOps',
        'Thành thạo AWS/Docker/K8s',
        'Kinh nghiệm monitoring systems',
      ],
    },
  ];

  const benefits = [
    'Lương cạnh tranh + thưởng hiệu suất',
    'Bảo hiểm sức khỏe cao cấp',
    'Flexible working hours',
    'Work from home 2 ngày/tuần',
    'Budget học tập 10 triệu/năm',
    'Team building & du lịch công ty',
    'Môi trường trẻ trung, năng động',
    'Cơ hội phát triển career path rõ ràng',
  ];

  const process = [
    { step: 1, title: 'Ứng tuyển online', description: 'Gửi CV qua website hoặc email' },
    { step: 2, title: 'Screening call', description: 'Gọi điện trao đổi sơ bộ (15-20 phút)' },
    { step: 3, title: 'Technical test', description: 'Làm bài test kỹ thuật tại nhà' },
    { step: 4, title: 'Interview', description: 'Phỏng vấn trực tiếp với team' },
    { step: 5, title: 'Offer', description: 'Nhận offer và thương lượng' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-eerieBlack">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimateWrapper delay={0.1} direction="up">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Tuyển dụng tại <span className="text-LavenderIndigo">NovaLearn</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Tham gia đội ngũ những con người đam mê giáo dục và công nghệ. Cùng chúng tôi xây
                dựng tương lai giáo dục Việt Nam.
              </p>
            </div>
          </AnimateWrapper>
        </div>
      </section>

      {/* Job Positions */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimateWrapper delay={0.2} direction="up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Vị trí đang tuyển
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Các cơ hội nghề nghiệp hấp dẫn đang chờ bạn
              </p>
            </div>
          </AnimateWrapper>

          <div className="grid md:grid-cols-2 gap-6">
            {jobPositions.map((job, index) => (
              <AnimateWrapper key={index} delay={0.2 + index * 0.1} direction="up">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-LavenderIndigo mr-3">{job.icon}</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {job.title}
                        </h3>
                        <p className="text-LavenderIndigo font-medium">{job.department}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">{job.description}</p>

                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {job.type}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {job.salary}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Yêu cầu:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      {job.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <button className="w-full bg-LavenderIndigo hover:bg-LavenderIndigo/90 text-white py-2 px-4 rounded-lg font-semibold transition-colors">
                    Ứng tuyển ngay
                  </button>
                </div>
              </AnimateWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <AnimateWrapper delay={0.2} direction="up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Quyền lợi & Phúc lợi
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Chúng tôi quan tâm đến sự phát triển và hạnh phúc của nhân viên
              </p>
            </div>
          </AnimateWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <AnimateWrapper key={index} delay={0.2 + index * 0.1} direction="up">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                  <div className="w-2 h-2 bg-LavenderIndigo rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-700 dark:text-gray-300">{benefit}</p>
                </div>
              </AnimateWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimateWrapper delay={0.2} direction="up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Quy trình tuyển dụng
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                5 bước đơn giản để gia nhập NovaLearn
              </p>
            </div>
          </AnimateWrapper>

          <div className="grid md:grid-cols-5 gap-6">
            {process.map((step, index) => (
              <AnimateWrapper key={index} delay={0.2 + index * 0.1} direction="up">
                <div className="text-center">
                  <div className="w-12 h-12 bg-LavenderIndigo rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">{step.step}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              </AnimateWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <AnimateWrapper delay={0.2} direction="up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Sẵn sàng tham gia NovaLearn?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Gửi CV của bạn hoặc liên hệ với chúng tôi để tìm hiểu thêm về các cơ hội nghề nghiệp
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:careers@novallearn.com"
                className="bg-LavenderIndigo hover:bg-LavenderIndigo/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Gửi CV ngay
              </a>
              <a
                href="/contact"
                className="border border-LavenderIndigo text-LavenderIndigo hover:bg-LavenderIndigo hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Liên hệ HR
              </a>
            </div>
          </AnimateWrapper>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
