/* global suite, test */
const assert = require('assert');

class GTest
{
    constructor(label) {
        this._label = label;
        this._state = GTest.StateUnknown;
    }

    static get StatePassed() {
        return "Passed";
    }
    static get StateFailed() {
        return "Failed";
    }
    static get StateUnknown() {
        return "Unknown";
    }

    setState(state) {
        this._state = state;
        console.log("Set " + this._label + " state " + this._state);
    }

    getState() {
        return this._state;
    }

    getLabel() {
        return this._label;
    }
}

class GTestRunner
{
    constructor(executor) {
        this._executor = executor;
    }

    static get FailedMessage() {
        return "[  FAILED  ]";
    }

    run(test)
    {
        var output = this._executor.run(test.getLabel());
        if(output.indexOf(GTestRunner.FailedMessage) == -1)
        {
            return true;
        }
        return false;
    }
}

class GTestFakeExecutor
{
    constructor() {
    }

    run(name) {
        if(name == "oktest")
            return "[OK]";
        return "[  FAILED  ]";
    }

    getList() {
        var output = "";
        return output;
    }
}

suite("GTestRunner Tests", function() {
    test("Run", function() {
        var executor = new GTestFakeExecutor();
        var runner = new GTestRunner(executor);
        
        assert.ok(runner.run(new GTest("oktest")));
        assert.ok(!runner.run(new GTest("failtest")));
    });
});