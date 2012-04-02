(function() {

  exports.Mob = function Mob(name) {
    this.name = name;
    this.hp = 25;
    this.state = "idle";
  };

  var proto = exports.Mob.prototype;

  proto.receivesDamage = function(damage) {
    this.hp -= damage;
    if(this.hp <= 0) {
      this.hp = 0;
      this.state = "dead";
    }
  }


})();
