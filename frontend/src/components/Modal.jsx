import React, { useState, useRef, useEffect } from 'react';
import { useClickOutside, useKeyPress } from '../hooks';

/**
 * 弹窗组件
 * @param {boolean} isOpen - 是否打开
 * @param {string} title - 弹窗标题
 * @param {Function} onClose - 关闭回调
 * @param {Function} onConfirm - 确认回调
 * @param {ReactNode} children - 内容
 * @param {string} confirmText - 确认按钮文字
 * @param {string} cancelText - 取消按钮文字
 * @param {boolean} showCancel - 是否显示取消按钮
 * @param {boolean} isDanger - 是否是危险操作
 */
export default function Modal({
  isOpen,
  title,
  onClose,
  onConfirm,
  children,
  confirmText = '确认',
  cancelText = '取消',
  showCancel = true,
  isDanger = false
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  // 点击外部关闭
  useClickOutside(modalRef, onClose);

  // ESC键关闭
  useKeyPress('Escape', onClose);

  // Enter键确认
  useKeyPress('Enter', () => {
    if (inputValue.trim()) {
      onConfirm?.(inputValue);
    }
  });

  // 打开动画
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // 自动聚焦输入框
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50
        transition-opacity duration-toast
        ${isOpen ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className={`
          w-[400px] max-w-[90vw]
          bg-white rounded-modal p-6
          shadow-menu
          transition-transform duration-toast
          ${isOpen ? 'scale-100' : 'scale-95'}
        `}
      >
        {/* 标题 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="
              w-6 h-6 flex items-center justify-center
              text-text-secondary hover:text-text-primary
              transition-colors
            "
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容 */}
        {children ? (
          children
        ) : (
          <div className="mb-6">
            <label className="block text-sm text-text-secondary mb-2">
              分组名称
            </label>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="请输入分组名称"
              className="
                w-full h-10 px-3
                border border-border rounded-input
                text-sm text-text-primary
                placeholder:text-text-placeholder
                focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(66,133,244,0.2)]
                transition-all duration-micro
              "
            />
          </div>
        )}

        {/* 按钮组 */}
        <div className="flex justify-end gap-3">
          {showCancel && (
            <button
              onClick={onClose}
              className="
                px-4 py-2
                text-sm font-medium text-text-primary
                bg-surface-bg rounded-button
                hover:bg-border transition-colors
              "
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={() => {
              if (children) {
                onConfirm?.();
              } else if (inputValue.trim()) {
                onConfirm?.(inputValue);
              }
            }}
            disabled={children ? false : !inputValue.trim()}
            className={`
              px-4 py-2
              text-sm font-medium text-white
              rounded-button
              transition-colors
              ${isDanger
                ? 'bg-error hover:bg-error/90'
                : 'bg-primary hover:bg-primary/90'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 确认弹窗
 */
export function ConfirmModal({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = '确认',
  cancelText = '取消',
  isDanger = false
}) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={confirmText}
      cancelText={cancelText}
      isDanger={isDanger}
    >
      <div className="mb-6">
        <p className="text-sm text-text-secondary">{message}</p>
      </div>
    </Modal>
  );
}

/**
 * 输入弹窗
 */
export function InputModal({
  isOpen,
  title,
  defaultValue = '',
  placeholder = '请输入',
  onClose,
  onConfirm,
  confirmText = '确认',
  cancelText = '取消'
}) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={confirmText}
      cancelText={cancelText}
    >
      <div className="mb-6">
        <input
          type="text"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="
            w-full h-10 px-3
            border border-border rounded-input
            text-sm text-text-primary
            placeholder:text-text-placeholder
            focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(66,133,244,0.2)]
            transition-all duration-micro
          "
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              onConfirm?.(e.target.value);
            }
          }}
        />
      </div>
    </Modal>
  );
}
