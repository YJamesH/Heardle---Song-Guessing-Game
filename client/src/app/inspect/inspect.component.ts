import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/user.service';

@Component({
  selector: 'app-inspect',
  templateUrl: './inspect.component.html',
  styleUrls: ['./inspect.component.css']
})
export class InspectComponent implements OnInit {

  username: string = ""
  public userFound: boolean = false; 

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  receiveUsername(valueEmitted: string) {
    this.username = valueEmitted;
  }

  inspectedUser: {
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

  async onSubmit() {
    this.inspectedUser = await this.userService.inspectUser(this.username);
    this.userFound = true;
  }
}
