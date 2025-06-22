'use client';
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  ArrowRight,
} from 'lucide-react';
import AnimateWrapper from '@/components/animations/animateWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SocialMediaGrid } from '@/components/contact/socialMediaGrid';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/constants/store';

const Page = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5" />
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimateWrapper delay={0.2} direction="left">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium">
                  <Mail className="w-4 h-4 mr-2" />
                  Liên hệ với chúng tôi
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Kết nối với NovaLearn
                  <br />
                  để nhận hỗ trợ nhanh chóng
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
                  Đội ngũ của chúng tôi luôn sẵn sàng lắng nghe, giải đáp thắc mắc và đồng hành cùng
                  bạn. Hãy để lại lời nhắn hoặc liên hệ trực tiếp — bạn sẽ nhận được phản hồi trong
                  thời gian sớm nhất.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-custom-gradient-button-violet text-white hover:brightness-110  px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    Liên hệ ngay
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-blue-200 hover:border-blue-300 px-8 py-3 rounded-xl transition-all duration-300"
                    onClick={() => {
                      const contactInfo = document.getElementById('contact-info');
                      if (contactInfo) {
                        contactInfo.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Xem thêm thông tin
                  </Button>
                </div>
              </div>
            </AnimateWrapper>

            <AnimateWrapper delay={0.4} direction="right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20 animate-pulse" />
                <img
                  src="/images/contact_bg.png"
                  alt="Khóa học"
                  className="relative w-full max-w-md mx-auto hover:scale-105 transition-transform duration-500"
                />
              </div>
            </AnimateWrapper>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <AnimateWrapper delay={0.3} direction="up">
            <div className="grid lg:grid-cols-2 gap-8 " id="contact-info">
              {/* Company Info Card */}
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          NovaLearn
                        </h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mt-1" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Địa chỉ</p>
                          <p className="text-gray-600 dark:text-gray-300">
                            Số 6, phường Linh Trung, TP.Thủ Đức
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Điện thoại</p>
                          <p className="text-gray-600 dark:text-gray-300">0987 887 656</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Email</p>
                          <p className="text-gray-600 dark:text-gray-300">elearning@gmail.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media Card */}
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {/* Using our new custom social media grid component */}
                    <SocialMediaGrid
                      platforms={[
                        { platform: 'facebook', url: 'https://www.facebook.com/' },
                        { platform: 'instagram', url: 'https://www.instagram.com/' },
                        { platform: 'twitter', url: 'https://www.twitter.com/' },
                        { platform: 'linkedin', url: 'https://www.linkedin.com/' },
                      ]}
                      size={28}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </AnimateWrapper>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimateWrapper delay={0.2} direction="up" amount={0.1}>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Vị trí của chúng tôi
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Ghé thăm văn phòng của chúng tôi để được tư vấn trực tiếp và trải nghiệm không gian
                học tập hiện đại
              </p>
            </div>

            <Card className="overflow-hidden shadow-2xl border-0">
              <CardContent className="p-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2811.1267908210693!2d106.80047917317096!3d10.870014157464315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527587e9ad5bf%3A0xafa66f9c8be3c91!2sUniversity%20of%20Information%20Technology%20-%20VNUHCM!5e1!3m2!1sen!2s!4v1740718066994!5m2!1sen!2s"
                  className="w-full h-[400px] lg:h-[500px] hover:contrast-110 transition-all duration-300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </CardContent>
            </Card>
          </AnimateWrapper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <AnimateWrapper delay={0.3} direction="up">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Sẵn sàng bắt đầu hành trình học tập?
              </h2>
              <p className="text-xl text-blueberry">
                Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí về các khóa học phù hợp
              </p>
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={() => {
                  const email = 'support@novalearn.com';
                  const subject = encodeURIComponent('Hỗ trợ dịch vụ - Khách hàng yêu cầu');
                  const body = encodeURIComponent(
                    `Kính gửi Quý công ty,\n\nTôi là ${userInfo?.last_name} ${userInfo?.first_name}, hiện đang quan tâm và cần được hỗ trợ về dịch vụ của Quý công ty. Mong Quý công ty vui lòng liên hệ và hỗ trợ tôi trong thời gian sớm nhất.\n\nThông tin liên hệ:\n- Họ và tên: ${userInfo?.last_name} ${userInfo?.first_name}\n- Email: ${userInfo?.email}\n- Nội dung cần hỗ trợ: \n\nTrân trọng cảm ơn Quý công ty và mong sớm nhận được phản hồi.\n\nTrân trọng,\n ${userInfo?.last_name} ${userInfo?.first_name}`
                  );

                  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;

                  window.open(gmailUrl, '_blank');
                }}
              >
                Soạn email với Gmail
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </AnimateWrapper>
        </div>
      </section>
    </div>
  );
};

export default Page;
