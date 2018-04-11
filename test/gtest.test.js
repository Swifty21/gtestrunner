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

suite("GTest Tests", function() {
    test("Label", function() {
        var test = new GTest("first");
        assert.equal("first", test.getLabel());
    });

    test("State", function() {
        var test = new GTest("first");
        assert.equal(GTest.StateUnknown, test.getState());
        test.setState(GTest.StatePassed);
        assert.equal(GTest.StatePassed, test.getState());
    });
});