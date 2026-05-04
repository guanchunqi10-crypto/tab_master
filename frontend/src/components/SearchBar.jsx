import React, { useState, useRef, useEffect } from 'react';

// 搜索引擎选项
const searchEngines = [
  { id: 'google', name: 'Google', icon: '🔍', url: 'https://www.google.com/search?q=' },
  { id: 'baidu', name: '百度', icon: '🌐', url: 'https://www.baidu.com/s?wd=' },
  { id: 'bing', name: '必应', icon: '🌟', url: 'https://www.bing.com/search?q=' },
];

export default function SearchBar({ 
  value = '', 
  onChange, 
  onClear,
  placeholder = '搜索所有 Tab...',
  onQuickSearch 
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState(searchEngines[0]);
  const [showEngineMenu, setShowEngineMenu] = useState(false);
  const inputRef = useRef(null);
  const engineMenuRef = useRef(null);

  // 防抖处理
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange) {
        onChange(value);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [value, onChange]);

  // 点击外部关闭引擎菜单
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (engineMenuRef.current && !engineMenuRef.current.contains(e.target)) {
        setShowEngineMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClear?.();
      inputRef.current?.blur();
    } else if (e.key === 'Enter' && value.trim()) {
      // 执行快捷搜索
      if (onQuickSearch) {
        onQuickSearch(value, selectedEngine.url);
      } else {
        window.open(`${selectedEngine.url}${encodeURIComponent(value)}`, '_blank');
      }
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className="relative w-full max-w-[640px] mx-auto">
      <div
        className={`
          search-input flex items-center h-[52px] rounded-2xl px-5
          ${isFocused ? 'scale-[1.02]' : ''}
        `}
      >
        {/* 搜索图标 */}
        <svg 
          className="w-5 h-5 text-[#6366F1] flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>

        {/* 输入框 */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="flex-1 h-full bg-transparent outline-none text-[15px] text-[#1E1B4B] placeholder-[#9CA3AF] ml-3"
        />

        {/* 清除按钮 */}
        {value && (
          <button
            onClick={onClear}
            className="w-6 h-6 rounded-full bg-[#9CA3AF]/20 flex items-center justify-center hover:bg-[#9CA3AF]/40 transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* 分隔线 */}
        {value && <div className="w-px h-6 bg-[#D1D5DB] mx-3 flex-shrink-0" />}

        {/* 搜索引擎选择器 */}
        <div className="relative" ref={engineMenuRef}>
          <button
            onClick={() => setShowEngineMenu(!showEngineMenu)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#E0E7FF] transition-colors"
            title="切换搜索引擎"
          >
            <span className="text-sm">{selectedEngine.icon}</span>
            <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* 引擎菜单 */}
          {showEngineMenu && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white/95 backdrop-blur-lg rounded-xl shadow-lg border border-[#E0E7FF] py-2 z-50">
              {searchEngines.map((engine) => (
                <button
                  key={engine.id}
                  onClick={() => {
                    setSelectedEngine(engine);
                    setShowEngineMenu(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2 hover:bg-[#E0E7FF] transition-colors
                    ${selectedEngine.id === engine.id ? 'bg-[#E0E7FF] text-[#6366F1]' : 'text-[#1E1B4B]'}
                  `}
                >
                  <span>{engine.icon}</span>
                  <span className="text-sm font-medium">{engine.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 快捷键提示 */}
      {isFocused && !value && (
        <div className="absolute bottom-[-28px] left-0 text-xs text-[#9CA3AF]">
          按 <kbd className="px-1.5 py-0.5 bg-[#F3F4F6] rounded text-[#6B7280]">Enter</kbd> 搜索，
          <kbd className="px-1.5 py-0.5 bg-[#F3F4F6] rounded text-[#6B7280] ml-1">Esc</kbd> 清空
        </div>
      )}
    </div>
  );
}
