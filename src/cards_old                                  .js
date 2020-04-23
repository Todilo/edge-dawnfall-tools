export const cards = [
  {
    id: 1,
    key: 1,
    img: "factions/chapter/cards/bash.png",
    cardCount: 4,
    upperAction: "MOVE",
    upperCost: "0",
    upperActionText: "with all models in 1 Chapter Squad.",
    lowerCost: "1",
    costType: "crystal",
    lowerAction: "BASH",
    lowerActionText:
      "Move, and then Push 1 enemy model (base_to_base) with this Knight to any Space adjacent to his original position.",
    squad: "HOLY_KNIGHT",
    count: 0,
    faction: "chapter"
  },
  {
    id: 2,
    key: 2,
    img: "factions/chapter/cards/charged_shot.png",
    cardCount: 2,
    upperAction: "DEFENSE",
    upperCost: "1",
    upperActionText:
      "1 model in this Squad gain +2 DEF for 1 roll. (1 use per roll)",
    lowerCost: "X",
    costType: "charge",
    lowerAction: "CHARGED SHOT",
    lowerActionText:
      "For each 2(charges) spent, add +1 Wound to each Hit of a single Purging action. (1 per Purging action)",
    squad: "PURGE_DOCTOR",
    count: 0,
    faction: "chapter"
  },
  {
    id: 3,
    key: 3,
    img: "factions/chapter/cards/energy_drain.png",
    cardCount: 4,
    upperAction: "CHARGING",
    upperCost: "1",
    upperActionText: "Charge all (b)your Enhancements by 1(charge).",
    lowerCost: "1",
    costType: "crystal",
    lowerAction: "ENERGY DRAIN",
    lowerActionText:
      "Collect 1(crystal)*** from each Controlled Crystal Source with a Pilgrim in (base_to_base)",
    squad: "PILGRIM",
    count: 0,
    faction: "chapter"
  },

  {
    id: 4,
    key: 4,
    img: "factions/chapter/cards/fake_death.png",
    cardCount: 2,
    upperAction: "WORTHLESS",
    upperCost: "1",
    upperActionText:
      "Use right after a model of this Squad is killed. The opponent earns 2 VP less for killing it. (1 use per payment)",
    lowerCost: "2",
    costType: "charge",
    lowerAction: "FAKE DEATH",
    lowerActionText:
      "Ignore 1 Wound just received by any Pilgrim. Does not allow to Counterattack. (1 use per turn)",
    squad: "PILGRIM",
    count: 0,
    faction: "chapter"
  },

  {
    id: 5,
    key: 5,
    img: "factions/chapter/cards/firing_position.png",
    cardCount: 2,
    upperAction: "DEFENSE",
    upperCost: "1",
    upperActionText:
      "1 model in this Squad gain +2 DEF for 1 roll. (1 user per roll)",
    lowerCost: "3",
    costType: "charge",
    lowerAction: "FIRING POSITION",
    lowerActionText:
      "Each Ranger in this Squad shoots twice during each Shoot action.",
    squad: "RANGER",
    count: 0,
    faction: "chapter"
  },

  {
    id: 6,
    key: 6,
    img: "factions/chapter/cards/formation.png",
    cardCount: 4,
    upperAction: "MOVE",
    upperCost: "0",
    upperActionText: "with all models in 1 Chapter Squad.",
    lowerCost: "1",
    costType: "crystal",
    lowerAction: "FORMATION",
    lowerActionText:
      "Target 1 Holy Knight. All other Holy Knights in play are teleported (base_to_base) with him (you may Push enemies). Then, any of these Holy Knights may perform Combat.",
    squad: "HOLY_KNIGHT",
    count: 0,
    faction: "chapter"
  },

  {
    id: 7,
    key: 7,
    img: "factions/chapter/cards/guard.png",
    cardCount: 2,
    upperAction: "SUCCESSFUL  DEFENSE",
    upperCost: "2",
    upperActionText:
      "A Chapter model gets an automatic successful DEF roll. (1 use per roll)",
    lowerCost: "1",
    costType: "charge",
    lowerAction: "GUARD",
    lowerActionText:
      "One of (b)your models (base_to_base) with this Holy Knight may use the Knight's DEF and Endurance tokens instead of its own. (1 use per payment)",
    squad: "HOLY_KNIGHT",
    count: 0,
    faction: "chapter"
  },

  {
    id: 8,
    key: 8,
    img: "factions/chapter/cards/guardian_angel.png",
    cardCount: 4,
    upperAction: "DEFENSE",
    upperCost: "1",
    upperActionText: "A Chapter model gain +2 to a DEF roll.",
    lowerCost: "0",
    costType: "crystal",
    lowerAction: "GUARDIAN ANGEL",
    lowerActionText:
      "Use when one of (b)your models within Range 3 of the Angel of Death is Wounded. The Angel suffers the WOunds instead.",
    squad: "ANGEL_OF_DEATH",
    count: 0,
    faction: "chapter"
  },

  {
    id: 9,
    key: 9,
    img: "factions/chapter/cards/judgement.png",
    cardCount: 2,
    upperAction: "COMBAT",
    upperCost: "1",
    upperActionText: "with all models in this Squad. (1 user per turn)",
    lowerCost: "3",
    costType: "charge",
    lowerAction: "JUDGEMENT",
    lowerActionText:
      "Kill 1 enemy model (base_to_base) with the Angel with no Endurance tokens on its Squad card. (1 user per Payement)",
    squad: "ANGEL_OF_DEATH",
    count: 0,
    faction: "chapter"
  },

  {
    id: 10,
    key: 10,
    img: "factions/chapter/cards/last_man_standing.png",
    cardCount: 2,
    upperAction: "REVENGE",
    upperCost: "1",
    upperActionText:
      "Use right after a model of this Squad is killed in Combat. It may perform a Backstab before you remove it from teh board map. (1 use per combat)",
    lowerCost: "3",
    costType: "charge",
    lowerAction: "LAST MAN STANDING",
    lowerActionText: "If there's only 1 Pilgrim left, he gains +3 DEF",
    squad: "PILGRIM",
    count: 0,
    faction: "chapter"
  },

  {
    id: 11,
    key: 11,
    img: "factions/chapter/cards/leap.png",
    cardCount: 5,
    upperAction: "DODGE",
    upperCost: "2",
    upperActionText:
      "Use after a Chapter model enters Combat. Reposition this model to any adjacent Space and cancel the Combat.",
    lowerCost: "1",
    costType: "crystal",
    lowerAction: "LEAP",
    lowerActionText:
      "Move (Range 4, through obstacles). Until end of turn this model automatically wins INI in any Combat.",
    squad: "HOLY_KNIGHT",
    count: 0,
    faction: "chapter"
  },

  {
    id: 12,
    key: 12,
    img: "factions/chapter/cards/overwatch.png",
    cardCount: 4,
    upperAction: "COMBAT",
    upperCost: "1",
    upperActionText: "with all models in this Squad. (1 use per turn)",
    lowerCost: "1",
    costType: "charge",
    lowerAction: "OVERWATCH",
    lowerActionText:
      "Perform 1 Backstab before 1 model of this Squad performs a Combat. (1 use per Combat)",
    squad: "ANY_SQUAD",
    count: 0,
    faction: "chapter"
  },

  {
    id: 13,
    key: 13,
    img: "factions/chapter/cards/power_of_technology.png",
    cardCount: 4,
    upperAction: "MOVE",
    upperCost: "0",
    upperActionText: "with all models in 1 Chapter Squad.",
    lowerCost: "0",
    costType: "crystal",
    lowerAction: "POWER OF TECHNOLOGY",
    lowerActionText:
      "Destroy 1 Chapter (crystal) to put 3(charge) on any 1 of (b)your Enhancements.",
    squad: "PURGE_DOCTOR",
    count: 0,
    faction: "chapter"
  },

  {
    id: 14,
    key: 14,
    img: "factions/chapter/cards/purging.png",
    cardCount: 4,
    upperAction: "CHARGING",
    upperCost: "1",
    upperActionText: "Charge all (b)your Enhancements by 1 (charge).",
    lowerCost: "2",
    costType: "crystal",
    lowerAction: "PURGING",
    lowerActionText:
      "Basic mode required. Choose 2 adjacent Spaces, both adjacent to 1 Purge Dcotor. Check all models within these SPaces for Hit. Effect: 1 Wound. Put 1 FIRE token on 1 of the affected models.",
    squad: "PURGE_DOCTOR",
    count: 0,
    faction: "chapter"
  },

  {
    id: 15,
    key: 15,
    img: "factions/chapter/cards/shield_wall.png",
    cardCount: 4,
    upperAction: "DEFENSE",
    upperCost: "1",
    upperActionText: "A Chapter model gain +2 to a DEF roll.",
    lowerCost: "0",
    costType: "crystal",
    lowerAction: "SHIELD WALL",
    lowerActionText:
      "Place a SHIELD WALL token on one group of (base_to_base) Holy Knights. Each of them gains +2 DEF for every other Holy Knight (base_to_base) with him. Holy Knights in this group cannot be Pushed. Remove the token when one of them is WOunded or moves.",
    squad: "HOLY_KNIGHT",
    count: 0,
    faction: "chapter"
  },

  {
    id: 16,
    key: 16,
    img: "factions/chapter/cards/shoot.png",
    cardCount: 8,
    upperAction: "DODGE",
    upperCost: "2",
    upperActionText:
      "Use after a Chapter model enters Combat. Reposition this model to any adjacent SPace and cancel the Combat.",
    lowerCost: "0",
    costType: "crystal",
    lowerAction: "SHOOT",
    lowerActionText:
      "with all Rangers in a Squad at any 1 target model each (Range unlimited, Line of Fire required). Check targets for Hit. If in Aim mode, add 2 to the roll. Effect: 1 Wound. Shoot may be used instead of a Backstab or an Attack roll.",
    squad: "RANGER",
    count: 0,
    faction: "chapter"
  },

  {
    id: 17,
    key: 17,
    img: "factions/chapter/cards/storm_of_blades.png",
    cardCount: 5,
    upperAction: "COMBAT",
    upperCost: "1",
    upperActionText: "with all models in 1 Chapter Squad.",
    lowerCost: "1",
    costType: "crystal",
    lowerAction: "STORM OF BLADES",
    lowerActionText: "Combat with each enemy (base_to_base) with the Angel.",
    squad: "ANGEL_OF_DEATH",
    count: 0,
    faction: "chapter"
  },

  {
    id: 18,
    key: 18,
    img: "factions/chapter/cards/tactic.png",
    cardCount: 4,
    upperAction: "COMBAT",
    upperCost: "1",
    upperActionText: "with all models in this Squad. (1 use per turn)",
    lowerCost: "1",
    costType: "charge",
    lowerAction: "TACTIC",
    lowerActionText:
      "Use after successful Defense of this Squad. Charge all (b)your Enhancements by 1 (charge). (1 use per turn)",
    squad: "ANY_SQUAD",
    count: 0,
    faction: "chapter"
  },

  {
    id: 19,
    key: 19,
    img: "factions/chapter/cards/trap.png",
    cardCount: 3,
    upperAction: "CHARGING",
    upperCost: "1",
    upperActionText: "Charge all (b)your Enhancements by 1 (charge)",
    lowerCost: "1",
    costType: "crystal",
    lowerAction: "TRAP",
    lowerActionText:
      "Attach a TRAP token to any enemy model. This model is Blocked until its controller pays 2(crystal) during one of their Active turn to remove the token.",
    squad: "ANY_SQUAD",
    count: 0,
    faction: "chapter"
  },

  {
    id: 20,
    key: 20,
    img: "factions/chapter/cards/winged_death.png",
    cardCount: 2,
    upperAction: "MOVE AND COMBAT",
    upperCost: "2",
    upperActionText: "with all models in this Squad. (1 use per turn)",
    lowerCost: "3",
    costType: "charge",
    lowerAction: "WINGED DEATH",
    lowerActionText:
      "Flight mode required. Move and then Backstab each enemy model (base_to_Base) with the Angel. (1 use per turn)",
    squad: "ANGEL_OF_DEATH",
    count: 0,
    faction: "chapter"
  }
];
export default cards;
