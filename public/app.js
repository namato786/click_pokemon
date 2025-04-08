const startButton = document.getElementById('start-btn');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const timerElement = document.getElementById('timer');
const pokemonsContainer = document.querySelector('.pokemons-container');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');

const pokeball = document.createElement('div');
pokeball.classList.add('pokeball');
document.body.appendChild(pokeball);

const pokemonImages = [
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png',
];

const legendaryImages = [
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png',
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png',
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png',
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png',
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/251.png',
];

let score = 0;
let gameInterval;
let spawnInterval = 1000;
let gameStarted = false;
let timeLeft = 0;
let timerInterval;
let level = 1;

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        score = 0;
        level = 1;
        spawnInterval = 1000;
        scoreElement.textContent = score;
        levelElement.textContent = level;
        timerElement.textContent = '--';
        startButton.textContent = 'Stop Game';
        pokemonsContainer.innerHTML = '';
        gameOverScreen.style.display = 'none';
        startGameInterval();
    } else {
        resetGame();
    }
}

function generateRandomPokemon() {
    if (pokemonsContainer.children.length > 10) {
        pokemonsContainer.removeChild(pokemonsContainer.children[0]);
    }

    const isLegendary = Math.random() < 0.1;
    const src = isLegendary
        ? legendaryImages[Math.floor(Math.random() * legendaryImages.length)]
        : pokemonImages[Math.floor(Math.random() * pokemonImages.length)];

    const pokemon = document.createElement('img');
    pokemon.src = src;
    pokemon.classList.add('pokemon');
    if (isLegendary) pokemon.classList.add('legendary');
    pokemon.addEventListener('click', catchPokemon);
    pokemonsContainer.appendChild(pokemon);
}

function catchPokemon(e) {
    const isLegendary = e.target.classList.contains('legendary');
    const points = isLegendary ? 5 : 1;

    const rect = e.target.getBoundingClientRect();
    pokeball.style.left = rect.left + 'px';
    pokeball.style.top = rect.top + 'px';
    pokeball.style.visibility = 'visible';
    pokeball.classList.add('catch-animation');

    setTimeout(() => {
        pokeball.style.visibility = 'hidden';
        pokeball.classList.remove('catch-animation');
    }, 500);

    e.target.remove();
    score += points;
    scoreElement.textContent = score;

    if (score >= level * 10) {
        level++;
        levelElement.textContent = level;
        spawnInterval = Math.max(300, spawnInterval - 100);
        clearInterval(gameInterval);
        startGameInterval();
    }

    if (score >= 10 && !timerInterval) {
        startTimerChallenge();
    }
}

function startTimerChallenge() {
    timeLeft = 10;
    timerElement.textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showGameOver();
        }
    }, 1000);
}

function showGameOver() {
    gameStarted = false;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    pokemonsContainer.innerHTML = '';
    finalScoreElement.textContent = score;
    startButton.textContent = 'Start Game';
    gameOverScreen.style.display = 'block';
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        score = 0;
        level = 1;
        spawnInterval = 1000;
        scoreElement.textContent = score;
        levelElement.textContent = level;
        timerElement.textContent = '--';
        startButton.textContent = 'Stop Game';
        pokemonsContainer.innerHTML = '';
        gameOverScreen.style.display = 'none';

        // 🆕 Generate 6 Pokémon at the start
        for (let i = 0; i < 6; i++) {
            generateRandomPokemon();
        }

        startGameInterval();
    } else {
        resetGame();
    }
}


function startGameInterval() {
    gameInterval = setInterval(generateRandomPokemon, spawnInterval);
}

startButton.addEventListener('click', startGame);
