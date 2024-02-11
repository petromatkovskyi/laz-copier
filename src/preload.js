const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  title: 'The Laz searcher',
  copyLaz: async (data) => {
    const res = await ipcRenderer.invoke('copy-laz', data);
    console.log(res);
    return res;
  },
});
