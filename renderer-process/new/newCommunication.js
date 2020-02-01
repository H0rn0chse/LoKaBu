window.ipcRenderer.on("read-config", (oEvent, sMessage) => {
    console.log(sMessage);
});

window.ipcRenderer.on("log", (oEvent, sMessage) => {
    console.warn(sMessage);
});
