window.ipcRenderer.on("log", (oEvent, sMessage) => {
    console.warn(sMessage);
});
