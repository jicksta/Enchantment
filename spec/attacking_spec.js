describe("Attacking", function() {
  it("should do the damage of the player's weapon each tick", function() {
    var world = new engine.World;
    var player = new engine.Player(world);
    var dmg = player.attackDamage()
    expect(dmg).toBeGreaterThan(0);
    var target = world.zones[0].orc;
    var initialHP = target.hp;
    expect(initialHP).toBeGreaterThan(dmg * 2);
    player.attack(target);
    world.tick();
    expect(target.hp).toEqual(initialHP - dmg);
    world.tick();
    expect(target.hp).toEqual(initialHP - (dmg * 2));
  });
});
