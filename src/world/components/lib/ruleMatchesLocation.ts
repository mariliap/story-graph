import Rule from '../../../components/rule'
import Location from '../../../components/location'





type Position = 'source' | 'target'

const ruleMatchesLocation = (rule: Rule, location: Location | undefined, position: Position): boolean => {
  let ruleToken = position === 'source'
    ? rule.getSource()
    : rule.getTarget();
  if (!location) {
    return !ruleToken
  } else {
    return ruleToken instanceof Location 
    ? ruleToken.name === location.name
    : ruleToken === location.id;
  }
}

export default ruleMatchesLocation