'use client';

import { Linkedin, Twitter, Mail, Github } from 'lucide-react';
import Image from 'next/image';
import AnimateWrapper from '@/components/animations/animateWrapper';

const TeamPage = () => {
  const teamMembers = [
    {
      name: 'Nguyễn Văn An',
      position: 'CEO & Founder',
      image: '/images/avt1.jpg',
      description:
        'Chuyên gia công nghệ giáo dục với hơn 15 năm kinh nghiệm trong lĩnh vực phát triển sản phẩm và quản lý doanh nghiệp.',
      social: {
        linkedin: 'https://www.linkedin.com/',
        twitter: 'https://x.com/',
        email: 'an@novallearn.com',
      },
    },
    {
      name: 'Trần Thị Bình',
      position: 'CTO',
      image: '/images/avt2.jpg',
      description:
        'Kỹ sư phần mềm senior với chuyên môn sâu về AI, Machine Learning và kiến trúc hệ thống quy mô lớn.',
      social: {
        linkedin: 'https://www.linkedin.com/',
        github: 'https://github.com/',
        email: 'binh@novallearn.com',
      },
    },
    {
      name: 'Lê Văn Cường',
      position: 'Head of Education',
      image: '/images/avt3.jpg',
      description:
        'Tiến sĩ Giáo dục học với 20 năm kinh nghiệm trong nghiên cứu và phát triển chương trình đào tạo hiện đại.',
      social: {
        linkedin: 'https://www.linkedin.com/',
        twitter: 'https://x.com/',
        email: 'cuong@novallearn.com',
      },
    },
    {
      name: 'Phạm Thị Dung',
      position: 'Head of Design',
      image: '/images/avt4.jpg',
      description:
        'Designer hàng đầu với hơn 12 năm kinh nghiệm trong thiết kế UX/UI và nghiên cứu trải nghiệm người dùng.',
      social: {
        linkedin: 'https://www.linkedin.com/',
        twitter: 'https://x.com/',
        email: 'dung@novallearn.com',
      },
    },
    {
      name: 'Hoàng Minh Đức',
      position: 'Head of Marketing',
      image: '/images/avt1.jpg',
      description:
        'Chuyên gia marketing số với kinh nghiệm phát triển thương hiệu và chiến lược tiếp thị cho các công ty công nghệ.',
      social: {
        linkedin: 'https://www.linkedin.com/',
        twitter: 'https://x.com/',
        email: 'duc@novallearn.com',
      },
    },
    {
      name: 'Vũ Thị Hoa',
      position: 'Head of Content',
      image: '/images/avt2.jpg',
      description:
        'Chuyên gia nội dung giáo dục với kinh nghiệm phát triển curriculum và quản lý chất lượng khóa học trực tuyến.',
      social: {
        linkedin: 'https://www.linkedin.com/',
        twitter: 'https://x.com/',
        email: 'hoa@novallearn.com',
      },
    },
  ];

  const departments = [
    {
      name: 'Phát triển sản phẩm',
      count: 25,
      description: 'Đỗng ngũ kỹ sư và designer tài năng',
    },
    {
      name: 'Giáo dục & Nội dung',
      count: 18,
      description: 'Chuyên gia giáo dục và content creator',
    },
    {
      name: 'Marketing & Sales',
      count: 12,
      description: 'Đội ngừ marketing và kinh doanh',
    },
    {
      name: 'Vận hành & Hỗ trợ',
      count: 15,
      description: 'Đội ngũ vận hành và chăm sóc khách hàng',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-eerieBlack">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimateWrapper delay={0.1} direction="up">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Đội ngũ <span className="text-LavenderIndigo">NovaLearn</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Những con người tài năng và đam mê đang cùng nhau xây dựng tương lai giáo dục
              </p>
            </div>
          </AnimateWrapper>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimateWrapper delay={0.2} direction="up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Ban lãnh đạo
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Những người định hình tầm nhìn và chiến lược của NovaLearn
              </p>
            </div>
          </AnimateWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <AnimateWrapper key={index} delay={0.2 + index * 0.1} direction="up">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {member.name}
                    </h3>
                    <p className="text-LavenderIndigo font-medium mb-4">{member.position}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                      {member.description}
                    </p>
                    <div className="flex justify-center space-x-4">
                      {member.social.linkedin && (
                        <a
                          href={member.social.linkedin}
                          className="text-gray-400 hover:text-LavenderIndigo transition"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {member.social.twitter && (
                        <a
                          href={member.social.twitter}
                          className="text-gray-400 hover:text-LavenderIndigo transition"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {member.social.github && (
                        <a
                          href={member.social.github}
                          className="text-gray-400 hover:text-LavenderIndigo transition"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {member.social.email && (
                        <a
                          href={`mailto:${member.social.email}`}
                          className="text-gray-400 hover:text-LavenderIndigo transition"
                        >
                          <Mail className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </AnimateWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Overview */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <AnimateWrapper delay={0.2} direction="up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Các phòng ban
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Tổng quan về các bộ phận trong tổ chức
              </p>
            </div>
          </AnimateWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <AnimateWrapper key={index} delay={0.2 + index * 0.1} direction="up">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-LavenderIndigo mb-2">{dept.count}</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {dept.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{dept.description}</p>
                </div>
              </AnimateWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Culture & Values */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimateWrapper delay={0.2} direction="left">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Văn hóa công ty
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Tại NovaLearn, chúng tôi tin rằng môi trường làm việc tích cực và sáng tạo là nền
                  tảng để tạo ra những sản phẩm giáo dục xuất sắc.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-LavenderIndigo rounded-full mt-2 mr-3"></div>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Đổi mới sáng tạo:</strong> Khuyến khích thử nghiệm và học hỏi từ thất
                      bại
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-LavenderIndigo rounded-full mt-2 mr-3"></div>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Hợp tác đội nhóm:</strong> Làm việc cùng nhau để đạt được mục tiêu
                      chung
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-LavenderIndigo rounded-full mt-2 mr-3"></div>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Học tập liên tục:</strong> Không ngừng phát triển bản thân và chuyên
                      môn
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-LavenderIndigo rounded-full mt-2 mr-3"></div>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Cân bằng cuộc sống:</strong> Đảm bảo sự cân bằng giữa công việc và
                      cuộc sống
                    </p>
                  </div>
                </div>
              </div>
            </AnimateWrapper>

            <AnimateWrapper delay={0.4} direction="right">
              <div className="relative">
                <Image
                  src="/images/dashboard_bg.png"
                  alt="Team Culture"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg object-cover"
                />
              </div>
            </AnimateWrapper>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <AnimateWrapper delay={0.2} direction="up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Tham gia đội ngũ NovaLearn
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Bạn có đam mê với giáo dục và công nghệ? Hãy cùng chúng tôi xây dựng tương lai giáo
              dục!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/careers"
                className="bg-LavenderIndigo hover:bg-LavenderIndigo/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Xem vị trí tuyển dụng
              </a>
              <a
                href="/contact"
                className="border border-LavenderIndigo text-LavenderIndigo hover:bg-LavenderIndigo hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Liên hệ với chúng tôi
              </a>
            </div>
          </AnimateWrapper>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
