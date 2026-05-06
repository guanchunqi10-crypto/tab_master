import React, { useState, useEffect, useRef } from 'react';

export default function AddShortcutModal({ isOpen, onClose, onAdd }) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const urlInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setName('');
      setError('');
      setTimeout(() => urlInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    setError('');
    
    // 自动提取域名作为默认名称
    if (!name && value) {
      try {
        let urlToParse = value;
        if (!urlToParse.startsWith('http')) {
          urlToParse = 'https://' + value;
        }
        const hostname = new URL(urlToParse).hostname;
        if (hostname) {
          setName(hostname.replace('www.', ''));
        }
      } catch {
        // ignore
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let finalUrl = url.trim();
    let finalName = name.trim();
    
    if (!finalUrl) {
      setError('请输入网址');
      return;
    }
    
    if (!finalName) {
      setError('请输入名称');
      return;
    }
    
    // 处理URL格式
    if (!finalUrl.startsWith('http')) {
      finalUrl = 'https://' + finalUrl;
    }
    
    // 验证URL
    try {
      new URL(finalUrl);
    } catch {
      setError('网址格式不正确');
      return;
    }
    
    onAdd({ name: finalName, url: finalUrl });
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-scale-in">
        {/* 头部 */}
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">添加快捷方式</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-muted-bg)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* 表单 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 名称输入 */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="例如：我的工作台"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
              maxLength={20}
            />
          </div>
          
          {/* 网址输入 */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              网址 <span className="text-red-500">*</span>
            </label>
            <input
              ref={urlInputRef}
              type="text"
              value={url}
              onChange={handleUrlChange}
              placeholder="例如：https://github.com"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
            />
            <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
              输入网址后将自动提取域名作为默认名称
            </p>
          </div>
          
          {/* 错误提示 */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
          
          {/* 按钮 */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium hover:bg-[var(--color-muted-bg)] transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:opacity-90 transition-opacity"
            >
              添加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
