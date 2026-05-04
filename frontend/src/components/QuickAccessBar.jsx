import React, { useState } from 'react';

// 默认快捷链接预设
const defaultShortcuts = [
  { id: 'google', name: 'Google', url: 'https://www.google.com', color: 'linear-gradient(135deg, #4285F4, #34A853, #FBBC05, #EA4335)' },
  { id: 'gmail', name: 'Gmail', url: 'https://mail.google.com', color: 'linear-gradient(135deg, #EA4335, #FBBC05)' },
  { id: 'calendar', name: '日历', url: 'https://calendar.google.com', color: 'linear-gradient(135deg, #4285F4, #0F9D58)' },
  { id: 'drive', name: '云盘', url: 'https://drive.google.com', color: 'linear-gradient(135deg, #FBBC05, #0F9D58)' },
  { id: 'youtube', name: 'YouTube', url: 'https://www.youtube.com', color: '#FF0000' },
  { id: 'github', name: 'GitHub', url: 'https://github.com', color: '#24292E' },
];

function getFaviconUrl(url, size = 48) {
  try {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=${size}`;
  } catch {
    return null;
  }
}

function ShortcutItem({ shortcut, onClick, onContextMenu }) {
  const [imageError, setImageError] = useState(false);
  const faviconUrl = getFaviconUrl(shortcut.url, 48);
  
  return (
    <div
      className="shortcut-item flex flex-col items-center p-2 cursor-pointer select-none flex-shrink-0"
      onClick={() => onClick(shortcut)}
      onContextMenu={(e) => onContextMenu(e, shortcut)}
      title={shortcut.name}
    >
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 overflow-hidden"
        style={{ background: shortcut.color }}
      >
        {faviconUrl && !imageError ? (
          <img
            src={faviconUrl}
            alt={shortcut.name}
            className="w-7 h-7"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="text-white text-lg font-semibold">
            {shortcut.name.charAt(0)}
          </span>
        )}
      </div>
      <span className="text-xs font-medium text-[#1E1B4B] text-center leading-tight max-w-[64px] truncate">
        {shortcut.name}
      </span>
    </div>
  );
}

function AddShortcutButton({ onClick }) {
  return (
    <div
      className="shortcut-item flex flex-col items-center p-2 cursor-pointer select-none flex-shrink-0"
      onClick={onClick}
      title="添加快捷方式"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 bg-[#E0E7FF] border-2 border-dashed border-[#6366F1]/30">
        <svg className="w-6 h-6 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <span className="text-xs font-medium text-[#6B7280] text-center">添加</span>
    </div>
  );
}

export default function QuickAccessBar({ topSites = [], customShortcuts = [], onAddShortcut, onRemoveShortcut }) {
  const shortcuts = [...customShortcuts];
  
  if (shortcuts.length < 8) {
    const existingIds = shortcuts.map(s => s.id);
    defaultShortcuts.forEach(ds => {
      if (shortcuts.length < 8 && !existingIds.includes(ds.id)) {
        shortcuts.push(ds);
      }
    });
  }
  
  const displayShortcuts = shortcuts.slice(0, 8);
  
  const handleClick = (shortcut) => {
    if (window.chrome?.tabs?.create) {
      window.chrome.tabs.create({ url: shortcut.url, active: true });
    } else {
      window.open(shortcut.url, '_blank');
    }
  };
  
  const handleContextMenu = (e, shortcut) => {
    e.preventDefault();
    if (customShortcuts.some(cs => cs.id === shortcut.id) && onRemoveShortcut) {
      if (confirm(`删除快捷方式 "${shortcut.name}"？`)) {
        onRemoveShortcut(shortcut.id);
      }
    }
  };
  
  return (
    <div className="glass-light px-4 py-3 mb-4">
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {displayShortcuts.map((shortcut, index) => (
          <ShortcutItem
            key={shortcut.id || index}
            shortcut={shortcut}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
          />
        ))}
        
        {displayShortcuts.length < 8 && onAddShortcut && (
          <AddShortcutButton onClick={onAddShortcut} />
        )}
      </div>
    </div>
  );
}
