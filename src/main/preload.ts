import { contextBridge, ipcRenderer } from "electron";

const bindToRenderer = (o) => {
    const r = {};
    for (const key in o) {
        if (Object.prototype.hasOwnProperty.call(o, key)) {
            r[key] = (... a: any[]) => {
                return ipcRenderer.sendSync(key, a);
            };
        }
    }
    return r;
};

contextBridge.exposeInMainWorld("SocialBridge", bindToRenderer({
    setTitle: 1,
    openHost: 1
}));