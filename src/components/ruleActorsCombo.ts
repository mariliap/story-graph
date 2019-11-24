import { Actor, Rule } from "../main";

export default class RuleActorsCombo {
  rule: Rule
  actors: Actor[];

  constructor(rule: Rule, actors: Actor[] | Actor) {
    this.rule = rule;
    this.actors = Array.isArray(actors) ? actors : [actors];
  }
}
