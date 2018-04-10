const vscode = require('vscode');
const path = require('path');

class IGTest {
    constructor(label) {
        this.label = label;
    }

    run()
    {
        throw new TypeError("Do not call abstract method run from child.");
    }
}

class GTest extends IGTest {
    constructor(label, prefix, runner, icons) {
        super(label);
        this.prefix = prefix;
        this.runner = runner;
        this.iconPath = "";
        this.icons = icons;
        this.collapsibleState = vscode.TreeItemCollapsibleState.None;
        console.log("Create new test: " + label);
    }

    run()
    {
        console.log("Run test: " + this.prefix + "." + this.label);
        var result = this.runner.run(this.prefix + "." + this.label);
        if(result)
        {
            this.iconPath = this.icons.passed;
        }
        else
        {
            this.iconPath = this.icons.failed;
        }
        return result;
    }
}
exports.GTest = GTest

class GTestList extends IGTest {
    constructor(label) {
        super(label);
        this.testList = []
        this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        console.log("Create new tests list: " + label)
    }

    append(test) {
        this.testList.push(test)
    }

    run()
    {
        var result = this.runner.run(this.label + ".*");        
        return result;
    }

    GetChild()
    {
        return this.testList;
    }
}
exports.GTestList = GTestList

const GTestFailedMessage = "[  FAILED  ]";

class GTestRunner {
    constructor(executer, context)
    {
        this.executer = executer;
        this.outputChannel = vscode.window.createOutputChannel("GTestRunner");
        this.icons = {
            passed: context.asAbsolutePath(path.join('resources', 'dark', 'ok.svg')),
            failed: context.asAbsolutePath(path.join('resources', 'dark', 'fail.svg'))};

        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.childerns = [];
        this.refresh();
    }
    
    run(label) {
        var output = this.executer.run(label);
        this.outputChannel.clear();
        this.outputChannel.append(output);
        if(output.indexOf(GTestFailedMessage) == -1)
        {
            return true;
        }
        return false;
    }
    
    getTestsList () {
        var list = [];
        var output = this.executer.getTestList();
        var lines = output.split('\n');
        var self = this;
        lines.forEach( function(line) {
            if (line.indexOf('.') != -1)
            {
                list.push(new GTestList(line.substring(0, line.indexOf('.'))));
            }
            else if(list.length)
            {
                list[list.length - 1].append(new GTest(line.substring(2), list[list.length - 1].label, self, self.icons))
            }
        });
        return list;
    }    

    getTreeItem(item)
    {
        return item;
    }

    getChildren(node)
    {
        if(node == undefined)
        {
            console.log("Root Children");
            return this.childerns;
        }
        console.log("Children of " + node.label);
        return node.GetChild();
    }

    getParent()
    {
        return undefined;
    }
    
    refresh() {
        this.childerns = this.getTestsList();
		this._onDidChangeTreeData.fire();
    }

    runTest(test)
    {
        test.run();
		this._onDidChangeTreeData.fire();
    }
}
exports.GTestRunner = GTestRunner
