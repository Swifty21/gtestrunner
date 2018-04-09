const vscode = require('vscode');
const gtest = require('./gtest');

class GTestExecuter {
    constructor(exe)
    {
        this.exe = exe;
    }
    
    outputFoo(out)
    {
        this.out = out;
    }

    execute(args)
    {
        var execSync = require('child_process').execSync;      
        var child = execSync(this.exe + " " + args);   
        return child.toString();
    }

    getTestList() {
        return this.execute("--gtest_list_tests");
    }

    run(name) {
        return this.execute("--gtest_filter=" + name);
    }
}

function activate(context) {
    console.log('Actived GTestRunner');

    var runner = new gtest.GTestRunner(new GTestExecuter("H:/Develop/Projects/GtestRunner/Perf.ClickerTests.exe"), context);
    vscode.window.createTreeView('gtestRunner', { treeDataProvider: runner });
    vscode.commands.registerCommand('gtestRunner.refresh', () => runner.refresh());
    vscode.commands.registerCommand('gtestRunner.runTest', (test) => runner.runTest(test));
}
exports.activate = activate;

// this method is called when extension is deactivated
function deactivate() {
    console.log('Deactivate GTestRunner');
}
exports.deactivate = deactivate;
