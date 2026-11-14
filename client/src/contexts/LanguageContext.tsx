import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage } from '../types';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Brand & Navigation
    'brand.name': 'KisanAI',
    'brand.subtitle': 'AI-Powered Crop Advisory Assistant',
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.cropAdvisory': 'Crop Advisory',
    'nav.soilAdvisory': 'Soil Advisory',
    'nav.fertilizerAdvisory': 'Fertilizer Guide',
    'nav.irrigationAdvisory': 'Irrigation Guide',
    'nav.diseaseAdvisory': 'Disease & Pest',
    'nav.chatbot': 'AI Assistant',
    'nav.history': 'Advisory History',
    'nav.profile': 'Farmer Profile',
    'nav.settings': 'Settings',
    'nav.login': 'Log In',
    'nav.register': 'Get Started',
    'nav.logout': 'Sign Out',

    // Dashboard
    'dashboard.welcome': 'Welcome back,',
    'dashboard.subtitle': 'Here is your farm advisory overview and recent crop insights.',
    'dashboard.stat.advisories': 'Total Advisories',
    'dashboard.stat.conversations': 'AI Consultations',
    'dashboard.stat.savedCrops': 'Saved Crops',
    'dashboard.stat.weather': 'Local Weather',
    'dashboard.quickActions': 'Quick Farming Tools',
    'dashboard.newCropAdvisory': 'Get Crop Recommendations',
    'dashboard.checkSoil': 'Analyze Soil Health',
    'dashboard.askAi': 'Ask Agricultural Assistant',
    'dashboard.recentAdvisories': 'Recent Recommendations',
    'dashboard.topCrops': 'Most Recommended Crops',
    'dashboard.advisoryDistribution': 'Advisory Category Breakdown',

    // Multi-step Crop Form
    'form.step.location': 'Location',
    'form.step.land': 'Land Details',
    'form.step.soil': 'Soil Profile',
    'form.step.water': 'Water & Irrigation',
    'form.step.season': 'Farming Season',
    'form.step.preferences': 'Preferences',
    'form.step.review': 'Review & Submit',
    'form.next': 'Continue',
    'form.prev': 'Back',
    'form.submit': 'Generate AI Recommendations',
    'form.generating': 'Analyzing Soil & Agro-Climatic Data with Gemini...',

    // Soil & Advisory
    'soil.type': 'Soil Type',
    'soil.ph': 'Soil pH (0-14)',
    'soil.nitrogen': 'Nitrogen (N) kg/ha',
    'soil.phosphorus': 'Phosphorus (P) kg/ha',
    'soil.potassium': 'Potassium (K) kg/ha',
    'soil.organicCarbon': 'Organic Carbon %',
    'soil.tested': 'Laboratory Soil Test Done?',

    // Water
    'water.availability': 'Water Availability',
    'water.irrigationMethod': 'Irrigation Method',

    // Seasons
    'season.kharif': 'Kharif (Monsoon / Autumn)',
    'season.rabi': 'Rabi (Winter / Spring)',
    'season.zaid': 'Zaid (Summer)',
    'season.perennial': 'Perennial / Year-Round',

    // General
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.view': 'View Details',
    'common.loading': 'Loading...',
    'common.disclaimer': 'Disclaimer',
    'common.expertNotice': 'Always consult your nearest Krishi Vigyan Kendra (KVK) or agriculture extension office for certified field validation.',
  },
  hi: {
    // Brand & Navigation
    'brand.name': 'किसान एआई',
    'brand.subtitle': 'एआई-संचालित फसल सलाह सहायक',
    'nav.home': 'होम',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.cropAdvisory': 'फसल सलाह',
    'nav.soilAdvisory': 'मृदा सलाह',
    'nav.fertilizerAdvisory': 'उर्वरक प्रबंधन',
    'nav.irrigationAdvisory': 'सिंचाई प्रबंधन',
    'nav.diseaseAdvisory': 'रोग एवं कीट सलाह',
    'nav.chatbot': 'कृषि सहायक चैट',
    'nav.history': 'सलाह इतिहास',
    'nav.profile': 'किसान प्रोफाइल',
    'nav.settings': 'सेटिंग्स',
    'nav.login': 'लॉग इन करें',
    'nav.register': 'शुरू करें',
    'nav.logout': 'लॉग आउट',

    // Dashboard
    'dashboard.welcome': 'नमस्ते, किसान भाई',
    'dashboard.subtitle': 'यहाँ आपकी कृषि सलाह और हालिया फसल सिफारिशों का विवरण है।',
    'dashboard.stat.advisories': 'कुल सलाह रिपोर्ट',
    'dashboard.stat.conversations': 'एआई परामर्श',
    'dashboard.stat.savedCrops': 'सहेजी गई फसलें',
    'dashboard.stat.weather': 'स्थानीय मौसम',
    'dashboard.quickActions': 'त्वरित कृषि उपकरण',
    'dashboard.newCropAdvisory': 'नई फसल सिफारिश प्राप्त करें',
    'dashboard.checkSoil': 'मिट्टी की जांच विश्लेषण',
    'dashboard.askAi': 'कृषि विशेषज्ञ से पूछें',
    'dashboard.recentAdvisories': 'हाल की सिफारिशें',
    'dashboard.topCrops': 'सर्वाधिक अनुशंसित फसलें',
    'dashboard.advisoryDistribution': 'सलाह श्रेणियों का विवरण',

    // Multi-step Crop Form
    'form.step.location': 'स्थान विवरण',
    'form.step.land': 'भूमि विवरण',
    'form.step.soil': 'मिट्टी की जानकारी',
    'form.step.water': 'जल एवं सिंचाई',
    'form.step.season': 'खेती का मौसम',
    'form.step.preferences': 'प्राथमिकताएं',
    'form.step.review': 'समीक्षा एवं सबमिट',
    'form.next': 'आगे बढ़ें',
    'form.prev': 'पीछे जाएं',
    'form.submit': 'एआई फसल सिफारिश प्राप्त करें',
    'form.generating': 'जेमिनी एआई द्वारा विश्लेषण जारी है...',

    // Soil & Advisory
    'soil.type': 'मिट्टी का प्रकार',
    'soil.ph': 'मिट्टी का पीएच (0-14)',
    'soil.nitrogen': 'नाइट्रोजन (N) किग्रा/हेक्टेयर',
    'soil.phosphorus': 'फास्फोरस (P) किग्रा/हेक्टेयर',
    'soil.potassium': 'पोटैशियम (K) किग्रा/हेक्टेयर',
    'soil.organicCarbon': 'जैविक कार्बन %',
    'soil.tested': 'क्या प्रयोगशाला में मिट्टी परीक्षण हुआ है?',

    // Water
    'water.availability': 'पानी की उपलब्धता',
    'water.irrigationMethod': 'सिंचाई की विधि',

    // Seasons
    'season.kharif': 'खरीफ (मानसून / वर्षा)',
    'season.rabi': 'रबी (शीतकालीन / गेहूं आदि)',
    'season.zaid': 'जायद (गर्मी की फसल)',
    'season.perennial': 'सदाबहार / बारहमासी',

    // General
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.delete': 'हटाएं',
    'common.view': 'विवरण देखें',
    'common.loading': 'लोड हो रहा है...',
    'common.disclaimer': 'अस्वीकरण',
    'common.expertNotice': 'अंतिम निर्णय लेने से पहले अपने नजदीकी कृषि विज्ञान केंद्र (KVK) या राज्य कृषि अधिकारी से परामर्श अवश्य लें।',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('kisan_language') as SupportedLanguage) || 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('kisan_language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
