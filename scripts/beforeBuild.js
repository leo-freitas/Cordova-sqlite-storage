#!/usr/bin/env node

var fs = require('fs'), pathCordovaLib = process.cwd() + '/../node_modules/cordova/node_modules/cordova-lib',
    cordova_util = require(pathCordovaLib + '/src/cordova/util'),
    projectRoot = cordova_util.isCordova(process.cwd()),
    projectXml = cordova_util.projectConfig(projectRoot),
    ConfigParser = require(pathCordovaLib + '/cordova-lib').configparser,
    cfg = new ConfigParser(projectXml), exec = require('child_process').execSync;

console.log('==================================================== Replace SQLITE ===================================================');
var fileContent = fs.readFileSync('platforms/wp8/' + cfg.name().replace(' ','_') + '.csproj').toString();
if (fileContent.indexOf('SQLiteAsync.cs') === -1) {
	console.log('adicionando sqlite');
	var path = process.env.PWD + '\\platforms\\wp8';
	exec('binpkg\\nuget update ' + cfg.name().replace(' ','_') + '.sln -Id sqlite-net', {cwd: path});
	exec('binpkg\\nuget update ' + cfg.name().replace(' ','_') + '.sln -Id sqlite-net-wp8', {cwd: path});
	console.log('fim sqlite');
}
//atualizando conteúdo.
fileContent = fs.readFileSync('platforms/wp8/' + cfg.name().replace(' ','_') + '.csproj').toString();

if (fileContent.indexOf('SQLiteAsync.cs') === -1) {
	fileContent = fileContent.replace('<Compile Include="Properties\\AssemblyInfo.cs" />', '<Compile Include="Properties\\AssemblyInfo.cs" /><Compile Include="SQLite.cs" /><Compile Include="SQLiteAsync.cs" />');
}

if (fileContent.indexOf('USE_WP8_NATIVE_SQLITE') === -1) {
	fileContent = fileContent.replace(/SILVERLIGHT;WINDOWS_PHONE/gm,'SILVERLIGHT;WINDOWS_PHONE;USE_WP8_NATIVE_SQLITE');
}

if (fileContent.indexOf('SQLite.WP80') === -1) {
	var item = '</ItemGroup><ItemGroup> <SDKReference Include="SQLite.WP80, Version=3.12.0"> <Name>SQLite for Windows Phone</Name> </SDKReference></ItemGroup>';
	fileContent = fileContent.replace('</ItemGroup>',item);
}

fs.writeFileSync('platforms/wp8/' + cfg.name().replace(' ','_') + '.csproj', fileContent);