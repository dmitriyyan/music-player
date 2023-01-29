import Player from './models/Player';
import audios from './const/audios';
import './style.css';

const player = new Player(audios);
player.init();
