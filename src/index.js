const { writeFile } = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(text) {
  return new Promise((resolve) => {
    rl.question(text, (input) => resolve(input));
  });
}

const mario = {
  NAME: "Mario",
  SPEED: 4,
  MANEUVERABILITY: 3,
  POWER: 3,
  POINTS: 0,
};

const luigi = {
  NAME: "Luigi",
  SPEED: 3,
  MANEUVERABILITY: 4,
  POWER: 4,
  POINTS: 0,
};

const bowser = {
  NAME: "Bowser",
  SPEED: 5,
  MANEUVERABILITY: 2,
  POWER: 5,
  POINTS: 0,
};

const peach = {
  NAME: "Peach",
  SPEED: 3,
  MANEUVERABILITY: 4,
  POWER: 2,
  POINTS: 0,
};

const yoshi = {
  NAME: "Yoshi",
  SPEED: 2,
  MANEUVERABILITY: 4,
  POWER: 3,
  POINTS: 0,
};

const dk = {
  NAME: "Donkey Kong",
  SPEED: 2,
  MANEUVERABILITY: 2,
  POWER: 5,
  POINTS: 0,
};

async function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

async function throwThings() {
  return Math.random();
}

async function getRandomBlock() {
  let random = Math.random();
  let result;

  switch (true) {
    case random < 0.33:
      result = 'STRAIGHT'
      break;
    case random < 0.66:
      result = 'TURN'
      break;
    default:
      result = 'CONFRONTATION';
  }

  return result;
} 

async function logRollResult(characterName, block, diceResult, attribute) {
  console.log(
    `${characterName} 🎲 roll dice to ${block} with ${diceResult} + ${attribute} = ${
      diceResult + attribute
    }`
  );
}

async function declareWinner(character1, character2) {
  console.log("Final result: ");
  console.log(`${character1.NAME}: ${character1.POINTS} point(s).`)
  console.log(`${character2.NAME}: ${character2.POINTS} point(s).`)

  if (character1.POINTS > character2.POINTS) {
    console.log(`\n${character1.NAME} won the race! Congrats! 🏆🏅`)
  } else if (character2.POINTS > character1.POINTS) {
    console.log(`\n${character2.NAME} won the race! Congrats! 🏆🏅`)
  } else {
    console.log("The race ended in a draw!")
  }
}

function handleTurtleShell(character1, character2, winner) {
  if (winner == character1) {
    console.log(`${character1.NAME} won the confront! ${character1.NAME} throw a turtle shell, ${character2.NAME} lost 1 point 🐢`);
    console.log(`${character1.NAME} receive a turbo 🔥 +1 point.`);
    character2.POINTS--;
    character1.POINTS++;
  } else if (winner == character2) {
    console.log(`${character2.NAME} won the confront! ${character2.NAME} throw a turtle shell, ${character1.NAME} lost 1 point 🐢`);
    console.log(`${character2.NAME} receive a turbo 🔥 +1 point.`);
    character1.POINTS--;
    character2.POINTS++;
  }
}

function handleBomb(character1, character2, winner) {
  if (winner == character1) {
    console.log(`${character1.NAME} won the confront! ${character1.NAME} throw a bomb, ${character2.NAME} lost 2 points 💣`);
    console.log(`${character1.NAME} receive a turbo 🔥 +1 point.`);
    character2.POINTS -= 2;
    character1.POINTS++;
  } else if (winner == character2) {
    console.log(`${character2.NAME} won the confront! ${character2.NAME} throw a bomb, ${character1.NAME} lost 2 points 💣`);
    console.log(`${character2.NAME} receive a turbo 🔥 +1 point.`);
    character1.POINTS -= 2;
    character2.POINTS++;
  }
}

async function playRaceEngine(character1, character2) {
  for( let round = 1; round <= 5; round++) {
    console.log(`🏁 Round ${round}`);

    //draw the block
    let block = await getRandomBlock();
    console.log(`Block: ${block}`)

    //draw the dice
    let diceResult1 = await rollDice()
    let diceResult2 = await rollDice()

    //skill test
    let totalSkillTest1 = 0;
    let totalSkillTest2 = 0;

    if(block === 'STRAIGHT') {
      totalSkillTest1 = diceResult1 + character1.SPEED;
      totalSkillTest2 = diceResult2 + character2.SPEED;

      await logRollResult(
        character1.NAME,
        "speed",
        diceResult1,
        character1.SPEED
      );

      await logRollResult(
        character2.NAME,
        "speed",
        diceResult2,
        character2.SPEED
      )
    }

    if(block === 'TURN') {
      totalSkillTest1 = diceResult1 + character1.MANEUVERABILITY;
      totalSkillTest2 = diceResult2 + character2.MANEUVERABILITY;

      await logRollResult(
        character1.NAME,
        "Maneuverability",
        diceResult1,
        character1.MANEUVERABILITY
      );

      await logRollResult(
        character2.NAME,
        "Maneuverability",
        diceResult2,
        character2.MANEUVERABILITY
      )
    }

    if(block === 'CONFRONTATION') {
      let powerResult1 = diceResult1 + character1.POWER;
      let powerResult2 = diceResult2 + character2.POWER;


      console.log(`${character1.NAME} clashed with ${character2.NAME}! 🥊`);

      await logRollResult(
        character1.NAME,
        "power",
        diceResult1,
        character1.POWER
      );

      await logRollResult(
        character2.NAME,
        "power",
        diceResult2,
        character2.POWER
      )

      if (powerResult1 > powerResult2 && character2.POINTS > 0) {
        const bombOrTurtleShell = await throwThings()
        bombOrTurtleShell <= 0.5 ? handleTurtleShell(character1, character2, character1) : handleBomb(character1, character2, character1);
      }

      if (powerResult2 > powerResult1 && character1.POINTS > 0) {
        const bombOrTurtleShell = await throwThings()
        bombOrTurtleShell > 0.5 ? handleTurtleShell(character1, character2, character2) : handleBomb(character1, character2, character2)
      }

      console.log(
        powerResult2 === powerResult1
          ? "Drawn match! No points were lost"
          : ""
      );
    }

    //check the block winner
    if (totalSkillTest1 > totalSkillTest2) {
      console.log(`${character1.NAME} scored a point.`);
      character1.POINTS++;
    } else if (totalSkillTest2 > totalSkillTest1) {
      console.log(`${character2.NAME} scored a point.`);
      character2.POINTS++;
    }

    console.log("-------------------------------------")
  }
}

(async function main() {
  console.log(`The game will start 🎮`)

  console.log("Choice player 1: ")
  let choice1 = await question("Type 1-Mario, 2-Luigi, 3-Peach, 4-Yoshi, 5-Donkey Kong 6-Bowser: ")
  choice1 = parseInt(choice1)
  while (isNaN(choice1) || choice1 < 1 || choice1 > 6) {
    choice1 = parseInt(await question("Type a number between 1 - 6: "));
  }

  console.log("Choice player 2: ")
  let choice2 = await question("Type 1-Mario, 2-Luigi, 3-Peach, 4-Yoshi, 5-Donkey Kong 6-Bowser: ")
  choice2 = parseInt(choice2)
  while (isNaN(choice2) || choice2 < 1 || choice2 > 6) {
    choice2 = parseInt(await question("Type a number between 1 - 6: "));
  }

  switch (true) {
    case choice1 == 1:
      player1 = mario;
      break;
    case choice1 == 2:
      player1 = luigi;
      break;
    case choice1 == 3:
      player1 = peach;
      break;
    case choice1 == 4:
      player1 = yoshi;
      break;
    case choice1 == 5:
      player1 = dk;
      break;
    default:
      player1 = bowser;
  }

  switch (true) {
    case choice2 == 1:
      player2 = mario;
      break;
    case choice2 == 2:
      player2 = luigi;
      break;
    case choice2 == 3:
      player2 = peach;
      break;
    case choice2 == 4:
      player2 = yoshi;
      break;
    case choice2 == 5:
      player2 = dk;
      break;
    default:
      player2 = bowser;
  }

  console.log(
    `🏁🚨 Race between ${player1.NAME} and ${player2.NAME} starting...\n`
  );

  await playRaceEngine(player1, player2);
  await declareWinner(player1, player2);

  rl.close();
})()