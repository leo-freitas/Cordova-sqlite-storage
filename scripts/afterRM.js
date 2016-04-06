#!/usr/bin/env node

var fs = require('fs'), pathCordovaLib = process.cwd() + '/../node_modules/cordova/node_modules/cordova-lib',
    cordova_util = require(pathCordovaLib + '/src/cordova/util'),
    projectRoot = cordova_util.isCordova(process.cwd()),
    projectXml = cordova_util.projectConfig(projectRoot),
    ConfigParser = require(pathCordovaLib + '/cordova-lib').configparser,
    cfg = new ConfigParser(projectXml);

console.log('==================================================== Replace SQLITE ===================================================');

var fileContent = fs.readFileSync('platforms/wp8/' + cfg.name().replace(' ','_') + '.csproj');
if (!fileContent) {
	return;
}
fileContent = fileContent.toString();
fileContent = fileContent.replace('TRACE;DEBUG;SILVERLIGHT;WINDOWS_PHONE;USE_WP8_NATIVE_SQLITE','TRACE;DEBUG;SILVERLIGHT;WINDOWS_PHONE');
fs.writeFileSync('platforms/wp8/' + cfg.name().replace(' ','_') + '.csproj', fileContent);