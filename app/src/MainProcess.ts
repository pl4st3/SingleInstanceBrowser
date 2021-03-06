import { CMainApplication } from "./main/MainApplication";
import { dialog } from "electron";
// Hopefully the following import can be removed in the future, please see ./shared/NodeJS.
import "./shared/NodeJS";

/**
 * Something similar can be found in the Electron sample app, but according to
 * https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
 * there is no straight forward use of it.
 * Please also see ./shared/NodeJS
 */
process.on("uncaughtException", (error: Error) => {
    console.error("Uncaught exception:",  error);
    dialog.showErrorBox("Caught unhandled exception", error.message || "Unknown/missing error message");
    // Only do synchronous cleanup here (if any) and then fail/quit
    // ...cleanup...
    if (mainApplication) {
        mainApplication.quit();
    }
});

// Start application by creating an instance of the main application class.
const mainApplication: CMainApplication = new CMainApplication();
