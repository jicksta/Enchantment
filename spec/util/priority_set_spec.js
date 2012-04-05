describe("PrioritySet", function() {

  var PrioritySet = require("../../src/util/priority_set.js").PrioritySet;

  var set;
  beforeEach(function() {
    set = new PrioritySet("id");
  });

  describe("#first", function() {

    it("returns the object with the highest priority", function() {
      var one = objWithID();
      var two = objWithID();
      var three = objWithID();
      set.add(three, 3);
      set.add(one, 1);
      set.add(two, 2);

      expect(set.first()).toEqual(three);
    });

    it("should return objects with positive priorities before those with negative priorities", function() {
      var pos = objWithID();
      var neg = objWithID();
      set.add(neg, -10);
      set.add(pos, 1);
      expect(set.first()).toEqual(pos);
    });

  });

  describe("#add", function() {
    it("should raise an exception if the added object does not have an id", function() {
      expect(
          function() {
            set.add("This doesn't have an ID", 0);
          }).toThrow();
    });
  });

  describe("#priorityOf", function() {
    it("returns the correct priority", function() {
      var jay = objWithID(), tati = objWithID();
      set.add(jay, 5);
      set.add(tati, 10);
      expect(set.priorityOf(tati)).toEqual(10);
      expect(set.priorityOf(jay)).toEqual(5);
    });

    it("should return undefined if the object is not in the set", function() {
      expect(set.priorityOf(objWithID())).toBeUndefined();
    })

  });

  describe("#updatePriority", function() {
    it("updates the priority", function() {
      var jay = objWithID(), tati = objWithID();
      set.add(jay, 5);
      set.add(tati, 10);
      set.updatePriority(jay, -10);
      expect(set.priorityOf(jay)).toEqual(-10);
      expect(set.priorityOf(tati)).toEqual(10);
    });

    it("should throw if the object is not in the set", function() {
      expect(
          function() {
            set.updatePriority(objWithID(), -10);
          }).toThrow("Object is not in this set!");
    });

    it("should work when called multiple times", function() {
      var obj = objWithID();
      set.add(obj, 0);
      set.updatePriority(obj, -10);
      set.updatePriority(obj, -12);
      set.updatePriority(obj, -14);
      expect(set.priorityOf(obj)).toEqual(-14)
    });

    it("should allow first() to continue working", function() { // regression
      var obj = objWithID();
      set.add(obj, 3);
      set.updatePriority(obj, 5);
      expect(set.first()).toEqual(obj);
    });
    

  });

  describe("#has", function() {
    it("should return true if the object is in the set", function() {
      var obj = objWithID();
      set.add(obj);
      expect(set.has(obj)).toEqual(true);
    });

    it("should return false if the object is not in the set", function() {
      expect(set.has(objWithID())).toEqual(false);
    });
  });

  describe("internal state", function() {
    it("should clear out previous caches when updating the priority", function() {
      var obj = {id: "abc"};
      set.add(obj, 5);
      set.updatePriority(obj, 8);
      expect(set._prioritiesToObjects[5]).toBeUndefined();
      expect(set._sortedPriorities).not.toContain(5);
    });
  });

  function objWithID() {
    var id = Math.random().toString();
    return new (function() {
      this.id = id
    });
  }

});
