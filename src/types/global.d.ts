// src/types/global.d.ts
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: {
          new (options: {
            pageLanguage: string;
            includedLanguages: string;
            layout: string;
            autoDisplay: boolean;
          }, elementId: string): void;
          InlineLayout: {
            SIMPLE: string;
          };
        };
      };
    };
  }
}

export {};