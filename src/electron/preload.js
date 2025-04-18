const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getExpenses: async () => await ipcRenderer.invoke('get-expenses'),
  removeExpense: async (id) => await ipcRenderer.invoke('remove-expense', id),
  addExpense: async (expenseData) => await ipcRenderer.invoke('add-expense', expenseData),
});

console.log('Preload script loaded');