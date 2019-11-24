import Rule, { CauseTypeElement } from '../components/rule'
import Location from '../components/location'
import Actor from '../components/actor'

import { randomMatch, checkMatch, randomActorsForRule, printListActorNames } from './components/story'
import { processEvent } from './components/events'
import getLocalRules from './components/lib/getLocalRules';
import { checkTransitionMatch } from './components/lib/checkTransitionMatch';
import RuleActorsCombo from '../components/ruleActorsCombo';

const unique = (arr: any[]) => {
  let box = {}
  arr.forEach(item => box[item] = true)
  return Object.keys(box)
}

const selectAtRandom = (arr: any[]) => {
  let index = Math.floor(Math.random() * arr.length);
  return arr[index]
}

export default class World {
  actors: Actor[];
  collisions: number;
  lastId: number;
  locations: Location[];
  logEvents: boolean;
  numLocations: number;
  numRules: number;
  output: string;
  previousMatch: null | number;
  rules: Rule[];
  size: number;
  timedEvents: any;
  timeIndex: number;
  focalizer: Actor | null;
  ruleHistory: any[];

  constructor(options) {
    this.size = 0;
    this.collisions = 0;
    this.lastId = -1;
    this.actors = [];

    this.numLocations = 0;
    this.locations = [];

    this.numRules = 0;
    this.rules = [];
    this.ruleHistory = [];

    this.logEvents = options && options.logEvents
    this.previousMatch = null;

    this.timeIndex = 1;
    this.timedEvents = {};
    this.output = '';
    this.focalizer = options && options.focalizer || null;
  }

  addRule(data) {
    const id = this.numRules++;
    this.rules.push(new Rule(data, id));
    return id;
  }

  addLocation(data) {
    data.id = this.numLocations;
    this.locations.push(new Location(data));
    this.numLocations++;
  }

  addActor(actor: Actor | Actor[]) {
    const add = (actorToAdd: Actor) => {
      const id = this.lastId + 1;
      this.lastId = id;
      actorToAdd.id = id;
      actorToAdd.setEntryTime(this.timeIndex);
      this.actors.push(actorToAdd);
      this.size++;
      return id;
    }

    if (Array.isArray(actor)) {
      actor.forEach(item => add.apply(this, [item]));
      return false;
    }
    const id = add.apply(this, [actor]);
    return id;
  }

  getLocationByName(name) {
    for (let i = 0; i < this.locations.length; i++) {
      if (this.locations[i].name === name) {
        return this.locations[i].id;
      }
    }
    return false;
  }

  getLocationById(id): Location | false {
    for (let i = 0; i < this.locations.length; i++) {
      if (this.locations[i].id === id) {
        return this.locations[i];
      }
    }
    return false;
  }

  getActorById(id): Actor | false {
    for (let i = 0; i < this.size; i++) {
      if (this.actors[i].id === id) {
        return this.actors[i];
      }
    }
    return false;
  }

  removeActor(id: number) {
    let index: number | null = null;
    for (let i = 0; i < this.actors.length; i++) {
      if (this.actors[i].id === id) {
        index = i;
        break;
      }
    }
    if (index !== null) {
      this.actors.splice(index, 1);
      this.size--;
    }
  }

  processTimeTrigger(world: World,callback: any){

  }

  renderEvent(events) {
    let output = '';
    events.forEach(storyEvent => {
      console.log('Render Event'); 
      const results = this.findRuleActorsCombo(storyEvent);
      if (results) {
        output += processEvent(this, results);
      }
    });
    this.output = `${this.output}${output}`;
  }

  randomEvent() {
    let rule: Rule ;
    let excludedRulesIds: number[] = [];
    let excludedActors: Actor[] = [];
    let chosingMainActorAttemps = 0;
    let chosingRuleAttemps = 0;
    let ruleAssigned = false;
    let combo : false | RuleActorsCombo =  false;

    if (this.collisions > 10000) {
      throw new Error('No matches found! ' + this.collisions + ' collisions!')
    }

    while (chosingMainActorAttemps < 100 && !ruleAssigned && this.actors.length != excludedActors.length){
      chosingRuleAttemps = 0;
      excludedRulesIds=[];

      let mainActors = [this.randomActor(undefined, excludedActors)];
      console.log("Main actor: " + mainActors[0].name)
      let  rules = randomMatch(this, mainActors, excludedRulesIds);
      
      while(chosingRuleAttemps  < 100 && !ruleAssigned && this.rules.length != excludedRulesIds.length) {

        rules = rules.filter(rule => excludedRulesIds.filter(exRuleId => exRuleId === rule.id).length == 0);
        if (rules.length >0) {

          rule = selectAtRandom(rules);

          console.log("### Rule: " + rule.name + " Source:" + rule.getSource() + " Target: " + (rule.getTarget()? rule.getTarget(): "NA"));
          
          if(!rule.getTarget() || rule.getTarget() instanceof Location){
            ruleAssigned = true;
            combo = new RuleActorsCombo(rule, mainActors);
            this.pushRuleMatchInHistory(combo);
          } else {
            console.log("Searching matching partner entities for rule "+  rule.name);
            let randomActors = randomActorsForRule(this, rule, mainActors);
            let actorsMatch = [...mainActors];
            if(randomActors){
              actorsMatch.push(...randomActors);
            }
            combo = new RuleActorsCombo(rule, actorsMatch);
            if(combo.actors.length == mainActors.length){
              console.log("### Rule not matched. No actor.");
              excludedRulesIds.push(rule.id);
              combo = false;
            } else if(this.findRuleMatchInHistory(combo)){
              console.log("### Rule not matched. History.");
              this.collisions += 1
              excludedRulesIds.push(rule.id);
              combo = false;
            } else {
              ruleAssigned = true;
              this.pushRuleMatchInHistory(combo);
            }
          }
        } else {
          break;
        }
        chosingRuleAttemps++;
      }

      if(!ruleAssigned){
        mainActors.forEach(actor => {
          excludedActors.push(actor);
        });
      }

      chosingMainActorAttemps++;
    }

    
    if (!combo) {
      //throw new Error('No matches found! Suggest run testMatches() to evaluate possible matches')
      console.log('No matches found! Suggest run testMatches() to evaluate possible matches')
    } else {  
      console.log(`Match on rule "${combo.rule.name}". Entities involved: " ${printListActorNames(combo.actors)}"`)

      let output = processEvent(this, combo);
      this.output = `${this.output}${output}`;
    }


  }

  /*
  * This is the main method used for producing output
  */
  runStory(steps, theEvents = []) {
    this.registerTimedEvents(theEvents);
    while (this.timeIndex <= steps) {
      console.log('############################## Time '+this.timeIndex+' ########################'); 
      this.advanceTime();
    }
  }

  advanceTime() {
    if (this.timedEvents[this.timeIndex] !== undefined) {
      this.renderEvent([ this.timedEvents[this.timeIndex] ]);
    } else {
      this.randomEvent();
    }
    this.actors.forEach(actor => {
      const age = this.timeIndex - actor.entryTime;
      if (age > actor.lifeTime) {
        this.removeActor(actor.id);
      } else if (actor.callback) {
        this.processTimeTrigger(this, actor.callback(this.timeIndex));
      }
    });
    this.timeIndex++;
  }

  registerTimedEvents(theEvents) {
    theEvents.forEach(event => {
      this.timedEvents[event.step] = event.event;
    });
  }

  findRuleActorsCombo(piece: CauseTypeElement): RuleActorsCombo | false {
    const source = this.getActorById(piece[0]);
    const action = piece[1];
    const target = this.getActorById(piece[2]);
    if (source && target) {
      for (let i = 0; i < this.numRules; i++) {
        const rule = this.rules[i];
        if (checkMatch(rule, source, target, action)) {
         
          let combo =  new RuleActorsCombo(rule, [source, target]);
          return combo;
        }
      }
    }
    return false;
  }

  findRuleMatchInHistory(combo: RuleActorsCombo): boolean {
    let matchesInHistory = this.ruleHistory.filter(element => {
      let sameActorsInOrder = false;
      if(element.actors.length == combo.actors.length){
        sameActorsInOrder = true;
        for(let i = 0; i < element.actors.length; i++){
          if(element.actors[i] !== combo.actors[i]){
            sameActorsInOrder = false;
            break;
          }
        }
      } 
      if(sameActorsInOrder && element.rule.name === combo.rule.name){
        return true;
      } else {
        return false;
      }
    });

    return matchesInHistory.length !== 0;
  }

  pushRuleMatchInHistory(combo: RuleActorsCombo){
    this.ruleHistory.push(combo);
  }

  testMatches() {
    const results = {}
    this.actors.forEach(actor => {
      results[actor.name] = {}
      if (actor.locations.length) {
        //console.log(actor.locations)
        actor.locations.forEach(location => {
          actor.location = location
          this.populateMatchesForActor(actor, results);
        })
      }
      this.populateMatchesForActor(actor, results);
    })
    return results
  }

  randomActor(locations?: Location[], excludedActors?:Actor[]): Actor {
    let actors = this.actors;
   
    if(excludedActors) {
      actors = actors.filter(actor => 
                                excludedActors.filter(exActor => exActor.id === actor.id).length == 0);
    }
    if(locations) {
      let location = locations[0];
      actors = actors.filter(actor => 
                                actor.location === location || 
                                actor.locations.filter(loc => loc.name === location.name).length !== 0);
    }

    const index = Math.floor(Math.random() * actors.length)
    console.log("Random actor. Length List to Choose From:"+actors.length + " Choosing: '" +actors[index].name+"'");
    
    return actors[index];
  }

  populateMatchesForActor(actor, results) {
    let localActors;
    if (actor.location) {
      localActors = this.actors.filter(actorTwo => actor.location === actorTwo.location && actor.name !== actorTwo.name)
    } else {
      localActors = this.actors.filter(actorTwo => actorTwo.name !== actor.name);
    }
    let localRules = getLocalRules(this, actor)
    const transitionRules = this.rules.filter(rule => checkTransitionMatch(rule, actor));
    
    if(!localActors.length && !results[actor.name]) {
      results[actor.name] = 'ERROR: no local actors'
    } else if (!localRules.length && !transitionRules.length && !results[actor.name]) {
      results[actor.name] = 'ERROR: no matching rules'
    } else {

      results[actor.name].TRANSITION_RULES = results[actor.name].TRANSITION_RULES 
        ? unique(results[actor.name].TRANSITION_RULES.concat(transitionRules.map(r => r.id)))
        : transitionRules.map(r => r.id);

      results[actor.name].INTERACTION_RULES = {}

      localActors.forEach(actorTwo => {
        results[actor.name].INTERACTION_RULES[actorTwo.name] = results[actor.name].INTERACTION_RULES[actorTwo.name] || []
        localRules.forEach(rule => {
          const isMatch = checkMatch(rule, actor, actorTwo)
          if (isMatch && results[actor.name].INTERACTION_RULES[actorTwo.name].indexOf(rule.id) === -1) {
            results[actor.name].INTERACTION_RULES[actorTwo.name].push(rule.name || rule.id)
          }
        })
      })

    }
  }
}
