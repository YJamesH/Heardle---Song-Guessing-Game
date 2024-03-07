import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import fetchFromSpotify, { request } from "../../services/api";
import { max } from 'rxjs';

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})

export class GameComponent implements OnInit {
  constructor(private router: Router) {
  }

  // html audio element
  audio: HTMLAudioElement | null = null;

  // Maximum allowed duration for audio playback in seconds
  maxPlaybackDuration: number = 1;

  // variables to hold tracks for game-song-lookup
  playlistTracks: any[] = [];
  selectedSong: string = '';
  previewUrl: string = '';

  correctAnswer: string = '';
  gameGuesses: string[] = ['Guess #1', 'Guess #2', 'Guess #3', 'Guess #4', 'Guess #5', 'Guess #6'];
  currentGuess: number = 0;
  playerName: string = '';
  playlistName: string = '';

  ngOnInit() {
    this.populatePlaylistTracks();
    this.setupSongPlayer();

    const storedLeaderboardData = localStorage.getItem('LEADERBOARD');
    if (storedLeaderboardData) {
      const leaderboardData = JSON.parse(storedLeaderboardData);
      console.log('updated leaderboard', leaderboardData)
    }
  }

  // populates playlistTracks with all playable tracks
  populatePlaylistTracks() {
    interface GameData {
      playlistName: string;
      id: string;
      name: string;
      preview_url: string | null;
    }

    const storedGameData = localStorage.getItem('CUR_TRACKS');
    if (storedGameData) {
      this.playlistName = JSON.parse(storedGameData).name
      const gameData = JSON.parse(storedGameData) as GameData[];
      this.playlistName = gameData[0].playlistName;

      const filteredGameData: GameData[] = gameData.filter(obj => obj.preview_url !== null);
      // set playlist to select songs from
      this.playlistTracks = filteredGameData
        .map(obj => obj.name)
        .sort((a, b) => a.localeCompare(b));

      // set a random song for player and correct answer
      const randomSong = filteredGameData[Math.floor(Math.random() * filteredGameData.length)];
      this.correctAnswer = randomSong.name;
      if (randomSong.preview_url !== null) {
        this.previewUrl = randomSong.preview_url;
      } else {
        console.error('preview is null');
      }
    } else {
      console.error('No track found');
    }

  }

  checkGuess() {
    // if no guess do nothing
    if (this.selectedSong === '') {
      return;
    }

    // add song to guesses box
    this.gameGuesses[this.currentGuess] = this.selectedSong;

    // if correct guess or 6 incorrect guesses, 
    if (this.selectedSong === this.correctAnswer) {
      this.showWinPopup();
    } else {
      // increase max playback for user
      if (this.currentGuess === 0) {
        this.maxPlaybackDuration = 2;
      } else if (this.currentGuess === 1) {
        this.maxPlaybackDuration = 4;
      } else if (this.currentGuess === 2) {
        this.maxPlaybackDuration = 8;
      } else if (this.currentGuess === 3) {
        this.maxPlaybackDuration = 16;
      } else if (this.currentGuess === 4) {
        this.maxPlaybackDuration = 30;
      } else if (this.currentGuess === 5) {
        this.currentGuess = -2
        this.showLosePopup();
      }
    }
    this.currentGuess++;
  }

  setupSongPlayer() {
    const songPlayerElement = document.getElementById('songPlayer');

    if (songPlayerElement) {
      songPlayerElement.innerHTML = '';

      if (this.previewUrl) {
        this.audio = new Audio(this.previewUrl);
        this.audio.volume = 0.2;

        const playPauseButton = document.createElement('button');
        playPauseButton.textContent = 'Play!';
        playPauseButton.style.width = '60px';
        playPauseButton.style.height = '30px';
        playPauseButton.style.padding = '6px 10px';
        playPauseButton.style.backgroundColor = '#4DBE50';
        playPauseButton.style.color = '#fff';
        playPauseButton.style.border = 'none';
        playPauseButton.style.borderRadius = '4px';
        playPauseButton.style.cursor = 'pointer';
        playPauseButton.style.fontSize = '.8em';
        playPauseButton.style.marginRight = '10px';

        playPauseButton.addEventListener('click', () => {
          if (this.audio?.paused) {
            this.audio?.play();
            playPauseButton.textContent = 'Pause';
          } else {
            this.audio?.pause();
            playPauseButton.textContent = 'Play!';
          }
        });

        const progressBar = document.createElement('input');
        progressBar.type = 'range';
        progressBar.min = '0';
        progressBar.value = '0';
        progressBar.style.width = '400px';
        progressBar.addEventListener('input', () => {
          const newTime = Math.round((Number(progressBar.value) / 100) * (this.audio?.duration ?? 0));
          this.audio!.currentTime = newTime;
        });

        const volumeSlider = document.createElement('input');
        volumeSlider.type = 'range';
        volumeSlider.min = '0';
        volumeSlider.max = '1';
        volumeSlider.step = '0.04';
        volumeSlider.value = '.2';
        volumeSlider.style.width = '100px';
        volumeSlider.addEventListener('input', () => {
          if (this.audio) {
            this.audio.volume = parseFloat(volumeSlider.value);
          }
        });

        songPlayerElement.appendChild(playPauseButton);
        songPlayerElement.appendChild(progressBar);
        songPlayerElement.appendChild(volumeSlider);
        songPlayerElement.appendChild(this.audio);

        if (this.audio) {
          this.audio.addEventListener('timeupdate', () => {
            const currentTime = this.audio!.currentTime;
            if (currentTime > this.maxPlaybackDuration) {
              this.audio?.pause();
              playPauseButton.textContent = 'Play!';
              this.audio!.currentTime = 0;
            }
            progressBar.value = String((currentTime / this.audio!.duration) * 100);
          });
        } else {
          console.error('No preview URL');
        }
      } else {
        console.error('songPlayerElement error');
      }
    }
  }

  showWinPopup() {
    const winPopup = document.getElementById('winPopup');
    if (winPopup) {
      winPopup.style.display = 'block';
    }
  }

  showLosePopup() {
    const losePopup = document.getElementById('losePopup');
    if (losePopup) {
      losePopup.style.display = 'block';
    }
  }

  resetGame() {
    if (this.playerName !== '') {
      const storedLeaderboardData = localStorage.getItem('LEADERBOARD');
      if (storedLeaderboardData) {
        let playList = localStorage.getItem('CUR_PLAYLIST')
        if (playList) {
          this.playlistName = JSON.parse(playList).name
        }

        const leaderboardData = JSON.parse(storedLeaderboardData);
        leaderboardData.push(
          {
            name: this.playerName,
            guesses: this.currentGuess,
            playlist: this.playlistName
          }
        )
        const jsonString = JSON.stringify(leaderboardData);
        localStorage.setItem('LEADERBOARD', JSON.stringify(leaderboardData));
      }
    }
    window.location.reload();
  }

  backToHome() {
    this.router.navigate(['']);
  }
}