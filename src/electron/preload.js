const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getExpenses: async () => await ipcRenderer.invoke('get-expenses'),
  removeExpense: async (item_id) => await ipcRenderer.invoke('remove-expense', item_id),
  addExpense: async (expenseData) => await ipcRenderer.invoke('add-expense', expenseData),
});

console.log('Preload script loaded');