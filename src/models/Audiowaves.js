class Audiowaves {
	#freqArray = [];
	#analyser = null;

	// animation configs
	#radius = 150;
	#bars = 300;
	#barWidth = 2;
	#audioContext = null;
	#canvasContext = null;

	init(audioElement) {
		// set up audio context
		this.#audioContext = new (window.AudioContext ||
			window.webkitAudioContext)();

		// create analyser node and connect to audio source
		this.#analyser = this.#audioContext.createAnalyser();
		const source = this.#audioContext.createMediaElementSource(audioElement);
		source.connect(this.#analyser);
		this.#analyser.connect(this.#audioContext.destination);
		this.#analyser.fftSize = 2048 * 2 * 2;
		this.#freqArray = new Uint8Array(this.#analyser.frequencyBinCount);

		this.startAudioWaveformAnimation();
	}

	// draw one waveform bar
	// x1, y1 - coords where bar starts
	// x2, y2 - coords where bar ends
	#drawBar(x1, y1, x2, y2, width) {
		this.#canvasContext.strokeStyle = 'hsla(200, 100%, 30%, 0.5)';
		this.#canvasContext.lineWidth = width;
		this.#canvasContext.beginPath();
		this.#canvasContext.moveTo(x1, y1);
		this.#canvasContext.lineTo(x2, y2);
		this.#canvasContext.stroke();
	}

	startAudioWaveformAnimation = () => {
		const canvas = document.getElementById('audiowaves');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;
		this.#canvasContext = canvas.getContext('2d');

		this.#analyser.getByteFrequencyData(this.#freqArray);

		for (let i = 0; i < this.#bars; i++) {
			//divide a circle into equal parts
			const rads = (Math.PI * 2) / this.#bars;
			let barHeightCoeff = 2.5;
			if (window.innerWidth < 400) {
				barHeightCoeff = 1.5;
			}
			const barHeight = this.#freqArray[i] * barHeightCoeff;

			// set coordinates
			const x = centerX + Math.cos(rads * i) * this.#radius;
			const y = centerY + Math.sin(rads * i) * this.#radius;
			const xEnd = centerX + Math.cos(rads * i) * (this.#radius + barHeight);
			const yEnd = centerY + Math.sin(rads * i) * (this.#radius + barHeight);

			this.#drawBar(x, y, xEnd, yEnd, this.#barWidth);
		}
		window.requestAnimationFrame(this.startAudioWaveformAnimation);
	};
}

export default Audiowaves;
