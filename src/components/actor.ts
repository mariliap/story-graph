import { SOURCE_CAUSE, TARGET_CAUSE } from './constants'
import Type from './type'
import Location from './location'


export default class Actor {
  id: number
  type: Type
  name: string
  location?: Location
  locations: Location[]
  entryTime: number
  lifeTime: number
  callback: (number) => void
  members: Actor[]
  blackList: Actor[] //actors likely to be harmed by this actor
  whileList: Actor[] //actors likely to be helped by this actor
  parentId?: number;

  constructor(data, world,  actors?: Actor[] |Actor) {
    this.name = data.name;
    this.type = data.type;
    this.members = [];
    if (data.locations) {
      this.location = data.location || data.locations[0];
      this.locations = data.locations;
    } else {
      this.locations = [];
    }

    this.lifeTime = data.lifeTime || 999;
    if (data.members) {
      this.fetchMembers(world, data.members, actors);
    }
    
    if (data.initializeName) {
      this.name = data.initializeName(this, world);
    }
  }
  fetchMembers(world, members,  actors) {
    members.forEach((member, idx) => {
      if (member === SOURCE_CAUSE) {
        this.members[idx] = actors[0]
      } else if (member === TARGET_CAUSE) {
        this.members[idx] = actors[1]
      }
    });
  }
  hasMember(id: number): boolean {
    let found: boolean = false;
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].id === id) {
        found = true
        break
      }
    }
    return found
  }
  getTypes() {
    return this.type.get();
  }
  setEntryTime(time) {
    this.entryTime = time;
  }
}
