console.log('hello');
let xp = 1000000;
let money = 100;
let unlockCount = 0;
let pieces = [];
let ucm = 1; //stands for universal cash multiplier
let uspm = 1; //stands for universal speed multiplier

function addXP(amount){
	xp += amount;
}

function addMoney(amount, multiplier){
	newAmount = amount*multiplier;
	console.log(ucm);
	console.log(newAmount);
	money += newAmount;
}

function checkPieces(){
	for (let p of pieces){
		if (p.locked && unlockCount >= p.requirements) p.unlock();
	}
}

class PowerupMoney{
	constructor(name, label, costDisplay, cost, buyBtn, duration, multiplier){
		this.name = name;
		this.label = document.getElementById(label);
		this.costDisplay = document.getElementById(costDisplay);
		this.cost = cost;
		this.buyBtn = document.getElementById(buyBtn);
		this.duration = duration;
		this.multiplier = multiplier;
		this.active = false;
		this.buyBtn.addEventListener('click', () => {if (money >= this.cost) this.buy()});
		console.log('itteeeemmm constructed')
	}
	
	buy(){
		console.log('buying')
		money -= this.cost;
		document.getElementById('money').textContent = 'Money: ' + money;
		this.activate();
	}
	
	activate(){
		if (this.active) return;
		this.active = true;
		console.log('activating')
		ucm *= this.multiplier;
		let timeLeft = this.duration;
		this.buyBtn.textContent = timeLeft + 's';
		let timer = setInterval(() => {
			timeLeft --;
			this.buyBtn.textContent = timeLeft + 's';
			if (timeLeft <= 0) {
					console.log(ucm)
					clearInterval(timer);
					ucm /= this.multiplier;
					this.buyBtn.textContent = 'Buy'
					this.active = false;
			}
		}, 1000);
	}
}

class PowerupTime{
	constructor(name, label, costDisplay, cost, buyBtn, duration, multiplier){
		this.name = name;
		this.label = document.getElementById(label);
		this.costDisplay = document.getElementById(costDisplay);
		this.cost = cost;
		this.buyBtn = document.getElementById(buyBtn);
		this.duration = duration;
		this.multiplier = multiplier;
		this.active = false;
		this.buyBtn.addEventListener('click', () => {if (money >= this.cost) this.buy()});
		console.log('itteeeemmm constructed')
	}
	
	buy(){
		console.log('buying')
		money -= this.cost;
		document.getElementById('money').textContent = 'Money: ' + money;
		this.activate();
	}
	
	activate(){
		if (this.active) return;
		this.active = true;
		console.log('activating')
		uspm *= this.multiplier;
		let timeLeft = this.duration;
		this.buyBtn.textContent = timeLeft + 's';
		let timer = setInterval(() => {
			timeLeft --;
			this.buyBtn.textContent = timeLeft + 's';
			if (timeLeft <= 0) {
					console.log(uspm)
					clearInterval(timer);
					uspm /= this.multiplier;
					this.buyBtn.textContent = 'Buy'
					this.active = false;
			}
		}, 1000);
	}
}

class Repertoire{
	constructor(name, lvl, label, playBtn, upgradeBtn, multiplier, length, requirements, cost){
		this.name = document.getElementById(name);
		this.lvl = document.getElementById(lvl);
		this.label = document.getElementById(label);
		this.playBtn = document.getElementById(playBtn);
		this.upgradeBtn = document.getElementById(upgradeBtn);
		this.multiplier = multiplier;
		this.length = length;
		this.requirements = requirements;
		this.level = 1;
		this.maxLvl = 10; 
		this.cost = cost;
		this.costCalc = this.cost*((this.level)**2)*(3**2)+7;
		this.upgradeBtn.textContent = '(' + this.costCalc + ')';
		this.playBtn.addEventListener('click', () => {this.play()});
		this.upgradeBtn.addEventListener('click', () => {if (xp >= this.costCalc && this.level < this.maxLvl) this.upgrade()});
		   this.locked = true;
		   this.name.style.display = 'none';
	}
	
	unlock(){
		   this.locked = false;
		this.name.style.display = 'table-row';
	}
	
	play(){
		if (this.playing) return;
		this.playing = true;
		let remainder = this.length;
		const timer = setInterval(() => {
			this.playBtn.textContent = remainder + 's';
			remainder --;
			if (remainder < 0){
				clearInterval(timer);
				this.playBtn.textContent = 'play';
				this.playing = false;
			}
		}, 1000 * uspm);
		console.log('-----HERRREEEEE-----')
		addMoney((this.multiplier*this.level), ucm);
		console.log(this.multiplier*this.level);
		document.getElementById('money').textContent = 'Money: ' + money;
	}
	
	upgrade(){
		xp -= this.costCalc;
		this.level ++;
		this.lvl.textContent = "Lvl: " + this.level;
		this.costCalc = this.cost*((this.level)**2)*(3**2)+7;
		document.getElementById('xp').textContent = 'XP: ' + xp;
		this.upgradeBtn.textContent = '(' + this.costCalc + ')';
	}
}

class Ability{
	constructor(name, lvl, label, button, multiplier, bar){
 		this.name = document.getElementById(name);
 		this.lvl = document.getElementById(lvl);
 		this.label = document.getElementById(label);
		this.button = document.getElementById(button);
		this.hidden = true;
		this.name.style.display = 'none';
  		this.speed = multiplier*1000;
  		this.multiplier = multiplier;
  		this.interval = setInterval(() => this.tick(), this.speed);
  		this.level = 1;
  		this.workingLabel = label;
  		this.stage = 0;
  		this.stages = ['beginner', 'intermediate', 'advanced', 'expert', 'master'];
  		this.maxLvl = 15*(this.stage + 1);
  		this.label.textContent = this.stages[this.stage] + ' ' + this.workingLabel;
  		this.points = 1 * this.multiplier * (this.stage + 1) * this.level;
  		this.cost = (this.level**2)*((this.stage+1)**2)*this.multiplier*3**2;
 		this.button.textContent = '(' + this.cost + ')';
  		this.button.addEventListener('click', () => {if (xp >= this.cost) {
  			xp -= this.cost;
  			this.upgrade();
  			document.getElementById('xp').textContent = 'XP: ' + xp
  		}});
		this.bar = document.getElementById(bar);
		this.progress = 0;
		this.tickRate = 100;
		this.start();
  }

	start() {
		if (this.interval) clearInterval(this.interval);
		const step = (this.tickRate / this.speed) * 100;
		this.interval = setInterval(() => {
	  	this.progress += step;
	  	if (this.progress >= 100) {
			this.progress = 0;
			this.tick();
	  		}
	  	this.bar.style.width = this.progress + "%";
		}, this.tickRate);
  	}
	
 	tick() {
  		if (this.hidden) return;
  		addXP(this.points);
  		document.getElementById('xp').textContent = 'XP: ' + xp;
 	}
 
 	evolve() {
  		this.stage ++;
  		this.update();
  		if (this.stage >=1 && this.next.hidden){
	  		this.next.hidden = false;
	  		this.next.name.style.display = 'table-row';
	  		unlockCount++;
	  		checkPieces();
  		}
 	}
 
 	upgrade() {
  		if (this.level < this.maxLvl){
  			clearInterval(this.interval);
  			this.speed *= 0.9;
  			this.interval = setInterval(() => this.tick(), this.speed);
  			this.level++;
  			this.lvl.textContent = "Lvl. " + this.level;
  			this.points = 1 * this.multiplier * (this.stage + 1) * this.level;
  			this.cost = (this.level**2)*((this.stage+1)**2)*this.multiplier*3**2;
  			this.button.textContent = '(' + this.cost + ')';
  			this.start();
  		}
  		else {
   			this.evolve();
  		}
 	}
 
 	update() {
  		this.label.textContent = this.stages[this.stage] + ' ' + this.workingLabel;
  		this.level = 1;
  		this.lvl.textContent = "Lvl. " + this.level;
  		clearInterval(this.interval);
  		this.speed *= 1.5;
  		this.interval = setInterval(() => this.tick(), this.speed);
  		this.maxLvl = 15*(this.stage + 1);
  		this.points = 1 * this.multiplier * (this.stage + 1) * this.level;
  		this.cost = (this.level**2)*((this.stage+1)**2)*this.multiplier*3**2;
  		this.button.textContent = '(' + this.cost + ')';
  		this.start();
 	}
}

let test = new Ability('test', 'aLvl', 'aLabel', 'aBtn', 1, "aFill");
console.log('problemless execution');
//bow technique
let a = new Ability('ability1', 'a1', 'detache', 'a4', 1, 'aBar'); //detache
let b = new Ability('ability2', 'b1', 'staccato', 'b4', 2, 'bBar'); //staccato
let c = new Ability('ability3', 'c1', 'legato', 'c4', 3, 'cBar'); //legato
let d = new Ability('ability4', 'd1', 'martele', 'd4', 5, 'dBar'); //martele
let e = new Ability('ability5', 'e1', 'spiccato', 'e4', 8, 'eBar'); //spiccato
let f = new Ability('ability6', 'f1', 'ricochet', 'f4', 13, 'fBar'); //ricochet
//left hand
let g = new Ability('ability11', 'g1', 'g2', 'g4', 2, 'gBar'); //major scales
let h = new Ability('ability12', 'h1', 'h2', 'h4', 4, 'hBar'); //melodic minor scales
let i = new Ability('ability13', 'i1', 'i2', 'i4', 8, 'iBar'); //harmonic minor scales
let j = new Ability('ability14', 'j1', 'j2', 'j4', 16, 'jBar'); //modal scales
let k = new Ability('ability15', 'k1', 'k2', 'k4', 32, 'kBar'); //alternate scale systems

a.hidden = false;
a.name.style.display = 'table-row';
console.log('a value =' + a.hidden);
//right hand
a.next = b;
b.next = c;
c.next = d;
d.next = e;
e.next = f;
f.next = null;

g.hidden = false;
g.name.style.display = 'table-row';
//left hand
g.next = h;
h.next = i;
i.next = j;
j.next = k;
k.next = null;

ar = new Repertoire('rep1', 'ar1', 'ar2', 'arPBtn', 'arUBtn', 1, 21, 1, 100); //twinkle-twinkle
br = new Repertoire('rep2', 'br1', 'br2', 'brPBtn', 'brUBtn', 2, 34, 2, 200); 
cr = new Repertoire('rep3', 'cr1', 'cr2', 'crPBtn', 'crUBtn', 3, 55, 3, 300);
dr = new Repertoire('rep4', 'dr1', 'dr2', 'drPBtn', 'drUBtn', 5, 89, 3, 400);
er = new Repertoire('rep5', 'er1', 'er2', 'erPBtn', 'erUBtn', 15, 144, 5, 800); //dragonetti
fr = new Repertoire('rep6', 'fr1', 'fr2', 'frPBtn', 'frUBtn', 31, 365, 6, 1200); //vanhal
er = new Repertoire('rep7', 'gr1', 'gr2', 'grPBtn', 'grUBtn', 40, 420, 6, 1600); //bottesini

pieces.push(ar);
pieces.push(br);
pieces.push(cr);
pieces.push(dr);
pieces.push(er);

ia = new PowerupMoney('ia', 'itemA', 'itemACost', 20, 'itemABuy', 20, 5); //rosin
ib = new PowerupTime('ib', 'itemB', 'itemBCost', 20, 'itemBBuy', 20, 0.5); //metronome

function showMenu(id) {
	document.getElementById('basic').style.display = 'none';
	document.getElementById('repertoire').style.display = 'none';
	document.getElementById('shop').style.display = 'none';
	document.getElementById(id).style.display = 'block';
}
document.getElementById('menu1').addEventListener('click', () => {
	showMenu('basic');
})
document.getElementById('menu2').addEventListener('click', () => {
	showMenu('repertoire');
})
document.getElementById('shopBtn').addEventListener('click', () => {
	showMenu('shop');
})
showMenu('basic');
