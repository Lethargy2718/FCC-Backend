// Stats
let xp = 0;
let health = 100;
let gold = 0;
let currentWeapon = 0;
let monsterHealth;
let stunned = 0;
let inventory = ["stick"];

// Helper variables
let nextIndex = 1;
let fighting = 0;

// DOM elements
let button1 = document.querySelector("#button1");
let button2 = document.querySelector("#button2");
let button3 = document.querySelector("#button3");
let text = document.querySelector("#text");
let xpText = document.querySelector("#xpText");
let healthText = document.querySelector("#healthText");
let goldText = document.querySelector("#goldText");
let monsterStats = document.querySelector("#monsterStats");
let monsterNameText = document.querySelector("#monsterName");
let monsterHealthText = document.querySelector("#monsterHealth");
let game = document.querySelector("#game");

// Initializing some data
const weapons = [
  {
    name: "stick", power: 5
  },
  
  {
    name: "dagger", power: 10
  },

  {
    name: "claw hammer", power: 20
  },

  {
    name: "excalibur", power: 50
  }
  
]
const locations = [ 
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"store\"."
  },
  
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "placeholder", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the shop. The shopkeeper smiles at you."
  },
  
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters."
  },

  {
    name: "fight",
    "button text": ["Attack", "Bash", "Run"],
    "button functions": [attack, bash, goTown],
    text: "En garde!"
  },  

  {
    name: "win",
    "button text": ["Restart", "Show inventory", "Quit"],
    "button functions": [restart, showInv, quit],
    text: "You defeated the dragon and won the game!"
  },

  {
    name: "lose",
      "button text": ["Restart", "Show inventory", "Quit"],
      "button functions": [restart, showInv, quit],
      text: "You failed to defeat the dragon and the town starved to death."
  }
]
const monsters = [
  {
    name: "Slime",
    level: 3,
    health: 30
  },

  {
    name: "Fanged Beast",
    level: 10,
    health: 100
  },

  {
    name: "Dragon",
    level: 30,
    health: 300
  }
]

// Initializing buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// Setting stat UI
xpText.innerText = xp;
healthText.innerText = health;
goldText.innerText = gold;

// Going actions
function update(location) {
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];

  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];

  text.innerText = location.text
}

function goStore() {
  update(locations[1]);
  if (nextIndex == weapons.length) {
    button2.innerText = "Sell " + inventory[0] + " (" + (15 * (nextIndex - inventory.length + 1)) + " gold)";
    button2.onclick = sellWeapon;
    return
  }
  button2.innerText = "Buy " + weapons[nextIndex].name + " (" + weapons[nextIndex].power * 1.5 + " gold)";}

function goTown() {
  update(locations[0]);
  monsterStats.style.display = 'none';
}

function goCave() {
  update(locations[2]);
}

// Store logic
function buyHealth() {
  // Checking if the player has enough gold.
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    
    goldText.innerText = gold;
    healthText.innerText = health;
    text.innerText = "Bought 10 health.";
    return;
  } 
    
  text.innerText = "Not enough gold.";
  
}

function buyWeapon() {
  let weapon = weapons[nextIndex];
  let price = weapon.power * 1.5;

  // Checking if the player has enough gold.
  if (gold >= price)
  {
    // Spending gold
    gold -= price;
    goldText.innerText = gold;

    // Adding the weapon to the inventory and setting the index for the next weapon
    // to buy.
    inventory.push(weapon.name);
    nextIndex++;
    currentWeapon = nextIndex - 1;
      
    text.innerText = "You obtained " + weapon.name + " of power " + weapon.power + ". In your inventory you have: " + inventory + ".";

    // Bought excalibur. Start selling. Starting here, buyWeapon() is obsolete
    // and sellWeapon() is going to be used instead. Selling logic is explained at
    // sellWeapon()
    if (nextIndex == weapons.length) {
      button2.innerText = "Sell " + inventory[0] + " (" + (15 * (nextIndex - inventory.length + 1)) + " gold)";
      button2.onclick = sellWeapon;
    } 
    else {
      button2.innerText = "Buy " + weapons[nextIndex].name + " (" + weapons[nextIndex].power * 1.5 + " gold)";
    } 
  }
  // Quit if the player doesn't have enough gold.
  else {
    text.innerText = "Not enough gold.";
  }  
}

function sellWeapon() {
  // If the only weapon is excalibur, quit the function.
  if (inventory.length == 1) {
    text.innerText = "You cannot sell excalibur.";
    return;
  }

  // Increase the players gold
  gold += 15 * (nextIndex - inventory.length + 1);
  // Place the weakest weapon in your inventory in a variable after/
  // removing it from your invetory.
  let sold = inventory.shift();
  // Example: "You sold dagger. Your inventory now has claw hammer,excalibur."
  text.innerText = "You sold " + sold + ". Your inventory now has: " + inventory + ".";
  // Sets the next weapon's selling button.
  // Example: "Sell claw hammer (30 gold)"
  // The equation is set so that the more weapons you sell, the higher their selling
  // price gets.
  button2.innerText = "Sell " + inventory[0] + " (" + (15 * (nextIndex - inventory.length + 1)) + " gold)";
  
}

// Fighting
function fightSlime() {
  fighting = 0;
  goFight()
}

function fightBeast() {
  fighting = 1;
  goFight()
}

function fightDragon() {
  fighting = 2;
  goFight()
}

function goFight() {
  // Prepares the fighting screen.
  update(locations[3]);
  monsterStats.style.display = 'block';
  var monster = monsters[fighting];
  monsterHealth = monster.health;
  monsterNameText.innerText = monster.name;
  monsterHealthText.innerText = monsterHealth;
}


function attack() {
  // Declare wasStunned for the extra stunning message and clear the text.
  var wasStunned = false;
  text.innerText = "";
  // If the enemy is stunned, it won't attack.
  if (stunned > 0) {
    text.innerText += "The monster can't attack because it's stunned!";
    stunned -= 1
    wasStunned = true;
  }
  else {
    var lostHP = damagePlayer()
    // Player died
    if (health == 0) {
      text.innerText = ' The ' + monsters[fighting].name + " attacks! You lost " + lostHP + " hitpoints and died.";
      playerDie();
      return;
    }
    else {
      text.innerText = "The " + monsters[fighting].name + " attacks! You lost " + lostHP + " hitpoints.";
    }
  }
    
  // This code block runs when you don't die, doesn't matter whether the
  // enemy is stunned or not.
  // The damage you deal is the weapon's power plus a random portion of
  // your xp. If the monster's health is less than 0, it's set to 0.
  var damage = weapons[currentWeapon].power + Math.floor((Math.random() * xp)) + 1;
  monsterHealth = Math.max(0, monsterHealth - damage);
  monsterHealthText.innerText = monsterHealth;

  text.innerText += "You attack it with your " + weapons[currentWeapon].name + ". You deal " + damage + " damage.";
  
  if (monsterHealth == 0) {
    text.innerText += " The monster is dead!";
    monsterDie(text.innerText);
  }
  else if (wasStunned) {
    text.innerText += "The enemy will be stunned for " + stunned + " more turns."
  }
}

function bash() {
  var rand = Math.random();
  if (rand >= 0.66) {
    stunned += 2;
    text.innerText = "You stunned the enemy! The enemy is stunned for " + stunned + " turns."
  }
  else {
    var lostHP = damagePlayer();  
    text.innerText = "You failed to stun the enemy! You lost " + lostHP + "HP"
    // Player died
    if (health == 0) {
      text.innerText += " and died.";
      playerDie();
    }
    else {
      text.innerText += ".";
    }   
  } 
}

function damagePlayer() {
  // Monsters deal damage that's between their level and their level * 3
  var level = monsters[fighting].level
  var lostHP = Math.floor(Math.random() * (level * 3 - level)) + level;
  // If health < 0, set it to 0.
  health = Math.max(0, health - lostHP);
  healthText.innerText = health;
  return lostHP;
}

// Player death (obviously)
function playerDie() {
  update(locations[5])
}

function monsterDie(oldText) {
  // Gold won is the monster's level multiplied by 6.7, while the XP won are the
  // monster's level.
  if (fighting == 2) {
    update(locations[4]);
    return
  }
  goldWon = Math.floor(monsters[fighting].level * 6.7);
  xpWon = monsters[fighting].level;

  gold += goldWon;
  xp += xpWon

  goldText.innerText = gold;
  xpText.innerText = xp;

  // "Sends" you to the cave again.
  update(locations[2]);
  // The text is updated to be the cave's text after calling the update() function,
  // so I save the old text to put it back here.
  text.innerText = oldText + "You gained " + xpWon + " XP and " + goldWon + " gold.";
}

// Post-game
function restart() {
  xp = 0;
  health = 100;
  gold = 0;
  currentWeapon = 0;
  monsterHealth;
  stunned = 0;
  inventory = ["stick"];
  nextIndex = 1;
  fighting = 0;
  update(locations[0]);
  xpText.innerText = xp;
  healthText.innerText = health;
  goldText.innerText = gold;
  monsterStats.style.display = "none";
}

function showInv() {
  text.innerText = inventory;
}

function quit() {
  game.style.display = "none";
}
