const vscode = require('vscode');
const gtest = require('./gtest');
const fs = require('fs');

class GTestExecuter {
    constructor(exe) {
        this.exe = exe;
    }

    execute(args) {
        if(this.exe != null && fs.existsSync(this.exe)) {
            var execSync = require('child_process').execSync;      
            var child = execSync(this.exe + " " + args);   
            return child.toString();
        }
        else {
            console.warn("[GTestExecuter] GTest exe don't exists");
            return "";
        }
    }

    getTestList() {
        return this.execute("--gtest_list_tests");
    }

    run(name) {
        return this.execute("--gtest_filter=" + name);
    }
}

function activate(context) {
    console.log('Active GTestRunner');
    var executer = new GTestExecuter(vscode.workspace.getConfiguration().get('gtestRunner.exe'));
    var runner = new gtest.GTestRunner(executer, context);
    vscode.window.createTreeView('gtestRunner', { treeDataProvider: runner });
    vscode.commands.registerCommand('gtestRunner.refresh', () => runner.refresh());
    vscode.commands.registerCommand('gtestRunner.runTest', (test) => runner.runTest(test));
}
exports.activate = activate;

function deactivate() {
    console.log('Deactivate GTestRunner');
}
exports.deactivate = deactivate;
