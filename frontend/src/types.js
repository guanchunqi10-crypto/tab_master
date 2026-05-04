/**
 * Tab类型定义
 * @typedef {Object} Tab
 * @property {number} id - Tab ID
 * @property {string} title - Tab标题
 * @property {string} url - Tab URL
 * @property {string} favIconUrl - Favicon URL
 * @property {boolean} pinned - 是否固定
 * @property {number} windowId - 所属窗口ID
 * @property {boolean} active - 是否激活
 */

/**
 * 分组类型定义
 * @typedef {Object} Group
 * @property {string} id - 分组ID
 * @property {string} name - 分组名称
 * @property {string|null} parentId - 父分组ID
 * @property {string[]} tabIds - 包含的Tab ID列表
 * @property {boolean} isExpanded - 是否展开
 * @property {'user'|'domain'} type - 分组类型
 */

/**
 * 最近关闭项类型定义
 * @typedef {Object} RecentlyClosedItem
 * @property {string} title - 标题
 * @property {string} url - URL
 * @property {string} favIconUrl - Favicon URL
 * @property {number} closedAt - 关闭时间戳
 */

/**
 * 最常访问项类型定义
 * @typedef {Object} FrequentTab
 * @property {string} url - URL
 * @property {string} title - 标题
 * @property {string} favIconUrl - Favicon URL
 * @property {number} visitCount - 访问次数
 * @property {number} lastVisit - 最后访问时间
 */

export {};
