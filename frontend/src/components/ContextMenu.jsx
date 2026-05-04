import React, { useState, useRef, useEffect } from 'react';
import { useClickOutside, useKeyPress } from '../hooks';

/**
 * 右键菜单组件
 * @param {Object} position -菜单位置 {x, y}
 * @param {Array} items - 菜单项
 * @param {Function} onClose - 关闭回调
 * @param {Object} parentRef - 父级ref
 */
export default function ContextMenu({
  position,
  items,
  onClose,
  parentRef
}) {
  const menuRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [subMenuIndex, setSubMenuIndex] = useState(null);

  // 点击外部关闭
  useClickOutside(menuRef, onClose);

  // ESC键关闭
  useKeyPress('Escape', onClose);

  // 调整菜单位置（防止超出屏幕）
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = position.x;
      let y = position.y;

      // 右侧超出
      if (x + rect.width > viewportWidth) {
        x = viewportWidth - rect.width - 8;
      }

      // 底部超出
      if (y + rect.height > viewportHeight) {
        y = viewportHeight - rect.height - 8;
      }

      setAdjustedPosition({ x, y });
    }
  }, [position]);

  // 渲染单个菜单项
  const renderMenuItem = (item, index) => {
    if (item.type === 'separator') {
      return (
        <div key={index} className="h-px bg-border my-1" />
      );
    }

    const hasSubMenu = item.subMenu && item.subMenu.length > 0;
    const isHovered = hoveredIndex === index;
    const isSubMenuOpen = subMenuIndex === index;

    return (
      <div
        key={index}
        className={`
          relative flex items-center h-9 px-3
          text-sm text-text-primary
          cursor-pointer select-none
          transition-colors duration-micro
          ${isHovered ? 'bg-surface-bg' : ''}
          ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onMouseEnter={() => {
          setHoveredIndex(index);
          if (hasSubMenu) {
            setSubMenuIndex(index);
          }
        }}
        onMouseLeave={() => {
          setHoveredIndex(null);
          if (hasSubMenu) {
            setSubMenuIndex(null);
          }
        }}
        onClick={() => {
          if (!item.disabled && !hasSubMenu) {
            item.onClick?.();
            onClose();
          }
        }}
      >
        {/* 图标 */}
        {item.icon && (
          <span className="w-4 h-4 mr-3 text-text-secondary flex items-center justify-center">
            {item.icon}
          </span>
        )}

        {/* 文字 */}
        <span className="flex-1">{item.label}</span>

        {/* 子菜单箭头 */}
        {hasSubMenu && (
          <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}

        {/* 子菜单 */}
        {hasSubMenu && isSubMenuOpen && (
          <div
            className="
              absolute left-full top-0 ml-1
              min-w-[160px] max-w-[240px]
              bg-white rounded-card shadow-menu
              py-1
            "
          >
            {item.subMenu.map((subItem, subIndex) => renderMenuItem(subItem, `${index}-${subIndex}`))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={menuRef}
      className="
        fixed z-50
        min-w-[160px] max-w-[240px]
        bg-white rounded-card shadow-menu
        py-1
        animate-[fadeIn_150ms_ease-out]
      "
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y
      }}
    >
      {items.map((item, index) => renderMenuItem(item, index))}
    </div>
  );
}

/**
 * 创建Tab右键菜单项
 */
export function createTabMenuItems(tab, actions) {
  return [
    {
      label: '跳转到该Tab',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      ),
      onClick: () => actions.onGoTo?.(tab)
    },
    {
      label: '关闭该Tab',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      onClick: () => actions.onClose?.(tab)
    },
    { type: 'separator' },
    {
      label: '移动到分组',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      subMenu: actions.groups?.map(group => ({
        label: group.name,
        onClick: () => actions.onMoveToGroup?.(tab, group.id)
      })),
      onClick: undefined // 有子菜单时不直接触发
    },
    {
      label: '复制链接',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      onClick: () => actions.onCopyLink?.(tab)
    },
    {
      label: tab.pinned ? '取消固定' : '固定',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
        </svg>
      ),
      onClick: () => actions.onTogglePin?.(tab)
    }
  ];
}

/**
 * 创建分组右键菜单项
 */
export function createGroupMenuItems(group, actions) {
  return [
    {
      label: group.isExpanded ? '折叠' : '展开',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      ),
      onClick: () => actions.onToggle?.(group)
    },
    {
      label: '重命名',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      onClick: () => actions.onRename?.(group)
    },
    {
      label: '删除分组',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      onClick: () => actions.onDelete?.(group)
    },
    { type: 'separator' },
    {
      label: '合并到',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      subMenu: actions.otherGroups?.map(g => ({
        label: g.name,
        onClick: () => actions.onMerge?.(group.id, g.id)
      })),
      onClick: undefined
    }
  ];
}
