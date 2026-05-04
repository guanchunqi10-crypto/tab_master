import React from 'react';

/**
 * Toast提示组件
 * @param {Object} toast - { message, type }
 * @param {Function} onClose - 关闭回调
 */
export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const duration = isSuccess ? 2000 : 4000;

  // 自动关闭
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [toast, duration, onClose]);

  return (
    <div className="
      fixed bottom-32 left-1/2 -translate-x-1/2
      z-50
      bg-[#323232] text-white
      rounded-button
      px-4 py-3
      shadow-lg
      flex items-center gap-3
      toast-enter
    ">
      {/* 图标 */}
      {isSuccess ? (
        <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-error" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      )}

      {/* 消息 */}
      <span className="text-sm">{toast.message}</span>

      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="
          w-5 h-5 flex items-center justify-center
          text-white/70 hover:text-white
          transition-colors
        "
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
