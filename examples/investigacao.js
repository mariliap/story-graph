const SG = require('../dist/story.js');
const world = new SG.World();
const Actor = SG.Actor;
const Location = SG.Location;
const Type = SG.Type;
const c = SG.constants;

const entity = new Type('entity');

const life = entity.extend('life');
const animal = life.extend('animal');
const plant = life.extend('plant');

const spirit = entity.extend('spirit');
const connection = new Type('connection');

const extendType = typeName => type => {
  if (type === undefined) {
    return new Type(typeName);
  }
  return type.extend(typeName);
};

//Cause, motivação
//const causa = new Causa({
//  type: bumbling(quiet(dark(spirit))),
//  name: 'Como', //Ja que
  //locations: [casa, jardim],
//});

template= ['Como ', c.SOURCE, 'fez um acordo ilegal com', c.TARGET, ','];

const casa = new Location({
  name: 'a casa',
});

const jardim = new Location({
  name: 'o jardim',
});

world.addLocation(casa);
world.addLocation(jardim);

const bumbling = extendType('bumbling');
const bright = extendType('bright');
const confused = extendType('confused');
const cold = extendType('cold');
const hot = extendType('hot');
const dark = extendType('dark');
const jolting = extendType('jolting');
const curving = extendType('curving');
const outpouring = extendType('outpouring');
const beautiful = extendType('beautiful');
const complex = extendType('complex');
const simple = extendType('simple');
const quiet = extendType('quiet');
const loud = extendType('loud');
const inflowing = extendType('inflowing');

const diretor = new Actor({
  type: bumbling(quiet(dark(spirit))),
  name: 'o diretor',
  locations: [casa, jardim],
});

const secretaria = new Actor({
  type: confused(dark(spirit)),
  name: 'a secretaria',
  locations: [casa, jardim],
});

const estagiario = new Actor({
  type: confused(quiet(spirit)),
  name: 'o estagiario',
  locations: [casa, jardim],
});

const policial = new Actor({
  type: bumbling(quiet(bright(spirit))),
  name: 'o policial',
  locations: [casa, jardim],
});

world.addActor([diretor, secretaria, estagiario, policial]);
//console.log(JSON.stringify(world.actors, null, 4))  ;

/*
const whisper = new Actor({
  type: bumbling(quiet(dark(spirit))),
  name: 'o susurro',
  locations: [casa, jardim],
});

const reeds = new Actor({
  type: outpouring(beautiful(simple(plant))),
  name: 'o rabo do gato',
  locations: [casa, jardim],
});

const river = new Actor({
  type: curving(complex(outpouring(spirit))),
  name: 'o rio',
  locations: [casa, jardim],
});

const shadow = new Actor({
  type: dark(inflowing(quiet(spirit))),
  name: 'a sombra',
  locations: [casa, jardim],
});

const duck = new Actor({
  type: bumbling(outpouring(curving(animal))),
  name: 'um pato ',
  locations: [casa, jardim],
});

const bluejay = new Actor({
  type: bumbling(loud(jolting(animal))),
  name: 'um passarinho',
  locations: [casa, jardim],
});

const sunlight = new Actor({
  type: outpouring(bright(simple(hot(spirit)))),
  name: 'a luz do sol',
  locations: [casa, jardim],
});

const snow = new Actor({
  type: bright(beautiful(complex(inflowing(cold(spirit))))),
  name: 'a neve',
  locations: [casa, jardim],
});

const ice = new Actor({
  type: bright(beautiful(simple(inflowing(cold(spirit))))),
  name: 'o gelo',
  locations: [casa, jardim],
});


world.addActor([whisper, reeds, river, shadow, duck, snow, sunlight, bluejay, ice]);
*/

world.addRule({
  name:'acordoIlegal',
  cause: {
    type: [dark(spirit), c.ENCOUNTER, dark(spirit)],
    template: ['Como', c.SOURCE_CAUSE, 'fez um acordo ilegal com', c.TARGET_CAUSE, 'para lavar o dinheiro'],
  },
  consequent: {
    type: [c.SOURCE_CAUSE, c.DO, bright(spirit)],
    template: [c.SOURCE_CAUSE, 'ficou nervoso e contou para', c.TARGET_CONSEQUENT],
  },
  isDirectional: false,
  consequentActor: {
    type: complex(dark(connection)),
    name: 'o acordo ilegal',
    members: [c.SOURCE_CAUSE, c.TARGET_CAUSE],
    lifeTime: 20,
    initializeName: (actor) => `${actor.name} d${actor.members[0].name} e d${actor.members[1].name}`
  },
});

world.addRule({
  name:'investigado',
  cause: {
    type: [complex(connection), c.REST],
    template: [c.SOURCE_CAUSE, 'está sendo investigado'],
  },
  consequent: {},
  isDirectional: true,
});

/*
world.addRule({
  name:'demissao',
  cause: {
    type: [dark(entity), c.DO, confused(entity)],
    template: [c.SOURCE_CAUSE, 'manda', c.TARGET_CAUSE, 'embora.'],
  },
  consequent: {
    type: [c.TARGET_CAUSE, c.ENCOUNTER, bright(entity)],
    template: [c.TARGET_CAUSE, 'encontra ', c.TARGET_CONSEQUENT],
  },
  isDirectional: true,
});

world.addRule({
  name:'descobrimentoIndicado',
  cause: {
    type: [confused(entity), c.DO, bright(entity)],
    template: [c.TARGET_CAUSE, 'descobre falcatrua envolvendo', c.SOURCE_CAUSE],
  },
  consequent: {
    type: [c.TARGET_CAUSE, c.DO],
    template: [c.TARGET_CAUSE, 'busca provas que incrimine os parceiros de ', c.SOURCE_CAUSE],
  },
  isDirectional: true,
});

world.addRule({
  name:'descobrimentoPorAcidente',
  cause: {
    type: [bright(entity), c.ENCOUNTER, complex(connection)],
    template: [c.SOURCE_CAUSE, 'descobre', c.TARGET_CAUSE],
  },
  consequent: {
    type: [c.SOURCE_CAUSE, c.MOVE_IN, c.TARGET],
    template: [c.SOURCE_CAUSE, 'busca provas de', c.TARGET_CAUSE],
  },
  isDirectional: true,
});

world.addRule({
  name: 'move:daCasaParaJardim',
  cause: {
    type: [entity, c.MOVE_OUT,  casa],
    template: [c.SOURCE_CAUSE, 'sai de', casa],
  },
  consequent: {
    type: [c.SOURCE_CAUSE, c.MOVE_IN, jardim],
    template: [c.SOURCE_CAUSE, 'sai correndo para', jardim]
  },
  isDirectional: true,
});

world.addRule({
  name: 'move:doJardimParaCasa',
  cause: {
    type: [entity, c.MOVE_OUT, jardim ],
    template: [c.SOURCE_CAUSE, 'sai de', jardim],
  },
  consequent: {
    type: [c.SOURCE_CAUSE, c.MOVE_IN, casa],
    template: [c.SOURCE_CAUSE, 'entra de fininho em', casa]
  },
  isDirectional: true,
});

world.addRule({
  name:'previsao',
  cause: {
    type: [dark(entity), c.REST],
    template: [c.SOURCE_CAUSE, 'sabe que seus dias estão contados'],
  },
  locations: [casa],
  consequent: {},
  isDirectional: true,
});


world.addRule({
  name:'quietudeDaVida',
  cause: {
    type: [entity, c.MOVE_IN, complex(connection)],
    template: [c.SOURCE_CAUSE, 'permanece na quietude da vida'],
  },
  consequent: {},
});

world.addRule({
  name:'desaparecer',
  cause: {
    type: [jolting(entity), c.ENCOUNTER, outpouring(entity)],
    template: [c.SOURCE_CAUSE, 'glances', c.TARGET_CAUSE],
  },
  consequent: {
    type: [c.SOURCE_CAUSE, c.VANISH],
    template: [c.SOURCE_CAUSE, 'flickers away'],
  },
  isDirectional: true,
});

world.addRule({
  name:'sumir',
  cause: {
    type: [entity, c.VANISH],
    template: [c.SOURCE_CAUSE,'sumiu sem deixar rastros.'],
  },
  consequent: {},
  isDirectional: true,
});
*/

/* eslint-disable no-console */
world.runStory(2);
console.log("########################## OUTPUT ##########################");
console.log(world.output);
//const test = world.testMatches()
//console.log(test) 