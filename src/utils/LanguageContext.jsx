import { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('storymaker-language') || 'english';
    setLanguage(savedLanguage);
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'english' ? 'bangla' : 'english';
    setLanguage(newLanguage);
    localStorage.setItem('storymaker-language', newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};