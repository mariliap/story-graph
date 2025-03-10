/*
const assert = require('assert');
const matchTransitionFor = require('../../../../../src/world/components/lib/matchTransitionFor');
const Rule = require('../../../../../src/components/rule');
const SG = require('../../../../../src/main');
const Actor = SG.Actor;
const Type = SG.Type;
const c = SG.constants;

describe('matchTransitionFor', () => {
  const world = new SG.World();
  const cat = new Type('cat');
  world.addLocation({ name: 'the garden' });
  world.addLocation({ name: 'the shed' });
  const Sport = world.addActor(new Actor({
    type: cat,
    name: 'Sport',
    locations: ['the garden', 'the shed'],
  }));
  world.addRule(new Rule({
    cause: {
      type: [Sport, c.move_out, 'the garden'],
      value: [],
    },
    consequent: {
      type: [c.source, c.move_in, 'the shed'],
      value: [c.source, 'wanders', 'the shed'],
    },
    isDirectional: true,
    mutations: null,
    consequentActor: null,
  }));
  const actor = world.actors[0];
  it('Returns a Rule if there are available Rules', () => {
    assert.deepEqual(matchTransitionFor(actor, world.numRules, world.rules) instanceof Rule, true);
  });
  it('Returns false if there are no available Rules', () => {
    world.rules = [
      new Rule({
        cause: {
          type: [Sport, c.move_out, 'the shed'],
          value: [],
        },
        consequent: {
          type: [c.source, c.move_in, 'the garden'],
          value: [c.source, 'wanders', 'the garden'],
        },
        isDirectional: true,
        mutations: null,
        consequentActor: null,
      }),
    ];
    assert.deepEqual(matchTransitionFor(actor, world.numRules, world.rules), false);
  });
});
*/