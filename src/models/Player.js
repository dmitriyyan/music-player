import Audiowaves from './Audiowaves';

class Player {
	// audio info
	#imageForAudio = document.getElementById('image');
	#title = document.getElementById('title');
	#artist = document.getElementById('artist');
	#currentAudioTime = document.getElementById('current-time');
	#durationAudio = document.getElementById('duration');

	// audio controls
	#progressContainer = document.getElementById('progress-container');
	#progressBar = document.getElementById('progress');
	#prevBtn = document.getElementById('prev');
	#playBtn = document.getElementById('play');
	#nextBtn = document.getElementById('next');
	#isPlaying = false;
	#currAudioIdx = 0;

	// audio element
	#audioElement = null;
	#audiowaves = new Audiowaves();
	#audios = null;

	constructor(audios) {
		this.#audios = audios;
	}

	// play
	#playAudio() {
		this.#isPlaying = true;
		this.#playBtn.classList.replace('fa-play', 'fa-pause');
		this.#playBtn.setAttribute('title', 'Pause');
		this.#audioElement.play();
	}

	// pause
	#pauseAudio() {
		this.#isPlaying = false;
		this.#playBtn.classList.replace('fa-pause', 'fa-play');
		this.#playBtn.setAttribute('title', 'Play');
		this.#audioElement.pause();
	}

	#loadAudio(audio) {
		this.#title.textContent = audio.displayName;
		this.#artist.textContent = audio.artist;
		this.#audioElement.src = `assets/music/${audio.name}.mp3`;
		this.#imageForAudio.src = `assets/img/${audio.name}.jpg`;
	}

	#loadAndPlayCurrAudio() {
		if (!this.#audioElement) {
			this.#initAudioElement();
		}
		this.#loadAudio(this.#audios[this.#currAudioIdx]);
		this.#playAudio();
	}

	// next audio handler
	#nextAudioHandler = () => {
		// modulus of number of audios to play audio tracks in circle
		this.#currAudioIdx = (this.#currAudioIdx + 1) % this.#audios.length;
		this.#loadAndPlayCurrAudio();
	};

	// prev audio handler
	#prevAudioHandler = () => {
		// modulus of number of audios to play audio tracks in circle
		// js modulo returns negative result for negative number
		// to fix this: (i % n + n) % n
		// https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
		const nextAudioIdx = this.#currAudioIdx - 1;
		const total = this.#audios.length;
		this.#currAudioIdx = ((nextAudioIdx % total) + total) % total;
		this.#loadAndPlayCurrAudio();
	};

	// calc time to display in player and return formatted string
	#getTimeStr(time) {
		let timeMins = Math.floor(time / 60);
		let timeSecs = Math.floor(time % 60);
		timeMins = timeMins < 10 ? `0${timeMins}` : timeMins;
		timeSecs = timeSecs < 10 ? `0${timeSecs}` : timeSecs;

		// delay changing time for element content to avoid NaN
		// because it has not time while loading from server
		return timeSecs ? `${timeMins}:${timeSecs}` : '';
	}

	// update progress bar & cur audio time
	#updateProgressBar = (event) => {
		if (this.#isPlaying) {
			const { duration, currentTime } = event.srcElement;
			// update progress bar width
			const progressPercent = (currentTime / duration) * 100;
			this.#progressBar.style.width = `${progressPercent}%`;

			const durationStr = this.#getTimeStr(duration);
			this.#durationAudio.textContent = durationStr;

			const currTimeStr = this.#getTimeStr(currentTime);
			this.#currentAudioTime.textContent = currTimeStr;
		}
	};

	// set audio progress bar to jump over trak duration
	#setProgressBar = (event) => {
		if (
			event.target.id === 'progress-container' ||
			event.target.id === 'progress'
		) {
			const width = this.#progressContainer.clientWidth;
			const clickXPos = event.offsetX;
			const { duration } = this.#audioElement;

			const progressPercentToSet = (clickXPos / width) * duration;
			this.#audioElement.currentTime = progressPercentToSet;
			if (!this.#isPlaying) {
				this.#playAudio();
			}
		}
	};

	#initAudioElement() {
		this.#audioElement = new Audio();
		// progress bar event listener
		this.#audioElement.addEventListener('timeupdate', this.#updateProgressBar);
		this.#audioElement.addEventListener('ended', this.#nextAudioHandler);

		this.#audiowaves.init(this.#audioElement);
		this.#audiowaves.startAudioWaveformAnimation();
		this.#loadAudio(this.#audios[this.#currAudioIdx]);
	}

	#handePlayOrPause = () => {
		if (!this.#audioElement) {
			this.#initAudioElement();
		}
		this.#isPlaying ? this.#pauseAudio() : this.#playAudio();
	};

	init() {
		// play or pause event listener
		this.#playBtn.addEventListener('click', this.#handePlayOrPause);

		// player controls event listeners
		this.#nextBtn.addEventListener('click', this.#nextAudioHandler);
		this.#prevBtn.addEventListener('click', this.#prevAudioHandler);

		this.#progressContainer.addEventListener('click', this.#setProgressBar);

		document.body.onkeyup = (event) => {
			if (event.keyCode == 32) {
				this.#handePlayOrPause();
			}
		};
	}
}

export default Player;
