import World from 'src/world/world'
import { Actor, Location } from '../../main';

export function removeActor(world: World, id: number) {
  let index: number | null = null;
  for (let i = 0; i < world.actors.length; i++) {
    if (world.actors[i].id === id) {
      index = i;
      break;
    }
  }
  if (index !== null) {
    world.actors.splice(index, 1);
    world.size--;
  }
}

export function fetchElement(world: World, element: any): string {
  if (element instanceof Actor) {
    //console.log("actor:");
    //console.log(world.getActorById(element.id));
    const actor = world.getActorById(element.id)
    if (actor) {
      return actor.name
    }
  } else if (element instanceof Location) {
    const location = world.getLocationById(element.id)
    if (location) {
      return location.name
    }
  } else if (typeof element === 'string') {
    return element
  }

  //console.log(element);
  return ''
}



