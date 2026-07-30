import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface PromoBanner {
  id: string;
  image_url: string;
  title?: string;
  description?: string;
  link_type: string;
  link_url?: string;
  is_active: boolean;
}

export const BannerCarousel: React.FC = () => {
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    axios.get('/api/promos').then(res => {
      const active = res.data.filter((b: PromoBanner) => b.is_active);
      setBanners(active);
    });
  }, []);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners]);

  if (banners.length === 0) return null;

  const banner = banners[current];

  return (
    <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden mb-6 shadow-lg shadow-purple-500/10">
      <a
        href={banner.link_url || '#'}
        target={banner.link_type === 'external' ? '_blank' : undefined}
        rel="noopener noreferrer"
        className="block w-full h-full"
      >
        <img
          src={banner.image_url}
          alt={banner.title || 'Акция'}
          className="w-full h-full object-cover rounded-2xl"
        />

        {(banner.title || banner.description) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
            {banner.title && <h3 className="text-white font-bold text-xl">{banner.title}</h3>}
            {banner.description && <p className="text-gray-300 text-sm mt-1">{banner.description}</p>}
          </div>
        )}
      </a>

      {/* Точки-индикаторы */}
      {banners.length > 1 && (
        <div className="absolute bottom-2 right-3 flex gap-1.5">
          {banners.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === current ? 'bg-pink-500 scale-125' : 'bg-gray-500/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};