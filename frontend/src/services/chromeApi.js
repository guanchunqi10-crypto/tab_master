/**
 * Chrome Extension API 封装
 */

// 检查是否是 Chrome 扩展环境
export function isChromeExtension() {
  return typeof window !== 'undefined' && window.chrome && window.chrome.runtime;
}

/**
 * 获取所有 Tab
 */
export function getAllTabs() {
  return new Promise((resolve, reject) => {
    if (!isChromeExtension()) {
      resolve([]);
      return;
    }
    chrome.tabs.query({}, (tabs) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(tabs);
      }
    });
  });
}

/**
 * 激活指定 Tab
 */
export function activateTab(tabId, windowId) {
  return new Promise((resolve, reject) => {
    if (!isChromeExtension()) {
      resolve();
      return;
    }
    
    // 先激活窗口
    if (windowId) {
      chrome.windows.update(windowId, { focused: true }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        
        // 再激活 Tab
        chrome.tabs.update(tabId, { active: true }, (tab) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(tab);
          }
        });
      });
    } else {
      chrome.tabs.update(tabId, { active: true }, (tab) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(tab);
        }
      });
    }
  });
}

/**
 * 关闭指定 Tab
 */
export function closeTab(tabId) {
  return new Promise((resolve, reject) => {
    if (!isChromeExtension()) {
      resolve();
      return;
    }
    chrome.tabs.remove(tabId, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

/**
 * 创建新 Tab
 */
export function createTab(url) {
  return new Promise((resolve, reject) => {
    if (!isChromeExtension()) {
      window.open(url, '_blank');
      resolve();
      return;
    }
    chrome.tabs.create({ url, active: true }, (tab) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(tab);
      }
    });
  });
}

/**
 * 获取分组数据
 */
export function getGroups() {
  return new Promise((resolve) => {
    if (!isChromeExtension()) {
      resolve([]);
      return;
    }
    chrome.storage.local.get(['groups'], (result) => {
      resolve(result.groups || []);
    });
  });
}

/**
 * 保存分组数据
 */
export function saveGroups(groups) {
  return new Promise((resolve) => {
    if (!isChromeExtension()) {
      resolve();
      return;
    }
    chrome.storage.local.set({ groups }, resolve);
  });
}

/**
 * 获取最近关闭列表
 */
export function getRecentlyClosed() {
  return new Promise((resolve) => {
    if (!isChromeExtension()) {
      resolve([]);
      return;
    }
    chrome.storage.local.get(['recentlyClosed'], (result) => {
      resolve(result.recentlyClosed || []);
    });
  });
}

/**
 * 添加到最近关闭列表
 */
export function addToRecentlyClosed(tab) {
  return new Promise((resolve) => {
    if (!isChromeExtension()) {
      resolve();
      return;
    }
    chrome.storage.local.get(['recentlyClosed'], (result) => {
      let list = result.recentlyClosed || [];
      
      // 添加到列表开头
      list.unshift({
        id: `closed-${Date.now()}`,
        title: tab.title,
        url: tab.url,
        favIconUrl: tab.favIconUrl,
        closedAt: Date.now()
      });
      
      // 限制最多20条
      if (list.length > 20) {
        list = list.slice(0, 20);
      }
      
      chrome.storage.local.set({ recentlyClosed: list }, resolve);
    });
  });
}

/**
 * 清理过期的最近关闭记录
 */
export function cleanExpiredRecentlyClosed() {
  return new Promise((resolve) => {
    if (!isChromeExtension()) {
      resolve();
      return;
    }
    chrome.storage.local.get(['recentlyClosed'], (result) => {
      let list = result.recentlyClosed || [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTime = today.getTime();
      
      // 只保留今天的记录
      list = list.filter(item => item.closedAt >= todayTime);
      
      chrome.storage.local.set({ recentlyClosed: list }, resolve);
    });
  });
}

/**
 * 获取最常访问列表
 */
export function getFrequentTabs() {
  return new Promise((resolve) => {
    if (!isChromeExtension()) {
      resolve([]);
      return;
    }
    chrome.storage.local.get(['frequentTabs'], (result) => {
      resolve(result.frequentTabs || []);
    });
  });
}

/**
 * 更新最常访问统计
 */
export function updateFrequentTabs(tab) {
  return new Promise((resolve) => {
    if (!isChromeExtension()) {
      resolve();
      return;
    }
    chrome.storage.local.get(['frequentTabs'], (result) => {
      let list = result.frequentTabs || [];
      
      // 查找是否已存在
      const existingIndex = list.findIndex(item => item.url === tab.url);
      
      if (existingIndex >= 0) {
        // 更新计数
        list[existingIndex].count = (list[existingIndex].count || 1) + 1;
      } else {
        // 添加新记录
        list.push({
          id: `freq-${Date.now()}`,
          title: tab.title,
          url: tab.url,
          favIconUrl: tab.favIconUrl,
          count: 1
        });
      }
      
      // 按访问次数排序，取前10
      list.sort((a, b) => (b.count || 0) - (a.count || 0));
      list = list.slice(0, 10);
      
      chrome.storage.local.set({ frequentTabs: list }, resolve);
    });
  });
}

/**
 * 获取最常访问网站（使用 Chrome topSites API）
 */
export function getTopSites() {
  return new Promise((resolve, reject) => {
    if (!isChromeExtension()) {
      resolve([]);
      return;
    }
    
    // 检查是否有 topSites 权限
    try {
      chrome.topSites.get((sites) => {
        if (chrome.runtime.lastError) {
          // 如果没有权限，返回空数组
          console.warn('topSites API 不可用:', chrome.runtime.lastError);
          resolve([]);
        } else {
          resolve(sites.map((site, index) => ({
            id: `topsite-${index}`,
            title: site.title,
            url: site.url
          })));
        }
      });
    } catch (error) {
      console.warn('topSites API 错误:', error);
      resolve([]);
    }
  });
}

/**
 * 获取用户自定义快捷链接
 */
export function getShortcuts() {
  return new Promise((resolve) => {
    if (!isChromeExtension()) {
      resolve([]);
      return;
    }
    chrome.storage.local.get(['shortcuts'], (result) => {
      resolve(result.shortcuts || []);
    });
  });
}

/**
 * 保存快捷链接
 */
export function saveShortcuts(shortcuts) {
  return new Promise((resolve) => {
    if (!isChromeExtension()) {
      resolve();
      return;
    }
    chrome.storage.local.set({ shortcuts }, resolve);
  });
}

/**
 * 获取 Tab 追踪数据（打开时间、访问次数等）
 */
export function getTabTracking() {
  return new Promise((resolve) => {
    if (!isChromeExtension()) {
      resolve({});
      return;
    }
    chrome.storage.local.get(['tabTracking'], (result) => {
      resolve(result.tabTracking || {});
    });
  });
}

/**
 * 保存 Tab 追踪数据
 */
export function saveTabTracking(tracking) {
  return new Promise((resolve) => {
    if (!isChromeExtension()) {
      resolve();
      return;
    }
    chrome.storage.local.set({ tabTracking: tracking }, resolve);
  });
}

/**
 * 更新 Tab 追踪数据
 */
export function updateTabTracking(tab) {
  return new Promise((resolve) => {
    if (!isChromeExtension()) {
      resolve();
      return;
    }
    chrome.storage.local.get(['tabTracking'], (result) => {
      let tracking = result.tabTracking || {};
      const tabKey = tab.url;
      
      // 初始化或更新追踪数据
      if (!tracking[tabKey]) {
        tracking[tabKey] = {
          openedAt: Date.now(),
          lastAccessed: Date.now(),
          accessCount: 1,
          url: tab.url,
          title: tab.title
        };
      } else {
        tracking[tabKey].lastAccessed = Date.now();
        tracking[tabKey].accessCount = (tracking[tabKey].accessCount || 0) + 1;
        tracking[tabKey].title = tab.title;
      }
      
      chrome.storage.local.set({ tabTracking: tracking }, resolve);
    });
  });
}

/**
 * 计算 Tab 的可关闭指数（0-100，越高越建议关闭）
 * 考虑因素：
 * - 打开时间（超过2小时加分）
 * - 今天是否访问过（未访问加分）
 * - 是否是重复域名（重复加分）
 * - 访问频率（频繁访问减分）
 */
export function calculateTabScore(tab, trackingData, allTabs, frequentTabs) {
  let score = 0;
  const now = Date.now();
  const tabKey = tab.url;
  const tracking = trackingData[tabKey];
  
  // 1. 打开时间因素（每超过30分钟 +10分，上限50分）
  if (tracking?.openedAt) {
    const openDuration = now - tracking.openedAt;
    const thirtyMinutes = 30 * 60 * 1000;
    const extraPeriods = Math.min(Math.floor(openDuration / thirtyMinutes), 5);
    score += extraPeriods * 10;
  }
  
  // 2. 今天是否访问过（未访问 +30分）
  if (tracking?.lastAccessed) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();
    if (tracking.lastAccessed < todayStart) {
      score += 30;
    }
  }
  
  // 3. 是否是重复域名（同域名有多个 Tab +15分）
  const domain = (() => { try { return new URL(tab.url).hostname; } catch { return ''; } })();
  const sameDomainCount = allTabs.filter(t => {
    try { return new URL(t.url).hostname === domain; } catch { return false; }
  }).length;
  if (sameDomainCount > 1) {
    score += 15;
  }
  
  // 4. 访问频率因素（常访问的网站减分）
  const frequentMatch = frequentTabs.find(f => f.url === tab.url);
  if (frequentMatch?.count > 5) {
    score -= 20;
  } else if (frequentMatch?.count > 2) {
    score -= 10;
  }
  
  // 5. 固定 Tab 不能关闭
  if (tab.pinned) {
    return -100;
  }
  
  // 限制在 0-100 范围内
  return Math.max(0, Math.min(100, score));
}

/**
 * 获取 Tab 分类建议
 * 返回：{ todayTabs, futureTabs, casualTabs }
 */
export function categorizeTabs(tabs, trackingData, frequentTabs) {
  const now = Date.now();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.getTime();
  
  // 获取今天访问过的域名（作为"今天需要"的参考）
  const todayDomains = new Set();
  Object.values(trackingData).forEach(t => {
    if (t.lastAccessed >= todayStart) {
      try {
        todayDomains.add(new URL(t.url).hostname);
      } catch {}
    }
  });
  
  // 分类
  const categorized = {
    todayTabs: [],      // 今天会看
    futureTabs: [],     // 以后可能看
    casualTabs: []      // 随手开的
  };
  
  tabs.forEach(tab => {
    const tracking = trackingData[tab.url];
    const domain = (() => { try { return new URL(tab.url).hostname; } catch { return ''; } })();
    
    // 今天访问过，或域名在常用列表
    if (tracking?.lastAccessed >= todayStart || todayDomains.has(domain)) {
      categorized.todayTabs.push(tab);
    }
    // 有追踪数据但今天没访问，且不是高频网站 -> 以后可能看
    else if (tracking && !frequentTabs.find(f => f.url === tab.url)) {
      categorized.futureTabs.push(tab);
    }
    // 没有追踪数据或打开很久了 -> 随手开的
    else {
      categorized.casualTabs.push(tab);
    }
  });
  
  return categorized;
}
