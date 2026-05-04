import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 防抖Hook
 * @param {any} value - 需要防抖的值
 * @param {number} delay - 延迟时间(ms)
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 搜索过滤Hook
 * @param {Array} items - 要过滤的列表
 * @param {string} searchTerm - 搜索关键词
 * @param {string[]} keys - 搜索字段
 */
export function useSearchFilter(items, searchTerm, keys = ['title', 'url']) {
  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredItems = useCallback(() => {
    if (!debouncedSearch.trim()) {
      return items;
    }

    const term = debouncedSearch.toLowerCase();
    return items.filter(item =>
      keys.some(key => {
        const value = item[key];
        return value && value.toLowerCase().includes(term);
      })
    );
  }, [items, debouncedSearch, keys]);

  return filteredItems();
}

/**
 * 点击外部检测Hook
 */
export function useClickOutside(ref, callback) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
}

/**
 * 键盘事件Hook
 */
export function useKeyPress(targetKey, callback) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === targetKey) {
        callbackRef.current(event);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [targetKey]);
}

/**
 * Toast提示Hook
 */
export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success', duration = 2000) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showToast, hideToast };
}

/**
 * 本地状态存储Hook（用于UI状态，不同步到Chrome Storage）
 */
export function useLocalState(initialValue) {
  const [state, setState] = useState(initialValue);

  const updateState = useCallback((updates) => {
    setState(prev => {
      if (typeof updates === 'function') {
        return updates(prev);
      }
      return { ...prev, ...updates };
    });
  }, []);

  return [state, updateState];
}
