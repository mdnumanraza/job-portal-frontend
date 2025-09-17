"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type SupportedLanguage = "en" | "hi" | "ur"

interface LanguageContextType {
  currentLanguage: SupportedLanguage
  changeLanguage: (lang: SupportedLanguage) => void
  t: (section: string, key: string) => string
  languages: SupportedLanguage[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    nav: {
      home: "Home",
      jobs: "Jobs",
      dashboard: "Dashboard",
      employer: "Employer",
      login: "Login",
      register: "Register",
      logout: "Logout",
    },
    common: {
      search: "Search",
      filter: "Filter",
      apply: "Apply",
      save: "Save",
      cancel: "Cancel",
      submit: "Submit",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      back: "Back",
      next: "Next",
      previous: "Previous",
    },
    jobs: {
      title: "Job Opportunities",
      searchPlaceholder: "Search jobs...",
      categories: "Categories",
      location: "Location",
      type: "Job Type",
      salary: "Salary",
      featured: "Featured Jobs",
      recent: "Recent Jobs",
      noJobs: "No jobs found",
      applyNow: "Apply Now",
      fullTime: "Full Time",
      partTime: "Part Time",
      remote: "Remote",
      contract: "Contract",
    },
    categories: {
      imam: "Imam",
      teacher: "Teacher",
      tutor: "Tutor",
      helper: "Helper",
    },
    auth: {
      loginTitle: "Login to Your Account",
      registerTitle: "Create New Account",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      name: "Full Name",
      phone: "Phone Number",
      role: "Role",
      applicant: "Job Seeker",
      employer: "Employer",
      forgotPassword: "Forgot Password?",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
    },
    dashboard: {
      welcome: "Welcome to Dashboard",
      myApplications: "My Applications",
      myJobs: "My Jobs",
      profile: "Profile",
      settings: "Settings",
      statistics: "Statistics",
    },
  },
  hi: {
    nav: {
      home: "होम",
      jobs: "नौकरियां",
      dashboard: "डैशबोर्ड",
      employer: "नियोक्ता",
      login: "लॉगिन",
      register: "रजिस्टर",
      logout: "लॉगआउट",
    },
    common: {
      search: "खोजें",
      filter: "फिल्टर",
      apply: "आवेदन करें",
      save: "सेव करें",
      cancel: "रद्द करें",
      submit: "जमा करें",
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफलता",
      delete: "हटाएं",
      edit: "संपादित करें",
      view: "देखें",
      back: "वापस",
      next: "अगला",
      previous: "पिछला",
    },
    jobs: {
      title: "नौकरी के अवसर",
      searchPlaceholder: "नौकरी खोजें...",
      categories: "श्रेणियां",
      location: "स्थान",
      type: "नौकरी का प्रकार",
      salary: "वेतन",
      featured: "फीचर्ड नौकरियां",
      recent: "हाल की नौकरियां",
      noJobs: "कोई नौकरी नहीं मिली",
      applyNow: "अभी आवेदन करें",
      fulltime: "पूर्णकालिक",
      parttime: "अंशकालिक",
      remote: "रिमोट",
      contract: "अनुबंध",
    },
    categories: {
      imam: "इमाम",
      teacher: "शिक्षक",
      tutor: "ट्यूटर",
      helper: "सहायक",
    },
    auth: {
      loginTitle: "अपने खाते में लॉगिन करें",
      registerTitle: "नया खाता बनाएं",
      email: "ईमेल",
      password: "पासवर्ड",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      name: "पूरा नाम",
      phone: "फोन नंबर",
      role: "भूमिका",
      applicant: "नौकरी चाहने वाला",
      employer: "नियोक्ता",
      forgotPassword: "पासवर्ड भूल गए?",
      noAccount: "खाता नहीं है?",
      hasAccount: "पहले से खाता है?",
    },
    dashboard: {
      welcome: "डैशबोर्ड में आपका स्वागत है",
      myApplications: "मेरे आवेदन",
      myJobs: "मेरी नौकरियां",
      profile: "प्रोफाइल",
      settings: "सेटिंग्स",
      statistics: "आंकड़े",
    },
  },
  ur: {
    nav: {
      home: "ہوم",
      jobs: "ملازمتیں",
      dashboard: "ڈیش بورڈ",
      employer: "آجر",
      login: "لاگ ان",
      register: "رجسٹر",
      logout: "لاگ آؤٹ",
    },
    common: {
      search: "تلاش کریں",
      filter: "فلٹر",
      apply: "درخواست دیں",
      save: "محفوظ کریں",
      cancel: "منسوخ کریں",
      submit: "جمع کریں",
      loading: "لوڈ ہو رہا ہے...",
      error: "خرابی",
      success: "کامیابی",
      delete: "حذف کریں",
      edit: "ترمیم کریں",
      view: "دیکھیں",
      back: "واپس",
      next: "اگلا",
      previous: "پچھلا",
    },
    jobs: {
      title: "ملازمت کے مواقع",
      searchPlaceholder: "ملازمت تلاش کریں...",
      categories: "اقسام",
      location: "مقام",
      type: "ملازمت کی قسم",
      salary: "تنخواہ",
      featured: "نمایاں ملازمتیں",
      recent: "حالیہ ملازمتیں",
      noJobs: "کوئی ملازمت نہیں ملی",
      applyNow: "ابھی درخواست دیں",
      fulltime: "مکمل وقت",
      parttime: "جزوی وقت",
      remote: "ریموٹ",
      contract: "معاہدہ",
    },
    categories: {
      imam: "امام",
      teacher: "استاد",
      tutor: "ٹیوٹر",
      helper: "مددگار",
    },
    auth: {
      loginTitle: "اپنے اکاؤنٹ میں لاگ ان کریں",
      registerTitle: "نیا اکاؤنٹ بنائیں",
      email: "ای میل",
      password: "پاس ورڈ",
      confirmPassword: "پاس ورڈ کی تصدیق کریں",
      name: "پورا نام",
      phone: "فون نمبر",
      role: "کردار",
      applicant: "ملازمت کے متلاشی",
      employer: "آجر",
      forgotPassword: "پاس ورڈ بھول گئے؟",
      noAccount: "اکاؤنٹ نہیں ہے؟",
      hasAccount: "پہلے سے اکاؤنٹ ہے؟",
    },
    dashboard: {
      welcome: "ڈیش بورڈ میں خوش آمدید",
      myApplications: "میری درخواستیں",
      myJobs: "میری ملازمتیں",
      profile: "پروفائل",
      settings: "ترتیبات",
      statistics: "اعداد و شمار",
    },
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>("en")
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as SupportedLanguage
    if (savedLanguage && ["en", "hi", "ur"].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage)
    }
    setIsHydrated(true)
  }, [])

  const changeLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (section: string, key: string): string => {
    if (!isHydrated) return key // Prevent hydration mismatch
    return translations[currentLanguage]?.[section]?.[key] || key
  }

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    languages: ["en", "hi", "ur"] as SupportedLanguage[],
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
