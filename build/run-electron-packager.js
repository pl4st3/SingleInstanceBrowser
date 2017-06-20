// Configure and run electron-packager

// Checks
if ((process.argv[4] !== "darwin") && (process.argv[4] !== "win32")) {
    console.error("%s: Unknown platform: %s", process.argv[1], process.argv[4]);
    process.exit(1);
}
if (process.argv[4] == "darwin") {
    if (process.platform == "win32") {
        console.error("%s: Packaging darwin on win32 creates unusable files, skipping...", process.argv[1]);
        process.exit(1);
    }
}

const proc = require("child_process");
const fse = require("fs-extra");
const path = require("path");

// package.json of ./app/
var apppj = fse.readJsonSync(process.argv[2]);
// package.json
var pj = fse.readJsonSync(process.argv[3]);

// Default params
var packagerParams = apppj.config.pkgParams.split(" ");
packagerParams.push("./out/");
packagerParams.push("--out=./release/");
packagerParams.push("--no-prune");
packagerParams.push("--download.cache=./build/tmp/.electron-download");
packagerParams.push("--overwrite");
packagerParams.push(`--appname="${apppj.productName}"`);
packagerParams.push(`--app-version="${apppj.version}"`);
packagerParams.push(`--electron-version="${apppj.devDependencies.electron}"`);
packagerParams.push(`--arch="${apppj.config.arch}"`);
apppj.copyright ? packagerParams.push(`--app-copyright="${apppj.copyright}"`): null;

// Platform specific params
if (process.argv[4] == "darwin") {
    packagerParams.push("--platform=darwin");
    packagerParams.push("--icon=./build/tmp/appicon.icns");
    apppj.identifier ? packagerParams.push(`--app-bundle-id="${apppj.identifier}"`): null;
    apppj.darwinAppCategory ? packagerParams.push(`--app-category-type="${apppj.darwinAppCategory}"`): null;
    console.log(`///// Making darwin x64 release of ${apppj.productName}...`);
} else if (process.argv[4] == "win32") {
    packagerParams.push("--platform=win32");
    packagerParams.push("--icon=./build/tmp/appicon.ico");
    apppj.companyname ? packagerParams.push(`--win32metadata.CompanyName="${apppj.companyname}"`): null;
    apppj.win32FileDescription ? packagerParams.push(`--win32metadata.FileDescription="${apppj.win32FileDescription}"`): null;
    apppj.productName ? packagerParams.push(`--win32metadata.OriginalFilename="${apppj.productName}.exe"`): null;
    apppj.productName ? packagerParams.push(`--win32metadata.ProductName="${apppj.productName}"`): null;
    apppj.win32InternalName ? packagerParams.push(`--win32metadata.InternalName="${apppj.win32InternalName}"`): null;
    apppj.win32RequestedExecutionLevel ? packagerParams.push(`--win32metadata.requestedExecutionLevel="${apppj.win32RequestedExecutionLevel}"`): null;
    apppj.win32ApplicationManifest ? packagerParams.push(`--win32metadata.applicationManifest="${apppj.win32ApplicationManifest}"`): null;
    console.log(`///// Making win32 ${apppj.config.arch} release of ${apppj.productName}...`);
}
//console.log(packagerParams);

var packager = path.join(__dirname, "tmp", "node_modules", ".bin", (process.platform == "win32") ? "electron-packager.cmd" : "electron-packager");
proc.spawnSync(packager, packagerParams, { shell: true, stdio: "inherit" });
