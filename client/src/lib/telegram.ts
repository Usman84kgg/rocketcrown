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
  if (window.Telegram?.WebApp) {
    return window.Telegram.WebApp.initData;
  }
  return '';
}