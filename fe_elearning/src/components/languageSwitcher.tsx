'use client';

import { useRouter } from 'next/navigation';

const LanguageSwitcher = () => {
  const router = useRouter();

  const changeLanguage = (lang: string) => {
    const currentPath = window.location.pathname;
    const newPath = `/${lang}${currentPath.replace(/^\/(en|vi)/, '')}`;
    router.push(newPath);
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')} className="p-2">
        English
      </button>
      <button onClick={() => changeLanguage('vi')} className="p-2">
        Tiếng Việt
      </button>
    </div>
  );
};

export default LanguageSwitcher;
