import { Component, OnInit } from '@angular/core';

interface score {
  name: string, 
  guesses: number,
  playlist: string
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  scoreboard: score[] = []

  constructor() { }

  ngOnInit(): void {
    const leaderboard = localStorage.getItem('LEADERBOARD')
    if(leaderboard) {
      this.scoreboard = JSON.parse(leaderboard)
      this.sortByGuesses()
    }
  }

  sortByGuesses() {
    let correctGuesses = this.scoreboard.filter(score => score.guesses > 0)
    let incorrectGuesses = this.scoreboard.filter(score => score.guesses < 0)
    correctGuesses = correctGuesses.sort((a, b) => a.guesses - b.guesses)

    this.scoreboard = [...correctGuesses, ...incorrectGuesses]
  }

  sortByString(key: string) {
    if(key !== 'name' && key !== 'playlist') return
    this.scoreboard = this.scoreboard.sort((a: score, b: score) => a[key].localeCompare(b[key]))
  }

  colorCard(guesses: number) {
    if(guesses === 1) return "correct"
    if(guesses === -1) return "wrong"

    return `correct-${guesses}`
  }

}
