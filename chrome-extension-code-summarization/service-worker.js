function setupContextMenu() {
    chrome.contextMenus.create({
      id: 'code-explanation',
      title: 'Explain this code',
      contexts: ['selection']
    });
  }
  
  chrome.runtime.onInstalled.addListener(() => {
    setupContextMenu();
  });
  
  chrome.contextMenus.onClicked.addListener((data, tab) => {
    // Store the last word in chrome.storage.session.
    chrome.storage.session.set({ lastCodeToExplain: data.selectionText });
  
    // Make sure the side panel is open.
    chrome.sidePanel.open({ tabId: tab.id });
  });