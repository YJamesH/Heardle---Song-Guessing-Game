import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/user.service';

@Component({
  selector: 'app-duel',
  templateUrl: './duel.component.html',
  styleUrls: ['./duel.component.css']
})
export class DuelComponent implements OnInit {
  usernameOne: string = ""
  usernameTwo: string = ""
  winner: string = "Tie!"
  usersFound: boolean = false
  errorMsg: string = "";

  // dynamic styling for winner
  userOneClass: string = ''; 
  userTwoClass: string = '';

  userOne: {
    username?: string;
    name?: string;
    location?: string;
    bio?: string;
    avatar_url?: string;
    titles?: Array<string>;
    favorite_language?: string;
    public_repos?: number;
    total_stars?: number;
    highest_starred?: number;
    perfect_repos?: number;
    followers?: number;
    following?: number;
  } = {};

  userTwo: {
    username?: string;
    name?: string;
    location?: string;
    bio?: string;
    avatar_url?: string;
    titles?: Array<string>;
    favorite_language?: string;
    public_repos?: number;
    total_stars?: number;
    highest_starred?: number;
    perfect_repos?: number;
    followers?: number;
    following?: number;
  } = {};

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  receiveUsernameOne(valueEmitted: string) {
    this.usernameOne = valueEmitted;
  }

  receiveUsernameTwo(valueEmitted: string) {
    this.usernameTwo = valueEmitted;
  }

  async onSubmit() {
    try {
      this.userOne = await this.userService.inspectUser(this.usernameOne);
      this.userTwo = await this.userService.inspectUser(this.usernameTwo);
      this.winner = await this.userService.duelUsers(this.usernameOne, this.usernameTwo);
      
      // set duel result response
      if (this.winner === `It's a tie between ${this.usernameOne} and ${this.usernameTwo}!`) {
        this.userOneClass = 'winner-green';
        this.userTwoClass = 'winner-green';
      } else if (this.winner === `User ${this.usernameOne} Wins!`) {
        this.userOneClass = 'winner-green';
        this.userTwoClass = 'loser-red';
      } else if (this.winner === `User ${this.usernameTwo} Wins!`) {
        this.userOneClass = 'loser-red';
        this.userTwoClass = 'winner-green';
      } else {
        this.userOneClass = 'loser-red';
        this.userTwoClass = 'loser-red';;
      }
      this.usersFound = true;
      this.errorMsg = ""
    } catch (error) {
      this.errorMsg = "One or both users do not exist!"; 
    }
  }
}
