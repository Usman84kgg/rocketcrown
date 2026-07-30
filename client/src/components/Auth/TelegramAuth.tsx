import React, { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { getInitData } from '../../lib/telegram';

export const TelegramAuth: React.FC = () => {
  const { loginTelegram, user } = useAuthStore();

  useEffect(() => {
    const initData = getInitData();
    if (initData && !user) {
      loginTelegram(initData);
    }
  }, []);

  return null; // Авторизация бесшумная в Telegram Mini App
};