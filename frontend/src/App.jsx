import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  SearchBar,
  TabCard,
  GroupSection,
  BottomBar,
  ContextMenu,
  ConfirmModal,
  InputModal,
  SearchEmptyState,
  NoTabsState,
  Skeleton,
  Toast,
  QuickAccessBar,
  CategoryFilter,
  CleanupHelper,
  AchievementToast,
  ACHIEVEMENTS
} from './components';
import {
  createTabMenuItems,
  createGroupMenuItems
} from './components/ContextMenu';
import {
  getAllTabs,
  activateTab,
  closeTab,
  createTab,
  getGroups,
  saveGroups,
  getRecentlyClosed,
  addToRecentlyClosed,
  getFrequentTabs,
  updateFrequentTabs,
  cleanExpiredRecentlyClosed,
  isChromeExtension,
  getTopSites,
  getShortcuts,
  saveShortcuts,
  getTabTracking,
  updateTabTracking,
  calculateTabScore,
  categorizeTabs
} from './services/chromeApi';
import { useSearchFilter, useToast } from './hooks';

/**
 * 从URL中提取域名
 */
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
}

/**
 * 生成唯一ID
 */
function generateId() {
  return `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function App() {
  // 状态
  const [tabs, setTabs] = useState([]);
  const [groups, setGroups] = useState({});
  const [recentlyClosed, setRecentlyClosed] = useState([]);
  const [frequentTabs, setFrequentTabs] = useState([]);
  const [shortcuts, setShortcuts] = useState([]);
  const [topSites, setTopSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabTracking, setTabTracking] = useState({});
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'today' | 'future' | 'casual'
  const [closingTabs, setClosingTabs] = useState(new Set()); // 正在关闭动画中的 Tab ID

  // 成就状态
  const [achievements, setAchievements] = useState([]);
  const [totalClosedToday, setTotalClosedToday] = useState(0);

  // 右键菜单状态
  const [contextMenu, setContextMenu] = useState(null);

  // 弹窗状态
  const [modal, setModal] = useState({ type: null, data: null });

  // Toast
  const { toast, showToast, hideToast } = useToast();

  // 拖拽状态
  const [draggingTab, setDraggingTab] = useState(null);
  const [dropTargetGroupId, setDropTargetGroupId] = useState(null);

  // 成就解锁检测
  const checkAchievements = useCallback((closedCount) => {
    const newAchievements = [];
    const newTotal = totalClosedToday + closedCount;

    if (closedCount >= 5) newAchievements.push(ACHIEVEMENTS.CLOSE_5);
    if (closedCount >= 10) newAchievements.push(ACHIEVEMENTS.CLOSE_10);
    if (newTotal >= 20) newAchievements.push(ACHIEVEMENTS.CLOSE_20);
    if (newTotal >= 50) newAchievements.push(ACHIEVEMENTS.CLOSE_50);

    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      setTotalClosedToday(newTotal);
    }
  }, [totalClosedToday]);

  // 加载数据
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // 并行加载所有数据
      const [allTabs, allGroups, recent, frequent, customShortcuts, sites, tracking] = await Promise.all([
        getAllTabs(),
        getGroups(),
        getRecentlyClosed(),
        getFrequentTabs(),
        getShortcuts(),
        getTopSites(),
        getTabTracking()
      ]);

      // 过滤掉chrome://开头的系统页面
      const filteredTabs = allTabs.filter(tab => !tab.url.startsWith('chrome://'));

      setTabs(filteredTabs);
      setGroups(allGroups);
      setRecentlyClosed(recent);
      setFrequentTabs(frequent);
      setShortcuts(customShortcuts);
      setTopSites(sites);
      setTabTracking(tracking);

      // 清理过期的最近关闭记录
      await cleanExpiredRecentlyClosed();
    } catch (error) {
      console.error('加载数据失败:', error);
      showToast('加载数据失败', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // 初始加载
  useEffect(() => {
    loadData();

    // 监听Tab变化（如果支持）
    if (isChromeExtension() && chrome.tabs?.onUpdated) {
      const listener = () => {
        // 防抖，避免频繁刷新
        setTimeout(loadData, 500);
      };
      chrome.tabs.onUpdated.addListener(listener);
      chrome.tabs.onRemoved.addListener(listener);
      chrome.tabs.onCreated.addListener(listener);

      return () => {
        chrome.tabs.onUpdated.removeListener(listener);
        chrome.tabs.onRemoved.removeListener(listener);
        chrome.tabs.onCreated.removeListener(listener);
      };
    }
  }, [loadData]);

  // 搜索过滤
  const filteredTabs = useSearchFilter(tabs, searchTerm, ['title', 'url']);

  // 按分组整理Tab
  const groupedTabs = useMemo(() => {
    const result = {
      userGroups: [],
      domainGroups: {}
    };

    // 处理用户分组
    Object.values(groups).forEach(group => {
      if (group.type === 'user') {
        const groupTabs = tabs.filter(tab => group.tabIds?.includes(tab.id));
        if (groupTabs.length > 0 || !searchTerm) {
          result.userGroups.push({
            ...group,
            tabs: groupTabs
          });
        }
      }
    });

    // 处理未分组的Tab - 按域名聚合
    const groupedTabIds = new Set();
    Object.values(groups).forEach(group => {
      (group.tabIds || []).forEach(id => groupedTabIds.add(id));
    });

    const ungroupedTabs = tabs.filter(tab => !groupedTabIds.has(tab.id) && !tab.pinned);

    // 按域名分组
    ungroupedTabs.forEach(tab => {
      const domain = extractDomain(tab.url);
      if (!result.domainGroups[domain]) {
        result.domainGroups[domain] = [];
      }
      result.domainGroups[domain].push(tab);
    });

    // 固定Tab单独分组
    const pinnedTabs = tabs.filter(tab => tab.pinned);
    if (pinnedTabs.length > 0) {
      result.pinnedTabs = pinnedTabs;
    }

    return result;
  }, [tabs, groups, searchTerm]);

  // 计算每个 Tab 的可关闭指数
  const tabScores = useMemo(() => {
    const scores = {};
    tabs.forEach(tab => {
      scores[tab.id] = calculateTabScore(tab, tabTracking, tabs, frequentTabs);
    });
    return scores;
  }, [tabs, tabTracking, frequentTabs]);

  // Tab 分类
  const categorizedTabs = useMemo(() => {
    return categorizeTabs(tabs, tabTracking, frequentTabs);
  }, [tabs, tabTracking, frequentTabs]);

  // 根据分类筛选 Tab
  const filteredByCategory = useMemo(() => {
    if (categoryFilter === 'all') return null;
    
    const categoryMap = {
      today: categorizedTabs.todayTabs,
      future: categorizedTabs.futureTabs,
      casual: categorizedTabs.casualTabs
    };
    
    return categoryMap[categoryFilter] || [];
  }, [categoryFilter, categorizedTabs]);

  // 一键清理：只保留今天需要的（带动画）
  const handleOneClickCleanup = useCallback(async () => {
    const tabsToClose = [...categorizedTabs.casualTabs, ...categorizedTabs.futureTabs];
    
    if (tabsToClose.length === 0) {
      showToast('没有需要清理的标签页');
      return;
    }

    // 显示确认弹窗
    const confirmed = window.confirm(`确定要关闭 ${tabsToClose.length} 个建议关闭的标签页吗？`);
    if (!confirmed) return;

    // 解锁成就
    setAchievements(prev => [...prev, ACHIEVEMENTS.CLEAN_SLATE]);

    // 为所有要关闭的标签添加动画
    setClosingTabs(new Set(tabsToClose.map(t => t.id)));

    // 依次关闭，每隔80ms关闭一个
    for (let i = 0; i < tabsToClose.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 80));
      const tab = tabsToClose[i];
      await updateTabTracking(tab);
      await closeTab(tab.id);
      setTabs(prev => prev.filter(t => t.id !== tab.id));
      setClosingTabs(prev => {
        const next = new Set(prev);
        next.delete(tab.id);
        return next;
      });
    }

    // 检测成就
    checkAchievements(tabsToClose.length);
    showToast(`已清理 ${tabsToClose.length} 个标签页 🎉`);
  }, [categorizedTabs, showToast, checkAchievements]);

  // Tab关闭
  const handleTabClose = useCallback(async (tab) => {
    if (tab.id.toString().startsWith('recent-') || tab.id.toString().startsWith('frequent-')) {
      // 从最近关闭列表移除
      const newRecent = recentlyClosed.filter((_, i) => `recent-${i}` !== tab.id);
      setRecentlyClosed(newRecent);
      showToast('已从最近关闭中移除');
      return;
    }

    // 保存到最近关闭
    await addToRecentlyClosed({
      title: tab.title,
      url: tab.url,
      favIconUrl: tab.favIconUrl
    });

    // 关闭Tab
    await closeTab(tab.id);

    // 更新本地状态
    setTabs(prev => prev.filter(t => t.id !== tab.id));
    setRecentlyClosed(prev => [
      {
        title: tab.title,
        url: tab.url,
        favIconUrl: tab.favIconUrl,
        closedAt: Date.now()
      },
      ...prev
    ].slice(0, 20));

    showToast('已关闭标签页');
  }, [recentlyClosed, showToast]);
  
  // 快速关闭（带追踪和动画）
  const handleQuickClose = useCallback(async (tab) => {
    // 添加到关闭动画队列
    setClosingTabs(prev => new Set([...prev, tab.id]));

    // 等待动画完成
    await new Promise(resolve => setTimeout(resolve, 450));

    await updateTabTracking(tab);
    await handleTabClose(tab);
    setClosingTabs(prev => {
      const next = new Set(prev);
      next.delete(tab.id);
      return next;
    });

    // 检测成就
    checkAchievements(1);
  }, [handleTabClose, checkAchievements]);

  // 快捷链接处理函数
  const handleAddShortcut = useCallback(async () => {
    const url = prompt('请输入网址：');
    if (url) {
      const name = prompt('请输入名称：', new URL(url).hostname);
      if (name) {
        const newShortcut = {
          id: `custom-${Date.now()}`,
          name,
          url: url.startsWith('http') ? url : `https://${url}`,
          color: 'linear-gradient(135deg, #6366F1, #8B5CF6)'
        };
        const updated = [...shortcuts, newShortcut];
        setShortcuts(updated);
        await saveShortcuts(updated);
        showToast('快捷方式已添加');
      }
    }
  }, [shortcuts, showToast]);

  const handleRemoveShortcut = useCallback(async (id) => {
    const updated = shortcuts.filter(s => s.id !== id);
    setShortcuts(updated);
    await saveShortcuts(updated);
    showToast('快捷方式已删除');
  }, [shortcuts, showToast]);

  const handleEditShortcut = useCallback(async (shortcut, newName) => {
    const updated = shortcuts.map(s => 
      s.id === shortcut.id ? { ...s, name: newName } : s
    );
    setShortcuts(updated);
    await saveShortcuts(updated);
    showToast('快捷方式已更新');
  }, [shortcuts, showToast]);

  // 搜索匹配逻辑
  const getFilteredGroups = useCallback(() => {
    if (!searchTerm.trim()) {
      return groupedTabs;
    }

    const searchLower = searchTerm.toLowerCase();
    const matchedTabs = filteredTabs;
    const matchedTabIds = new Set(matchedTabs.map(t => t.id));

    // 过滤用户分组
    const filteredUserGroups = groupedTabs.userGroups
      .map(group => ({
        ...group,
        tabs: group.tabs.filter(tab => matchedTabIds.has(tab.id)),
        isExpanded: true // 搜索时展开
      }))
      .filter(group => group.tabs.length > 0);

    // 过滤域名分组
    const filteredDomainGroups = {};
    Object.entries(groupedTabs.domainGroups).forEach(([domain, domainTabs]) => {
      const filtered = domainTabs.filter(tab => matchedTabIds.has(tab.id));
      if (filtered.length > 0) {
        filteredDomainGroups[domain] = filtered;
      }
    });

    return {
      ...groupedTabs,
      userGroups: filteredUserGroups,
      domainGroups: filteredDomainGroups,
      pinnedTabs: (groupedTabs.pinnedTabs || []).filter(tab => matchedTabIds.has(tab.id))
    };
  }, [groupedTabs, filteredTabs, searchTerm]);

  const displayGroups = getFilteredGroups();
  const hasNoResults = searchTerm.trim() && filteredTabs.length === 0;
  const hasNoTabs = tabs.length === 0 && !loading;

  // 恢复最近关闭的Tab
  const handleRestoreClosedTab = useCallback(async (item) => {
    if (item.url) {
      await createTab(item.url);
      // 从最近关闭列表移除
      setRecentlyClosed(prev => prev.filter(i => i.id !== item.id));
      showToast('已恢复标签页');
    }
  }, [showToast]);

  // 打开常用Tab
  const handleOpenFrequentTab = useCallback(async (item) => {
    if (item.url) {
      await createTab(item.url);
      showToast('已打开新标签页');
    }
  }, [showToast]);

  // Tab点击 - 跳转到该Tab
  const handleTabClick = useCallback(async (tab) => {
    // 如果是最近关闭或最常访问的项目，使用url打开新Tab
    if (tab.url.startsWith('recent-') || tab.url.startsWith('frequent-')) {
      await createTab(tab.url);
      showToast('已打开新标签页');
    } else {
      await activateTab(tab.id);
      await updateFrequentTabs(tab);
    }
  }, [showToast]);

  // Tab右键菜单
  const handleTabContextMenu = useCallback((e, tab) => {
    const userGroupsList = Object.values(groups).filter(g => g.type === 'user');
    setContextMenu({
      type: 'tab',
      position: { x: e.clientX, y: e.clientY },
      data: tab,
      items: createTabMenuItems(tab, {
        onGoTo: handleTabClick,
        onClose: handleTabClose,
        onCopyLink: (t) => {
          navigator.clipboard.writeText(t.url);
          showToast('链接已复制');
        },
        onTogglePin: async (t) => {
          if (isChromeExtension()) {
            await chrome.tabs.update(t.id, { pinned: !t.pinned });
            setTabs(prev => prev.map(tab =>
              tab.id === t.id ? { ...tab, pinned: !tab.pinned } : tab
            ));
          }
        },
        groups: userGroupsList,
        onMoveToGroup: (t, groupId) => {
          handleMoveTabToGroup(t.id, groupId);
        }
      })
    });
  }, [groups, handleTabClick, handleTabClose, showToast]);

  // 分组右键菜单
  const handleGroupContextMenu = useCallback((e, group) => {
    const otherGroups = Object.values(groups)
      .filter(g => g.type === 'user' && g.id !== group.id);

    setContextMenu({
      type: 'group',
      position: { x: e.clientX, y: e.clientY },
      data: group,
      items: createGroupMenuItems(group, {
        onToggle: (g) => {
          setGroups(prev => ({
            ...prev,
            [g.id]: { ...g, isExpanded: !g.isExpanded }
          }));
        },
        onRename: (g) => {
          setModal({
            type: 'renameGroup',
            data: g
          });
        },
        onDelete: (g) => {
          setModal({
            type: 'deleteGroup',
            data: g
          });
        },
        otherGroups,
        onMerge: (sourceId, targetId) => {
          handleMergeGroups(sourceId, targetId);
        }
      })
    });
  }, [groups]);

  // 切换分组展开/折叠
  const handleToggleGroup = useCallback((groupId) => {
    setGroups(prev => ({
      ...prev,
      [groupId]: { ...prev[groupId], isExpanded: !prev[groupId].isExpanded }
    }));
  }, []);

  // 拖拽开始
  const handleDragStart = useCallback((tab) => {
    setDraggingTab(tab);
  }, []);

  // 拖拽进入分组
  const handleDragEnterGroup = useCallback((groupId) => {
    setDropTargetGroupId(groupId);
  }, []);

  // 拖拽离开分组
  const handleDragLeaveGroup = useCallback(() => {
    setDropTargetGroupId(null);
  }, []);

  // 拖拽释放
  const handleDragEnd = useCallback(async () => {
    if (draggingTab && dropTargetGroupId) {
      await handleMoveTabToGroup(draggingTab.id, dropTargetGroupId);
    }
    setDraggingTab(null);
    setDropTargetGroupId(null);
  }, [draggingTab, dropTargetGroupId]);

  // 移动Tab到分组
  const handleMoveTabToGroup = useCallback(async (tabId, groupId) => {
    const targetGroup = groups[groupId];
    if (!targetGroup) return;

    // 检查Tab是否已在该分组
    if (targetGroup.tabIds?.includes(tabId)) return;

    // 从所有分组中移除该Tab
    const updatedGroups = { ...groups };
    Object.keys(updatedGroups).forEach(gId => {
      updatedGroups[gId] = {
        ...updatedGroups[gId],
        tabIds: (updatedGroups[gId].tabIds || []).filter(id => id !== tabId)
      };
    });

    // 添加到目标分组
    updatedGroups[groupId] = {
      ...updatedGroups[groupId],
      tabIds: [...(updatedGroups[groupId].tabIds || []), tabId]
    };

    setGroups(updatedGroups);
    await saveGroups(updatedGroups);
    showToast('已移动到分组');
  }, [groups, showToast]);

  // 合并分组
  const handleMergeGroups = useCallback(async (sourceId, targetId) => {
    const sourceGroup = groups[sourceId];
    const targetGroup = groups[targetId];
    if (!sourceGroup || !targetGroup) return;

    // 将源分组的所有Tab移到目标分组
    const updatedGroups = { ...groups };
    updatedGroups[targetId] = {
      ...updatedGroups[targetId],
      tabIds: [
        ...(updatedGroups[targetId].tabIds || []),
        ...(updatedGroups[sourceId].tabIds || [])
      ]
    };

    // 删除源分组
    delete updatedGroups[sourceId];

    setGroups(updatedGroups);
    await saveGroups(updatedGroups);
    showToast('分组已合并');
  }, [groups, showToast]);

  // 新建分组
  const handleCreateGroup = useCallback(() => {
    setModal({ type: 'createGroup', data: null });
  }, []);

  // 确认弹窗操作
  const handleModalConfirm = useCallback(async (value) => {
    const { type, data } = modal;

    if (type === 'createGroup') {
      const newId = generateId();
      const newGroup = {
        id: newId,
        name: value,
        parentId: null,
        tabIds: [],
        isExpanded: true,
        type: 'user'
      };

      const updatedGroups = { ...groups, [newId]: newGroup };
      setGroups(updatedGroups);
      await saveGroups(updatedGroups);
      showToast('分组已创建');
    } else if (type === 'renameGroup') {
      const updatedGroups = {
        ...groups,
        [data.id]: { ...groups[data.id], name: value }
      };
      setGroups(updatedGroups);
      await saveGroups(updatedGroups);
      showToast('分组已重命名');
    } else if (type === 'deleteGroup') {
      const updatedGroups = { ...groups };
      // 将该分组的Tab移到未分组（实际上只是删除分组，Tab保留）
      delete updatedGroups[data.id];
      setGroups(updatedGroups);
      await saveGroups(updatedGroups);
      showToast('分组已删除');
    }

    setModal({ type: null, data: null });
  }, [modal, groups, showToast]);

  // 关闭右键菜单
  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // 关闭弹窗
  const handleCloseModal = useCallback(() => {
    setModal({ type: null, data: null });
  }, []);

  // 渲染用户分组
  const renderUserGroups = () => {
    const userGroups = displayGroups.userGroups || [];
    return userGroups.map(group => (
      <div
        key={group.id}
        onDragEnter={() => handleDragEnterGroup(group.id)}
        onDragLeave={handleDragLeaveGroup}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDragEnd}
      >
        <GroupSection
          group={group}
          tabs={group.tabs || []}
          onTabClick={handleTabClick}
          onTabClose={handleTabClose}
          onTabContextMenu={handleTabContextMenu}
          onGroupContextMenu={handleGroupContextMenu}
          onToggleGroup={handleToggleGroup}
          onTabDragStart={handleDragStart}
          isDropTarget={dropTargetGroupId === group.id}
          tabScores={tabScores}
          onQuickClose={handleQuickClose}
          closingTabs={closingTabs}
        />
      </div>
    ));
  };

  // 渲染域名分组
  const renderDomainGroups = () => {
    const domainGroups = displayGroups.domainGroups || {};
    return Object.entries(domainGroups).map(([domain, domainTabs]) => (
      <div
        key={domain}
        className="mb-4"
      >
        <div className="flex items-center h-10 px-3 text-text-secondary">
          <span className="text-sm">{domain}</span>
          <span className="text-xs ml-2 bg-surface-bg px-2 py-0.5 rounded-badge">
            {domainTabs.length}
          </span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 p-3 pt-1">
          {domainTabs.map(tab => (
            <TabCard
              key={tab.id}
              tab={tab}
              onClick={handleTabClick}
              onClose={handleTabClose}
              onContextMenu={handleTabContextMenu}
              onDragStart={handleDragStart}
              closeScore={tabScores[tab.id]}
              onQuickClose={handleQuickClose}
              isClosing={closingTabs.has(tab.id)}
            />
          ))}
        </div>
      </div>
    ));
  };

  // 渲染固定Tab分组
  const renderPinnedTabs = () => {
    const pinnedTabs = displayGroups.pinnedTabs;
    if (!pinnedTabs || pinnedTabs.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="flex items-center h-10 px-3 text-text-secondary">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
          </svg>
          <span className="text-sm">固定的标签页</span>
          <span className="text-xs ml-2 bg-surface-bg px-2 py-0.5 rounded-badge">
            {pinnedTabs.length}
          </span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 p-3 pt-1">
          {pinnedTabs.map(tab => (
            <TabCard
              key={tab.id}
              tab={tab}
              onClick={handleTabClick}
              onClose={handleTabClose}
              onContextMenu={handleTabContextMenu}
              onDragStart={handleDragStart}
              closeScore={tabScores[tab.id]}
              onQuickClose={handleQuickClose}
              isClosing={closingTabs.has(tab.id)}
            />
          ))}
        </div>
      </div>
    );
  };

  // 渲染分类筛选后的 Tab 列表
  const renderFilteredTabs = () => {
    if (!filteredByCategory) return null;
    
    const categoryInfo = {
      today: { 
        label: '今天会看', 
        color: 'text-[var(--color-today)]', 
        bg: 'bg-[var(--color-today-bg)]',
        border: 'border-[rgba(5,150,105,0.15)]'
      },
      future: { 
        label: '以后可能看', 
        color: 'text-[var(--color-future)]', 
        bg: 'bg-[var(--color-future-bg)]',
        border: 'border-[rgba(37,99,235,0.15)]'
      },
      casual: { 
        label: '随手开的', 
        color: 'text-[var(--color-casual)]', 
        bg: 'bg-[var(--color-casual-bg)]',
        border: 'border-[rgba(217,119,6,0.15)]'
      }
    };
    
    const info = categoryInfo[categoryFilter] || { label: '', color: '', bg: '', border: '' };
    
    return (
      <div className="space-y-4 animate-fade-in">
        <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${info.bg} ${info.border}`}>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${info.color}`}>{info.label}</span>
            <span className="text-xs text-[var(--color-text-muted)]">{filteredByCategory.length} 个标签页</span>
          </div>
          {categoryFilter === 'casual' && filteredByCategory.length > 0 && (
            <button
              onClick={handleOneClickCleanup}
              className="btn-cleanup px-4 py-1.5 text-sm rounded-full"
            >
              一键关闭全部
            </button>
          )}
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 p-3">
          {filteredByCategory.map(tab => (
            <TabCard
              key={tab.id}
              tab={tab}
              onClick={handleTabClick}
              onClose={handleTabClose}
              onContextMenu={handleTabContextMenu}
              onDragStart={handleDragStart}
              closeScore={tabScores[tab.id]}
              onQuickClose={handleQuickClose}
              isClosing={closingTabs.has(tab.id)}
            />
          ))}
        </div>
      </div>
    );
  };

  // 渲染清理助手
  const renderCleanupHelper = () => {
    return (
      <CleanupHelper
        casualCount={categorizedTabs.casualTabs.length}
        futureCount={categorizedTabs.futureTabs.length}
        totalTabs={tabs.length}
        onOneClickCleanup={handleOneClickCleanup}
        onViewDetails={() => setCategoryFilter('casual')}
      />
    );
  };

  return (
    <div className="
      h-full flex flex-col
      bg-[#FAFBFC]
      min-h-screen
    ">
      {/* 顶部搜索栏 */}
      <div className="flex-shrink-0 p-4 pt-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
        />
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-y-auto px-4 pb-28">
        {loading ? (
          <Skeleton />
        ) : (
          <div className="space-y-4 animate-fade-in">
            {/* 快捷访问栏 */}
            <QuickAccessBar
              topSites={topSites}
              customShortcuts={shortcuts}
              onAddShortcut={handleAddShortcut}
              onRemoveShortcut={handleRemoveShortcut}
              onEditShortcut={handleEditShortcut}
            />

            {/* Tab列表区域 */}
            {hasNoTabs ? (
              <NoTabsState />
            ) : hasNoResults ? (
              <SearchEmptyState />
            ) : (
              <div className="space-y-4">
                {/* 分类筛选标签 - 炫酷版 */}
                {!searchTerm && (
                  <CategoryFilter
                    total={tabs.length}
                    todayCount={categorizedTabs.todayTabs.length}
                    futureCount={categorizedTabs.futureTabs.length}
                    casualCount={categorizedTabs.casualTabs.length}
                    activeFilter={categoryFilter}
                    onFilterChange={setCategoryFilter}
                  />
                )}

                {/* 清理助手 - 炫酷版 */}
                {!searchTerm && categoryFilter === 'all' && renderCleanupHelper()}

                {/* 分类筛选视图 */}
                {filteredByCategory ? (
                  renderFilteredTabs()
                ) : (
                  <>
                    {/* 固定Tab */}
                    {renderPinnedTabs()}

                    {/* 用户分组 */}
                    {renderUserGroups()}

                    {/* 域名分组 */}
                    {renderDomainGroups()}

                    {/* 新建分组按钮 */}
                    <button
                      onClick={handleCreateGroup}
                      className="
                        w-full h-12
                        flex items-center justify-center gap-2
                        text-sm font-medium text-[#6B7280]
                        border-2 border-dashed border-[#C7D2FE]
                        rounded-xl
                        hover:border-[#6366F1] hover:text-[#6366F1]
                        hover:bg-[#6366F1]/5
                        transition-all
                      "
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      新建分组
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 底部工具栏 */}
      <BottomBar
        recentlyClosed={recentlyClosed}
        frequentTabs={frequentTabs}
        onRestoreTab={handleRestoreClosedTab}
        onOpenFrequentTab={handleOpenFrequentTab}
      />

      {/* 右键菜单 */}
      {contextMenu && (
        <ContextMenu
          position={contextMenu.position}
          items={contextMenu.items}
          onClose={handleCloseContextMenu}
        />
      )}

      {/* 弹窗 */}
      {modal.type === 'createGroup' && (
        <InputModal
          isOpen={true}
          title="新建分组"
          placeholder="请输入分组名称"
          onClose={handleCloseModal}
          onConfirm={handleModalConfirm}
        />
      )}

      {modal.type === 'renameGroup' && (
        <InputModal
          isOpen={true}
          title="重命名分组"
          defaultValue={groups[modal.data?.id]?.name}
          placeholder="请输入新名称"
          onClose={handleCloseModal}
          onConfirm={handleModalConfirm}
        />
      )}

      {modal.type === 'deleteGroup' && (
        <ConfirmModal
          isOpen={true}
          title="删除分组"
          message="确定要删除该分组吗？Tab会保留在未分组中。"
          onClose={handleCloseModal}
          onConfirm={() => handleModalConfirm()}
          confirmText="删除"
          isDanger
        />
      )}

      {/* Toast */}
      <Toast toast={toast} onClose={hideToast} />

      {/* 成就提示 */}
      <AchievementToast
        achievements={achievements}
        onDismiss={() => setAchievements([])}
      />
    </div>
  );
}
