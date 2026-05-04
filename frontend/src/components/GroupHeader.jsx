import React from 'react';

/**
 * 分组标题组件 v2.0
 * 优化样式，使用紫罗兰色调
 */

export default function GroupHeader({ 
  name, 
  count, 
  isExpanded, 
  onToggle,
  onContextMenu,
  onAddNew,
  isCustomGroup = false
}) {
  const handleContextMenu = (e) => {
    e.preventDefault();
    onContextMenu?.(e);
  };

  return (
    <div
      data-testid="group-header"
      className="group-header flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer select-none transition-all"
      onClick={onToggle}
      onContextMenu={handleContextMenu}
    >
      <div className="flex items-center gap-3">
        {/* 展开/折叠箭头 */}
        <svg 
          className={`w-4 h-4 text-[#6B7280] transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>

        {/* 分组名称 */}
        <h2 className="text-[15px] font-semibold text-[#1E1B4B]">
          {name}
        </h2>

        {/* Tab数量标签 */}
        <span className="badge text-xs font-medium px-2.5 py-1 rounded-full">
          {count}个标签
        </span>
      </div>

      {/* 右侧操作 */}
      <div className="flex items-center gap-2">
        {/* 新建分组按钮（仅自定义分组显示） */}
        {isCustomGroup && onAddNew && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddNew();
            }}
            className="p-1.5 rounded-lg hover:bg-[#E0E7FF] transition-colors"
            title="新建分组"
          >
            <svg className="w-4 h-4 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}

        {/* 更多操作按钮 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onContextMenu?.(e);
          }}
          className="p-1.5 rounded-lg hover:bg-[#E0E7FF] transition-colors opacity-0 group-hover:opacity-100"
          title="更多操作"
        >
          <svg className="w-4 h-4 text-[#6B7280]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
