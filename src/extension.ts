// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import * as os from 'os';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand("myfuse.createSimpleFuse", createSimpleProject));

}

// this method is called when your extension is deactivated
export function deactivate() {}

const createSimpleProject = async () => {
	
      // The code you place here will be executed every time your command is executed
	// console.log("Creating a new simple fuse");

    //   // Display a message box to the user
	vscode.window.showInformationMessage("Creating a new simple Fuse");

    //   /**
    //    * Todo:
    //    * Select simple or CDTL Fuse
    //    * Look into the templates folder
    //    * Create the file fuse
    //    */
	//   let templates = [];
	let json_file = '';
	// Get json file
	if (os.type() === "Windows_NT") {
		json_file = `${__dirname}\\templates\\files.json`;
    } else {
		json_file = `${__dirname}/templates/files.json`;
	}

	try {
		const content = readFileSync(json_file);
		const data = JSON.parse(content.toString());

		let templates = [];
		for(let template in data.templates){
			templates.push(template);
		}

		const selected = await vscode.window.showQuickPick(templates);
		console.log("User selected " + selected);
	} catch (error) {
        vscode.window.showErrorMessage( "MyFuse error: Sorry couldn't create Fuse because couldn't 'file.json' in  templates folder");
	}

    // //   try {
    // //     // Read in files.json to see what templates are available
    // //     const json_file = readFileSync(`${__dirname}/templates/files.json`);
    // //     for (let template in json_file) {
	// // 		templates.push(template);
    // //     }

	// // 	console.log(templates);
    // //   } catch (error) {
    // //     vscode.window.showErrorMessage(
    // //       "MyFuse error: Sorry couldn't create Fuse because couldn't 'file.json' in  templates folder"
    // //     );
    // //   }
} 