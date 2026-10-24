import React from 'react';
import * as Icons from 'lucide-react';

export const CategoryBadge = ({ category, size = 'sm' }) => {
  if (!category) return null;

  // Dynamic Lucide icon lookup with fallback
  const IconComponent = Icons[category.icon] || Icons.Tag;
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${
        isSm ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
      }`}
      style={{
        backgroundColor: `${category.color || '#6366F1'}18`,
        color: category.color || '#6366F1',
      }}
    >
      <IconComponent className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      {category.name}
    </span>
  );
};

