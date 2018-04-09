/* global suite, test */
const assert = require('assert');
const gtest = require('../gtest');

suite("Extension Tests", function() {
    class GTestExecuterFake {
        getTestList() {
            return "ForLoopActionTest.\n  Single\n  List\nIfActionTest.\n  Eq\n  Neq";
        }
        run(name) {
            if(name == "Single")
            {
                return "[  RUN     ]\nblabla bla\n[  PASSED  ]\nfwefwefwef\n"
            }
            else if(name == "List")
            {
                return "[  RUN     ]\nblabla bla\n[  PASSED  ]\n[  FAILED  ]\nfwefwefwef\n[  ]"
            }
        }
    }

    test("GTestParserList", function() {
        var executer = new GTestExecuterFake();
        var parser = new gtest.GTestRunner(executer);
        var list = parser.getTestsList();

        assert.equal(list[0].name, "ForLoopActionTest");
        assert.equal(list[0].testList[0].name, "Single");
        assert.equal(list[0].testList[1].name, "List");

        assert.equal(list[1].name, "IfActionTest");
        assert.equal(list[1].testList[0].name, "Eq");
        assert.equal(list[1].testList[1].name, "Neq");
    });

    test("GTestRun", function() {
        var executer = new GTestExecuterFake();
        var parser = new gtest.GTestRunner(executer);
        var list = parser.getTestsList();

        assert.equal(true, list[0].testList[0].run());
        assert.equal(false, list[0].testList[1].run());
    });
});