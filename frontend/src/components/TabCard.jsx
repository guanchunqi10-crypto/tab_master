import React, { useState } from 'react';

/**
 * Tab卡片组件 v3.0 - 现代极简版
 * 简洁设计 + 微妙阴影 + 精致交互
 */

export default function TabCard({ 
  tab, 
  onClick, 
  onClose,
  onContextMenu,
  isPinned = false,
  isDragging = false,
  closeScore = null,
  onQuickClose = null,
  isClosing = false
}) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 根据分数确定标识样式
  const getBadgeStyle = () => {
    if (closeScore >= 85) return { bg: 'bg-[var(--color-urgent-bg)]', text: 'text-[var(--color-urgent)]', border: 'border-[var(--color-urgent)]/20' };
    if (closeScore >= 70) return { bg: 'bg-[var(--color-warning-bg)]', text: 'text-[var(--color-warning)]', border: 'border-[var(--color-warning)]/20' };
    if (closeScore >= 60) return { bg: 'bg-[var(--color-muted-bg)]', text: 'text-[var(--color-text-muted)]', border: 'border-[var(--color-border)]' };
    return null;
  };

  const getBadgeText = () => {
    if (closeScore >= 85) return '立刻关闭';
    if (closeScore >= 70) return '建议关闭';
    if (closeScore >= 60) return '可关闭';
    return '';
  };

  const badgeStyle = getBadgeStyle();

  // 获取域名
  const domain = tab.url ? (() => {
    try {
      return new URL(tab.url).hostname;
    } catch {
      return '';
    }
  })() : '';

  // 获取favicon
  const faviconUrl = tab.favIconUrl || (tab.url ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : null);

  const handleClick = (e) => {
    e.stopPropagation();
    onClick?.(tab);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    onClose?.(tab);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu?.(e, tab);
  };

  const handleBadgeClick = (e) => {
    e.stopPropagation();
    onQuickClose?.(tab);
  };

  // 默认favicon
  const DefaultFavicon = () => (
    <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
      <span className="text-[var(--color-primary)] text-sm font-medium">
        {tab.title?.charAt(0)?.toUpperCase() || '?'}
      </span>
    </div>
  );

  return (
    <div
      data-testid="tab-card"
      className={`
        tab-card relative flex flex-col items-center justify-center p-4 
        bg-white rounded-2xl cursor-pointer
        shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)]
        hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]
        transition-all duration-200 ease-out
        ${isDragging ? 'scale-[1.02] opacity-80 rotate-0.5 shadow-xl' : ''}
        ${isHovered ? 'z-10 translate-y-[-2px]' : 'z-0'}
        ${isClosing ? 'animate-close-fly' : ''}
      `}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable
    >
      {/* 固定标签 */}
      {isPinned && (
        <div className="absolute top-2.5 left-2.5 z-10">
          <svg className="w-3.5 h-3.5 text-[var(--color-primary)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
          </svg>
        </div>
      )}

      {/* 快速关闭按钮 - 极简风格 */}
      <button
        data-testid="tab-close-btn"
        onClick={handleClose}
        className={`
          quick-close-btn absolute top-2.5 right-2.5 z-20
          w-6 h-6 rounded-full
          flex items-center justify-center
          text-[var(--color-text-muted)]
          hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]
          transition-all duration-150
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
        title="关闭标签"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 可关闭建议标识 - 简洁风格 */}
      {badgeStyle && (
        <div 
          className={`absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
          title={`可关闭指数 ${closeScore}，点击快速关闭`}
          onClick={handleBadgeClick}
        >
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
          <span className="text-[10px] font-medium">{getBadgeText()}</span>
        </div>
      )}

      {/* 今天重要指示 - 柔和绿点 */}
      {closeScore !== null && closeScore < 60 && (
        <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-[var(--color-today)]" title="今天需要" />
      )}

      {/* Favicon */}
      <div className="mb-3 mt-1">
        {faviconUrl && !imageError ? (
          <img
            src={faviconUrl}
            alt=""
            className="w-9 h-9 rounded-lg object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <DefaultFavicon />
        )}
      </div>

      {/* 标题 */}
      <h3 
        className="text-sm font-medium text-[var(--color-text-primary)] text-center leading-snug mb-1 w-full px-1"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {tab.title || '无标题'}
      </h3>

      {/* 域名 */}
      <p className="text-xs text-[var(--color-text-muted)] text-center truncate w-full px-1">
        {domain || tab.url}
      </p>
    </div>
  );
}
