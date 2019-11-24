export type Event =
  'EVENT__REST' |
  'EVENT__MOVE_IN' |
  'EVENT__MOVE_OUT' |
  'EVENT__APPEAR' |
  'EVENT__VANISH' |
  'EVENT__ENCOUNTER'|
  'EVENT__DO';

export type RuleElementReference =
  'ELEMENT_REFERENCE__TARGET' |
  'ELEMENT_REFERENCE__SOURCE'


export const MOVE_IN: Event = 'EVENT__MOVE_IN'
export const MOVE_OUT: Event = 'EVENT__MOVE_OUT'
export const APPEAR: Event = 'EVENT__APPEAR'
export const VANISH: Event = 'EVENT__VANISH'
export const ENCOUNTER: Event = 'EVENT__ENCOUNTER'
export const REST: Event = 'EVENT__REST'
export const DO: Event = 'EVENT__DO'

export const TARGET_CAUSE: RuleElementReference = 'ELEMENT_REFERENCE__TARGET'
export const SOURCE_CAUSE: RuleElementReference = 'ELEMENT_REFERENCE__SOURCE'

export const TARGET_CONSEQUENT: RuleElementReference = 'ELEMENT_REFERENCE__TARGET'
export const SOURCE_CONSEQUENT: RuleElementReference = 'ELEMENT_REFERENCE__SOURCE'
