import { app, BrowserWindow, ipcMain, protocol } from "electron";
import path = require("path");
import SocialBridge from "../bridge/SocialBridge";

export default class MainApp {

    preload: string;

    public start() {
        this.init().catch(console.error);
    }

    async init() {
        await app.whenReady();

        if(app.setAsDefaultProtocolClient("mailto")) {
            console.log("Set the current app as mail handler");
        } else {
            console.error("failed setting mailto protocol");
        }

        if (!app.isDefaultProtocolClient("mailto")) {
            console.error("default protocol client not set");
        }

        this.preload = path.join(__dirname, "preload.js");
        console.log(this.preload);

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) this.createWindow();
        })

        protocol.handle("mailto", (request) => {
            console.log(request);
            return null;
        });

        this.createWindow();
    }

    createWindow(host?: string) {
        const { preload } = this;
        const win = new BrowserWindow({
            webPreferences: {
                devTools: true,
                partition: "persist:local",
                preload
            }
        });

        const bridge = new MainBridge(win, this);
        const methods = MainBridge.prototype;
        for (const key in Object.getOwnPropertyDescriptors(methods)) {
            if (Object.prototype.hasOwnProperty.call(methods, key)) {
                ipcMain.on(key, (e, args) => {

                    if (BrowserWindow.fromWebContents(e.sender) !== win) {
                        return;
                    }

                    bridge[key](... args);

                });
            }
        }

        win.loadFile("index.html");
    }
}

class MainBridge extends SocialBridge {

    constructor(private window: BrowserWindow, private mainApp: MainApp) {
        super();
    }

    public setTitle(v: string) {
        this.window.title = v;
    }

    public openHost(host: string) {
        this.window.loadURL(host);        
    }

}

new MainApp().start();
