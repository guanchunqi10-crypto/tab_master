import React, { useState, useRef, useEffect } from 'react';
import AddShortcutModal from './AddShortcutModal';

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

function ShortcutItem({ shortcut, onClick, onContextMenu, onEdit }) {
  const [imageError, setImageError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(shortcut.name);
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef(null);
  const faviconUrl = getFaviconUrl(shortcut.url, 48);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditName(shortcut.name);
  };

  const handleEditSave = (e) => {
    e?.stopPropagation();
    if (editName.trim() && editName !== shortcut.name) {
      onEdit(shortcut, editName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditSave(e);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditName(shortcut.name);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowMenu(true);
    onContextMenu?.(e, shortcut);
  };

  return (
    <div
      className="shortcut-item relative flex flex-col items-center p-2 cursor-pointer select-none flex-shrink-0 group"
      onClick={() => !isEditing && onClick(shortcut)}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      title={shortcut.name}
    >
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 overflow-hidden transition-transform group-hover:scale-105"
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
      
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleEditSave}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="w-16 text-xs font-medium text-center bg-white border border-[var(--color-primary)] rounded px-1 py-0.5 outline-none"
          maxLength={10}
        />
      ) : (
        <span className="text-xs font-medium text-[var(--color-text-primary)] text-center leading-tight max-w-[64px] truncate">
          {shortcut.name}
        </span>
      )}
      
      {/* 编辑提示 */}
      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        双击编辑
      </span>
    </div>
  );
}

function AddShortcutButton({ onClick }) {
  return (
    <div
      className="shortcut-item flex flex-col items-center p-2 cursor-pointer select-none flex-shrink-0 hover:opacity-80 transition-opacity"
      onClick={onClick}
      title="添加快捷方式"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 bg-[var(--color-primary)]/10 border-2 border-dashed border-[var(--color-primary)]/30">
        <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <span className="text-xs font-medium text-[var(--color-text-muted)] text-center">添加</span>
    </div>
  );
}

export default function QuickAccessBar({ 
  topSites = [], 
  customShortcuts = [], 
  onAddShortcut, 
  onRemoveShortcut,
  onEditShortcut 
}) {
  const [showModal, setShowModal] = useState(false);
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
    const menu = document.createElement('div');
    menu.className = 'fixed z-50 bg-white rounded-lg shadow-lg border border-[var(--color-border)] py-1 min-w-[120px]';
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
    
    const isCustom = customShortcuts.some(cs => cs.id === shortcut.id);
    
    menu.innerHTML = `
      <button class="w-full px-3 py-2 text-left text-sm hover:bg-[var(--color-muted-bg)] flex items-center gap-2" data-action="edit">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        编辑名称
      </button>
      ${isCustom ? `
        <button class="w-full px-3 py-2 text-left text-sm text-[var(--color-danger)] hover:bg-red-50 flex items-center gap-2" data-action="delete">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          删除
        </button>
      ` : `
        <button class="w-full px-3 py-2 text-left text-sm text-[var(--color-danger)] hover:bg-red-50 flex items-center gap-2" data-action="remove">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.878 2.879L7.56 9.196a4 4 0 000 5.608l6.318 6.317a4 4 0 005.608 0l.707-.707a4 4 0 000-5.608l-.707-.707a4 4 0 00-5.608 0l-.707.707a4 4 0 00-2.122 2.12L3.586 14.44a4 4 0 000 5.608l-.707.707a4 4 0 005.608 0l6.318-6.318a4 4 0 000-5.608l-.707-.707a4 4 0 00-5.608 0L5.586 11a4 4 0 00-2.122-2.12l-.707-.707a4 4 0 00-5.608 0L3.172 10a4 4 0 000 5.608l.707.707a4 4 0 005.608 0l.707-.707a4 4 0 002.122 2.12l6.318 6.318a4 4 0 005.608 0l.707-.707a4 4 0 000-5.608l-.707-.707a4 4 0 00-5.608 0l-.707.707a4 4 0 00-2.122-2.12z" />
          </svg>
          隐藏
        </button>
      `}
    `;
    
    document.body.appendChild(menu);
    
    const handleClickOutside = (e) => {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', handleClickOutside);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);
    
    menu.addEventListener('click', (e) => {
      const action = e.target.closest('button')?.dataset.action;
      if (action === 'edit') {
        onEditShortcut?.(shortcut);
      } else if (action === 'delete' || action === 'remove') {
        const label = action === 'delete' ? '删除' : '隐藏';
        if (confirm(`${label}快捷方式 "${shortcut.name}"？`)) {
          onRemoveShortcut?.(shortcut.id);
        }
      }
      menu.remove();
      document.removeEventListener('click', handleClickOutside);
    });
  };

  const handleEdit = (shortcut, newName) => {
    onEditShortcut?.(shortcut, newName);
  };

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleAddSubmit = ({ name, url }) => {
    onAddShortcut?.({ name, url });
    setShowModal(false);
  };
  
  return (
    <div className="glass-light px-4 py-3 mb-4">
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {displayShortcuts.map((shortcut, index) => (
          <ShortcutItem
            key={shortcut.id || index}
            shortcut={shortcut}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            onEdit={handleEdit}
          />
        ))}
        
        {displayShortcuts.length < 8 && (
          <AddShortcutButton onClick={handleAddClick} />
        )}
      </div>

      {/* 添加快捷方式模态框 */}
      <AddShortcutModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddSubmit}
      />
    </div>
  );
}
