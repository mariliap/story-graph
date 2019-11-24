import { Event, RuleElementReference } from './constants';
import Type from './type';
import Location from './location';
import Actor from './actor';

export type TemplateElement = RuleElementReference | string;
export type RuleTypeElement = Type | number | Location | string;

export type CauseTypeElement = [ RuleTypeElement, Event, RuleTypeElement ];
export type ConsequentTypeElement = [ RuleElementReference | RuleTypeElement, Event, RuleElementReference | RuleTypeElement ];


interface CausePattern {
  type: CauseTypeElement,
  template: TemplateElement[],
}

interface ConsequentPattern {
  type: ConsequentTypeElement,
  template: TemplateElement[],
}

export default class Rule {
  cause: CausePattern;
  consequent: ConsequentPattern;
  consequentActor: undefined | Actor;
  id: number;
  isDirectional: boolean;
  locations: Location[];
  mutations: (actorOne: Actor, actorTwo?: Actor) => void;
  name?: string;
  
  constructor(data, id) {
    this.id = id;
    this.name = data.name;

    this.isDirectional = data.isDirectional;
    this.cause = data.cause;
    this.consequent = data.consequent;

    this.consequentActor = data.consequentActor;
    this.mutations = data.mutations;

    this.locations = data.locations || [];
  }
  getSource(): RuleTypeElement {
    return this.cause.type[0];
  }

  getTarget(): RuleTypeElement {
    return this.cause.type[2];
  }
  
  getConsequentSource(): RuleElementReference | RuleTypeElement  {
    return this.consequent && this.consequent.type && this.consequent.type[0];
  }

  getConsequentTarget(): RuleElementReference | RuleTypeElement  {
    return this.consequent && this.consequent.type && this.consequent.type[2];
  }
  getActionType() {
    return this.cause.type[1];
  }
}
