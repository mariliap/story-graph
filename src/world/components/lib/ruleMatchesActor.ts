import {RuleTypeElement } from '../../../components/rule'
import Actor from '../../../components/actor'
import Type from '../../../components/type'

const includes = (set: any[], item: any): boolean => {
  for (let i = 0; i < set.length; i++) {
    if (set[i] === item) {
      return true
    }
  }
  return false
}

const isSubset = (set, valueOrSet) => {
  if (!Array.isArray(valueOrSet)) {
    return includes(set, valueOrSet);
  }
  return set.reduce((acc, curr) => acc && includes(valueOrSet, curr), true);
}
/*
type Position = 'source' | 'target'

const ruleMatchesActor2 = (rule: Rule, actor: Actor | undefined, position: Position): boolean => {
  let ruleToken = position === 'source'
    ? rule.getSource()
    : rule.getTarget();
    //console.log(JSON.stringify(ruleToken, null, 4))  ;
  if (!actor) {
    return !ruleToken
  } else {
    
    return ruleToken instanceof Type
    ? isSubset(ruleToken.get(), actor.getTypes())
    : ruleToken === actor.id;
  }
}
*/
const ruleMatchesActor = (ruleToken: RuleTypeElement, actor: Actor | undefined): boolean => {
  
  
    //console.log(JSON.stringify(ruleToken, null, 4))  ;
  if (!actor) {
    console.log("Checking if actor matches rule type " + ruleToken + " but actor is undefined");
    return !ruleToken
  } else {
    
    if(ruleToken instanceof Type){
      //console.log("Checking if actor '"+ actor.name  +"' of types "+ actor.getTypes()+ 
      //            " matches rule type " + ruleToken.get() +": "+ (isSubset(ruleToken.get(), actor.getTypes())? "YES": "NO"));
      return isSubset(ruleToken.get(), actor.getTypes());
    } else {
      //console.log("Checking if actor '"+ actor.name  +"' of types "+ actor.getTypes()+ 
      //            " matches rule token " + ruleToken +": "+ (ruleToken === actor.id? "YES": "NO"));
      return  ruleToken === actor.id;
    }
  }
}

export default ruleMatchesActor