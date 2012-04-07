describe("IdSet", function() {

  var IdSet = require("../../src/util/id_set.js").IdSet;
  var _ = require("underscore");

  var set;
  beforeEach(function() {
    set = new IdSet;
  });

  it("should have a default id attribute name of 'id'", function() {
    expect(set.idAttribute).toEqual("id");
  });

  it("should have an object stored in it with add", function() {
    var obj = {id: "someID"};
    set.add(obj);
    expect(set.has(obj)).toEqual(true);
  });

  it("should allow removing an object stored in it", function() {
    var obj = {id: "someID"};
    set.add(obj);
    set.remove(obj);
    expect(set.has(obj)).toEqual(false);
  });

  it("should have a correct size", function() {
    set.add({id: "one"});
    set.add({id: "two"});
    expect(set.length).toEqual(2);
  });

  it("should raise an exception if the added object does not have an id", function() {
    expect(function() {
      set.add({});
    }).toThrow();
  });

  it("should not increase the length if adding the same object twice", function() {
    var obj = {id: "doesntmatter"};
    set.add(obj);
    set.add(obj);
    expect(set.length).toEqual(1);
  });

  it("should enumerate every member with its each method", function() {
    var one = {id: "one"}, two = {id: "two"}, three = {id: "three"};
    set.add(one);
    set.add(two);
    set.add(three);
    var ids = [];
    set.each(function(obj) {
      ids.push(obj.id);
    });
    expect(ids.sort()).toEqual(["one", "two", "three"].sort())
  });

  it('returns an object added to it when calling first()', function() {
    var obj = {id: "doesntmatter"};
    set.add(obj);
    expect(set.first()).toEqual(obj);
  });

  it("returns undefined when calling first() on an empty set", function() {
    expect(set.first()).toBeUndefined();
  });

});
