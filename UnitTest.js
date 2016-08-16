var assert = require('assert');
var app = require("../cars/app.js");

describe('Test1',function() {
    it('should return bar',function() {
        var foo = app.get('foo');

        assert.ok(foo === 'bar', "This shouldn't fail");
        //assert.ok(true, "This shouldn't fail");

      //app.closeServer();
    });

  it('shoud fail',function() {
      assert.ok(false, "This should fail");
    });
});
