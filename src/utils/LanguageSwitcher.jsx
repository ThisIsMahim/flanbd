import { useContext } from 'react';
import { LanguageContext } from '../utils/LanguageContext';

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useContext(LanguageContext);

  return (
    <button 
      onClick={() => changeLanguage(language === 'english' ? 'bengali' : 'english')}
    >
      {language === 'english' ? 'বাংলা' : 'English'}
    </button>
  );
};