declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        initData: string;
      };
    };
  }
}

export function initTelegram() {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#0d0118');
    tg.setBackgroundColor('#0d0118');
  }
}

export function getInitData(): string {
  return window.Telegram?.WebApp?.initData || '';
}