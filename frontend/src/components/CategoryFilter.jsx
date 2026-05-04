import React from 'react';

/**
 * 分类筛选标签组组件 - 现代卡片式设计
 */
export default function CategoryFilter({
  total,
  todayCount,
  futureCount,
  casualCount,
  activeFilter,
  onFilterChange
}) {
  const filters = [
    { 
      key: 'all', 
      label: '全部', 
      count: total, 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      )
    },
    { 
      key: 'today', 
      label: '今天会看', 
      count: todayCount, 
      colorClass: 'today',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      key: 'future', 
      label: '以后看', 
      count: futureCount, 
      colorClass: 'future',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h4l3-9 4 18 3-9h4" opacity="0" />
        </svg>
      )
    },
    { 
      key: 'casual', 
      label: '随手开', 
      count: casualCount, 
      colorClass: 'casual',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    }
  ];

  return (
    <div className="category-filter">
      {filters.map((filter, index) => {
        const isActive = activeFilter === filter.key;
        const delay = index * 50;
        
        return (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`
              category-chip chip-enter
              ${filter.colorClass || ''}
              ${isActive ? 'active' : ''}
            `}
            style={{ animationDelay: `${delay}ms` }}
          >
            <span className="category-icon">
              {filter.icon}
            </span>
            <span className="text-sm font-medium">
              {filter.label}
            </span>
            <span className="category-count">
              {filter.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
