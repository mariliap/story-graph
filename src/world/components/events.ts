import Actor from '../../components/actor'
import Location from '../../components/location'
import { matchRulesFor, printListActorNames } from './story'
import { addPeriod, adaptArticles, capitalizeFirst } from './lib/grammar'
import { SOURCE_CAUSE, TARGET_CAUSE, VANISH, MOVE_IN, Event, MOVE_OUT, SOURCE_CONSEQUENT, TARGET_CONSEQUENT } from '../../components/constants'
import World from '../world'
import Rule from '../../components/rule'
import * as utility from './utility'
import RuleActorsCombo from '../../components/ruleActorsCombo';

const selectAtRandom = (arr: any[]) => {
  return arr[ Math.floor(Math.random() * arr.length) ]
}

/*
 * Replaces the constants SOURCE and TARGET with the IDs of the actors that
 * triggered this rule
 */
export function populateTemplate(eventTemplate, actors: Actor[]) {
  if (!eventTemplate || !eventTemplate.length) return false;
  
  console.log("eventTemplate " + eventTemplate)
  return eventTemplate.map(value => {
    if (value === SOURCE_CAUSE) {
      console.log("SOURCE_CAUSE " + actors[0].name)
      return actors[0];
    } else if (value === TARGET_CAUSE && actors[1]) {
      console.log("TARGET_CAUSE " + actors[1].name)
      return actors[1];
    } else if (value === SOURCE_CONSEQUENT && actors[2] ) {
      console.log("SOURCE_CONSEQUENT " + actors[2].name)
      return actors[2];
    } else if (value === TARGET_CONSEQUENT && actors[3] ) {
      console.log("TARGET_CONSEQUENT " + actors[3].name)
      return actors[3];
    } else {
      return value;
    }
  });
}

type StoryEvent = [ Actor, Event, Actor] | 
                  [ Actor, Event ] | 
                  [ Actor, Event, Location ] | 
                  [ Actor, Event, string ];

export function renderTemplate(world: World, template: any[]) {
  const result = template.map(piece => utility.fetchElement(world, piece));
  const body = result.join(' ');
  if (!body.length) {
    return '';
  }

  return addPeriod(adaptArticles(capitalizeFirst(body)))
}

export function addConsequentActor(world: World, rule: Rule, actors: Actor[] | Actor) {
  const consequentActor = new Actor(rule.consequentActor, world, actors);
  consequentActor.parentId = rule.id;
  world.addActor(consequentActor);
}

export function applyConsequentEvent(world: World, typeExpression) {
  if (!typeExpression.length || typeExpression[0] === undefined) return false;
  const typeExpressionArray = Array.isArray(typeExpression[0]) ? typeExpression : [typeExpression];
  let result = '';
  typeExpressionArray.forEach((expr: StoryEvent) => {
    //console.log('------------');
    //console.log(expr[0]);
    //console.log(expr[1]);
    //console.log(expr[2]);

    switch (expr[1]) {
      case VANISH: { 
        const actor = expr[0];
        utility.removeActor(world, actor.id);
        break;
      }
      case MOVE_OUT:
      case MOVE_IN: { 
        const actor = expr[0];
        const newLocation = expr[2]; //world.getLocationById(expr[2]); // as string;
       
        if (actor && actor instanceof Actor && newLocation && newLocation instanceof Location) {
          actor.location = newLocation;
        }
        break;
      }
      default: { // [ id, SOME_EVENT, id ]
        
        const source = expr[0];
        const target = expr[2];
        if (!source || !(source instanceof Actor)) {
          console.log(expr[0]);
          throw Error(`Actor id ${expr[0]} invalid`);
        }
        if (!target || !(target instanceof Actor)) {
          console.log(expr[2]);
          throw Error(`Actor id ${expr[2]} invalid`);
        }
        const rules = matchRulesFor(world, source, target, expr[1])
        if (rules && rules.length) {
          /* eslint-disable no-use-before-define */
          const rule = selectAtRandom(rules);
          let combo =  new RuleActorsCombo(rule, [source, target]);
          result = processEvent(world, combo);
        }
      }
    }
  });
  return result;
}

export function processEvent(world: World, ruleMatchCombo: RuleActorsCombo) {
  const populatedCauseOutputTemplate = populateTemplate(ruleMatchCombo.rule.cause.template, 
                                                        ruleMatchCombo.actors);
  let populatedConsequentOutputTemplate = []
  let populatedConsequentEventTemplate = false
  if (ruleMatchCombo.rule.consequent) {
    populatedConsequentOutputTemplate = populateTemplate(ruleMatchCombo.rule.consequent.template, 
                                                        ruleMatchCombo.actors);
    populatedConsequentEventTemplate = populateTemplate(ruleMatchCombo.rule.consequent.type, 
                                                        ruleMatchCombo.actors);
  }
  const causeText = populatedCauseOutputTemplate ? renderTemplate(world, populatedCauseOutputTemplate) : ''
  const consequentText = populatedConsequentOutputTemplate ? renderTemplate(world, populatedConsequentOutputTemplate) : ''
  
  if (ruleMatchCombo.rule.consequentActor) {
    addConsequentActor(world, ruleMatchCombo.rule, ruleMatchCombo.actors);
    console.log("Actors in the world: "+ printListActorNames(world.actors));
  }
  //if (ruleMatchCombo.rule.mutations) {
  //  ruleMatchCombo.rule.mutations(actorOne, actorTwo)
 // }
  
  populatedConsequentEventTemplate = false;
  const tertiary = populatedConsequentEventTemplate ? applyConsequentEvent(world, populatedConsequentEventTemplate) : '';

  const result = causeText + consequentText + tertiary + "\n";
  return result;


}
