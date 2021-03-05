/**
 * Code modified from Easy C++ projects 'https://raw.githubusercontent.com/acharluk/easy-cpp-projects/master';
 */

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import * as os from 'os';

interface fuseTemplateJSON{
    version: string;
    directories?: string[];
    templates: {
        [templateName: string]: {
            directories?: [string];
            blankFiles?: [string];
            files?: { [from: string]: string };
            openFiles?: [string];
        };
    };
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand("myfuse.createSimpleFuse", createSimpleProject));

}

// this method is called when your extension is deactivated
export function deactivate() {}

const createSimpleProject = async () => {

	// Select the folder to create Fuse
	let folder;
	if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage("Open a folder or workspace before creating a Fuse!");
        return;
    } else {
        try {
			folder = vscode.workspace.workspaceFolders[0].uri.fsPath;
		}catch(error){
			vscode.window.showErrorMessage(`${error}`);
		}
	}

	// Read in file.json
	let json_file = '';
	if (os.type() === "Windows_NT") {
		json_file = `${__dirname}\\templates\\files.json`;
    } else {
		json_file = `${__dirname}/templates/files.json`;
	}

	try {
		const content = readFileSync(json_file);
		const data = JSON.parse(content.toString());

		let templateNames = [];
		for(let template in data.templates){ 
			templateNames.push(template); 
		}

		// Select a Fuse template
		const fuseType = await vscode.window.showQuickPick(templateNames);

		if(fuseType !== undefined){
			createFuse(data, fuseType, folder);
			vscode.workspace.getConfiguration('files').update('associations', { "*.fuse": "lua" }, vscode.ConfigurationTarget.Workspace);
		}

	} catch (error) {
        vscode.window.showErrorMessage(`MyFuse error: ${error}`);
	}
} 

const createFuse =  async (files: fuseTemplateJSON, fuseType :string, folder:any) => {

	// Read and copy the file from
	let f = files.templates[fuseType].files;
    if (f) {
        for (let file in f) {
            try {
                const data = readFileSync( `${__dirname}/templates/${file}`).toString();
                writeFileSync(`${folder}/${f[file]}`, data);
            } catch (error) {
				vscode.window.showErrorMessage( `Easy C++ Projects error: Could not load '${file}' locally.\nError: ${error}`);
            }
        }
    }
	// Open the file
	let openFiles = files.templates[fuseType].openFiles;
    if (openFiles) {
        for (let file of openFiles) {
            if (existsSync(`${folder}/${file}`)) {
                vscode.workspace.openTextDocument(`${folder}/${file}`)
                    .then(doc => vscode.window.showTextDocument(doc, { preview: false }));
            }
        }
    }
}