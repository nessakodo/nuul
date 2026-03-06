const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("nuul", {
  platform: "desktop"
});
