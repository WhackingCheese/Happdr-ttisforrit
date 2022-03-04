var roll_button;
var roll_winners;
var left;
var dabs;
var nr;

var roll_n = 15;
var roll_nr = 0;

var roll_time = 0

var winnings = [];
var tickets = [];
var dubs = [];

function getRandomTicket() {
    var id = Math.floor(Math.random() * (tickets.length));
    return tickets[id];
}

function callback() {
    var ch = roll_winners.children;
    for(var i = 0; i < ch.length; i++) {
        var w = getRandomTicket();
        if(w === undefined) return Math.floor(Math.random() * 100)
        ch[i].children[0].innerHTML = w;
    }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function roll() {
    if (roll_nr >= winnings.length) return;
    var number = winnings[roll_nr].count;
    roll_nr += 1;
    var winners = generateWinners(number);
    roll_winners.innerHTML = "";
    for(var i = 0; i < number; i++) {
        let node = document.createElement("div");
        node.className = "winner";
        node.appendChild(document.createElement("p"));
        roll_winners.appendChild(node);
    }
    var interval = window.setInterval(callback, 50);
    roll_button.disabled = true;
    await delay(roll_time);
    roll_button.disabled = false;
    window.clearInterval(interval);
    for(var i = 0; i < roll_winners.children.length; i++) {
        roll_winners.children[i].children[0].innerHTML = winners[i];
        dubs.push(parseInt(winners[i]));
    }
    dubs.sort(function(a, b) { return a - b; });
    dabs.innerHTML = "";
    for (var i = 0; i < dubs.length; i++) {
        var n = dubs[i];
        var el = document.createElement('div');
        el.className = "doub";
        el.appendChild(document.createElement("p"));
        el.children[0].innerHTML = n;
        dabs.appendChild(el);
    }
    nr.innerHTML = (roll_n - roll_nr);
}

function main() {
    roll_button = document.getElementsByClassName('roll')[0];
    roll_button.addEventListener('click', function() { roll(); });
    roll_winners = document.getElementsByClassName('winners')[0];
    dabs = document.getElementsByClassName('dubs')[0];
    nr = document.getElementsByClassName('nr')[0];
    nr.innerHTML = (roll_n - roll_nr);
}

window.addEventListener('DOMContentLoaded', (e) => {
    main();
});

function generateWinners(number) {
    var id;
    var winner;
    var w = [];
    for(var i = 0; i < number; i++) {
        id = Math.floor(Math.random() * (tickets.length));
        winner = tickets.splice(id, 1)[0];
        console.log(winner);
        w.push(winner);
    }
    console.log(w);
    return w;
}

async function fetchWinnings() {
    const res = await fetch("./winnings.json");
    const winnings = await res.json();
    return winnings;
}

fetchWinnings().then(wngns => {
    winnings = wngns.winnings;
    roll_n = winnings.length;
});
