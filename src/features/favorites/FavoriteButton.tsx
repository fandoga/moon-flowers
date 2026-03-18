'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useIsFavorite, useAddFavorite, useRemoveFavorite } from '@/entities/favorites/hooks/hooks';

interface FavoriteButtonProps {
  productId: number;
  className?: string;
  iconSize?: number;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  productId,
  className = '',
  iconSize = 32,
}) => {
  const { isFavorite, favoriteId, isLoading } = useIsFavorite(productId);
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;
    if (isFavorite && favoriteId) {
      removeFavorite.mutate(favoriteId);
    } else {
      addFavorite.mutate(productId);
    }
  };

  return (
    <button
    onClick={handleClick}
    className={`bg-white cursor-pointer rounded-md p-1.5 hover:bg-[#F3F3F3] transition-colors active:scale-95 ${className}`}
    aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
  >
    <Heart
      size={iconSize}
      className={`p-1 ${
        isFavorite ? 'fill-[#394426] text-[#394426]' : 'text-[#394426] hover:fill-[#394426]'
      }`}
    />
  </button>
  );
};