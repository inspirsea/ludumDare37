import { Game } from './app/game';

(function(){
	var game = new Game();

	document.getElementById("restart").addEventListener("click", (event: MouseEvent) => {
		//document.getElementById("game").removeChild();

		var conatiner = document.getElementById("gameContainer");
			while (conatiner.firstChild) {
    		conatiner.removeChild(conatiner.firstChild);
			}

			game = null;
			game = new Game();
	});
})()
