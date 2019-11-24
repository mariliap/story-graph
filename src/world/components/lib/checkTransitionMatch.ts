import Rule from '../../../components/rule'
import Actor from '../../../components/actor' 
import Location from '../../../components/location'
import { MOVE_OUT } from '../../../components/constants'

import ruleMatchesActor from './ruleMatchesActor'

/**
 * checkTransitionMatch
 *   Checks that a Rule can be caused by an Actor, an Actor is in the correct
 *   origin Location, an Actor is moving to a valid destination Location,
 *   and the Action is "move_out".
 *
 * @param  {Rule} rule
 *   The Rule to validate.
 * @param  {Actor} actor
 *   The Actor to validate.
 * @param  {Location[]} locations
 *   All possible Locations.
 * @param  {Action} action
 *   The type of Action.
 * @return {Boolean}
 *   Whether or not the transition is valid.
 */

export const checkTransitionMatch = (
  rule: Rule, 
  actor: Actor 
): boolean => {
  if (rule.getActionType() === MOVE_OUT && rule.getTarget() === actor.location) {
    console.log("Checking if actor '"+ actor.name  +"' of types "+ actor.getTypes()+ " matches source of rule " + rule.name + ", which is " + rule.getSource().toString());
    return ruleMatchesActor(rule.getSource(), actor)
  } else {
    return false;
  }
};

export const checkInteractionMatch = (
  rule: Rule, 
  actor: Actor
): boolean => {
  if (rule.getActionType() !== MOVE_OUT && !(rule.getTarget() instanceof Location)) {
    console.log("Checking if actor '"+ actor.name  +"' of types "+ actor.getTypes()+ " matches source of rule " + rule.name + ", which is " + rule.getSource().toString());
    return ruleMatchesActor(rule.getSource(), actor)
  } else {
    return false;
  }
};



// rule.getActionType === MOVE_OUT && rule.getTarget === actor.location