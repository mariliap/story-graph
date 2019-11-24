import { Event } from '../../components/constants'
import {checkTransitionMatch,checkInteractionMatch} from './lib/checkTransitionMatch'
import Actor from '../../components/actor'
import Location from '../../components/location'
import Rule, { RuleTypeElement } from '../../components/rule'
import World from '../../world/world'
import { SOURCE_CAUSE, TARGET_CAUSE, SOURCE_CONSEQUENT, TARGET_CONSEQUENT } from '../../components/constants'

import ruleMatchesActor from './lib/ruleMatchesActor'
import ruleMatchesLocation from './lib/ruleMatchesLocation'
import getLocalRules from './lib/getLocalRules';

//const sameLocation = (one: Actor, two: Actor): boolean => (one.location && two.location )?  one.location.name === two.location.name : false;
//const sameName = (one: Actor, two: Actor): boolean => one.name === two.name;

/*
export function twoActors(world: World, actor?: Actor, location?: Location): Actor[] {
  const actorOne: Actor = actor || world.randomActor(location);
  let localActors: Actor[];
  if (actorOne.location) {
    localActors = world.actors.filter(actor => sameLocation(actor, actorOne) && !sameName(actor, actorOne))
  } else {
    localActors = world.actors.filter(actor => !sameName(actor, actorOne));
  }
  if (!localActors.length) {
    return [ actorOne ];
  }
  const actorTwo: Actor = localActors[Math.floor(Math.random() * localActors.length)];
  return [ actorOne, actorTwo ];
}
*/

export function checkMatch(
    rule: Rule, 
    source: Actor, 
    target: Actor | Location | undefined, 
    action?: Event
): boolean {
  let match;
  const sourceMatch = ruleMatchesActor(rule.getSource(), source)
  
  const targetMatch = (target instanceof Actor) ? 
                       ruleMatchesActor(rule.getTarget(), target) : 
                       ruleMatchesLocation(rule, target, 'target') ;

  
  console.log(source.name +(target? (' e '+target.name) :'') + ' -> ' 
    + rule.name, ' sourcematch:'+sourceMatch + ', targetmatch:'+targetMatch);                       

  if (!rule.isDirectional && target !== undefined && target instanceof Actor) {

    const flippedSourceMatch = (target instanceof Actor) ? 
                                ruleMatchesActor(rule.getSource(), target) : 
                                ruleMatchesLocation(rule, target, 'source') ;  
    const flippedTargetMatch = ruleMatchesActor(rule.getTarget(), source);

    match = (sourceMatch && targetMatch) || (flippedTargetMatch && flippedSourceMatch);

  } else { match = (sourceMatch && targetMatch); }

  /* this code assumes that actors cannot interact with rule that they are a member of.
  I think this may be incorrect so I am commenting it out for now

  const sourceInTarget = !!target && target.members && target.hasMember(source.id);
  const targetInSource = !!target && source.members && source.hasMember(target.id);
  */

  if (action !== undefined) {
    return match && rule.getActionType() === action
      /* && !(sourceInTarget || targetInSource); */
  }

  return match /* && !(sourceInTarget || targetInSource); */
}

export function matchRulesFor(
  world: World, 
  actorOne: Actor, 
  actorTwo: Actor | undefined, 
  action?: Event
) {
  const matchedRules: Rule[] = [];

  const localRules = getLocalRules(world, actorOne);
  console.log('As regras locais para '+actorOne.name+ ' são: ' + printListRuleNames(localRules));
  console.log('Checando as regras locais ...');

  for (let i = 0; i < localRules.length; i++) {
    const currentRule = localRules[i];
    const isMatch = checkMatch(currentRule, actorOne, actorTwo, action);

    if (isMatch) {
      matchedRules.push(currentRule);
    }
  }
  console.log('Regras com match são: ' + printListRuleNames(matchedRules));

  if (!matchedRules.length) {
    return false;
  }

  return matchedRules;
}

export function randomMatch(
  world: World, 
  mainActors: Actor[], 
  excludedArray?: null | number[],
): Rule[] {
  console.log("Checking possible rules for actor: " + mainActors[0].name)
  const actorOne = mainActors[0];
  const transitions = world.rules.filter(rule => checkTransitionMatch(rule, actorOne));
  const interactions = world.rules.filter(rule => checkInteractionMatch(rule, actorOne));
  //const interactions = matchRulesFor(world, actorOne, actorTwo) || [];
  let rules = interactions.concat(transitions)
  if (excludedArray) {
    rules = rules.filter(r =>  !excludedArray.includes(r.id))
  }
  
  console.log("Rules matched for '" + actorOne.name + "':"+printListRuleNames(rules));

  return rules.length ? rules : []
}

export function printListRuleNames(rules:Rule[]):string{
  let rulesNamesString = '';
  rules.forEach(element => {
    rulesNamesString += element.name + ', ';
  });
  //rulesNamesString.substring(1, rulesNamesString.length-2);
  
  return rulesNamesString;
}



export function randomActorsForRule(world: World, rule: Rule, mainActors: Actor[]): Actor[] | false {

  let actorOne = mainActors[0];
  let location = actorOne.location ? [actorOne.location] : [];
  let worldActors = world.actors;
  let selectedActors : Actor[] = [];
  let excludedActorsForMatching : Actor[] = [];
  let ruleTypeElements : RuleTypeElement[] = [];


  if ( (!rule.cause.template || !rule.cause.template.length)
      && (rule.consequent == null || !rule.consequent.template || !rule.consequent.template.length)) {
      console.log("### Searching for matching actors. No consequent.");
      return false;
  }

  //if(rule.getSource()){
  //  ruleTypeElements.push(rule.getSource());
  //}

  if(rule.getTarget()){
    ruleTypeElements.push(rule.getTarget());
  }

  if(rule.getConsequentSource()){
    ruleTypeElements.push(rule.getConsequentSource());
  }

  if(rule.getConsequentTarget()){
    ruleTypeElements.push(rule.getConsequentTarget());
  }

  if(ruleTypeElements.length > 0){

    excludedActorsForMatching.push(...mainActors);
    let index = 0;

    while(excludedActorsForMatching.length < worldActors.length
          && index < ruleTypeElements.length){
      
      if(ruleTypeElements[index]){
        console.log("------------------------");
        console.log("Choosing actor for position "+ (index+1)  + " of " + ruleTypeElements.length +" supporting actors: " + ruleTypeElements[index]);
        if(ruleTypeElements[index] === SOURCE_CAUSE) {
          selectedActors.push(actorOne);
          index++;
          console.log("Choosing matching actor: "+ selectedActors[selectedActors.length-1].name);
        } else if (ruleTypeElements[index] === TARGET_CAUSE){
          selectedActors.push(selectedActors[1]);
          index++;
          console.log("Choosing matching actor: "+ selectedActors[selectedActors.length-1].name);
        } else if (ruleTypeElements[index] === SOURCE_CONSEQUENT){
          selectedActors.push(selectedActors[2]);
          index++;
          console.log("Choosing matching actor: "+ selectedActors[selectedActors.length-1].name);
        } else if (ruleTypeElements[index] === TARGET_CONSEQUENT){
          selectedActors.push(selectedActors[3]);
          index++;
          console.log("Choosing matching actor: "+ selectedActors[selectedActors.length-1].name);
        } else {

          let actor = world.randomActor(location, excludedActorsForMatching);
          if(ruleMatchesActor(ruleTypeElements[index], actor)){
            
            selectedActors.push(actor);
            excludedActorsForMatching = [];
            excludedActorsForMatching.push(...mainActors);
            excludedActorsForMatching.push(...selectedActors);
            index++;
            console.log("Choosing matching actor: "+ actor.name);
          } else {
            excludedActorsForMatching.push(actor);
          }
        }
      }
      console.log("Selected actors so far: " + printListActorNames(selectedActors));
      
    }
  }
  
  if(selectedActors.length == ruleTypeElements.length){
    return selectedActors
  } else {
    return false
  }
  
}

export function printListActorNames(rules:Actor[]):string{
  let actorNamesString = '';
  rules.forEach(element => {
    actorNamesString += element.name + ', ';
  });
  actorNamesString = actorNamesString.substring(0,actorNamesString.length-2).trim();
  return actorNamesString;
}