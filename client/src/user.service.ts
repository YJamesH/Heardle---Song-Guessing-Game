import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const inspectUserUrl = 'http://localhost:3000/api/user/';
const duelUsersUrl = 'http://localhost:3000/api/users?';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient) { }

  async inspectUser(username: string): Promise<any> {
    let data: any = await this.http.get(inspectUserUrl + username).toPromise();
    if (data && data.message === "Not Found") {
      throw new Error("User not found");
      return null;
    } 

    return {
      username: data.username,
      name: data.name,
      location: data.location,
      bio: data.bio,
      avatar_url: data["avatar-url"],
      titles: data.titles,
      favorite_language: data["favorite-language"],
      public_repos: data["public-repos"],
      total_stars: data["total-stars"],
      highest_starred: data["highest-starred"],
      perfect_repos: data["perfect-repos"],
      followers: data.followers,
      following: data.following
    }
  }

  async duelUsers(user1: string, user2: string): Promise<any> {
    try {
      let user1Data: any = await this.inspectUser(user1);
      let user2Data: any = await this.inspectUser(user2);
  
      if (!user1Data || !user2Data) {
        throw new Error("Not a fair fight!");
      }

      // find out winner based on total stars divided by # of public repos
      const user1Score = user1Data.total_stars / user1Data.public_repos;
      const user2Score = user2Data.total_stars / user2Data.public_repos;
  
      if (user1Score > user2Score) {
        return `User ${user1} Wins!`;
      } else if (user2Score > user1Score) {
        return `User ${user2} Wins!`;
      } else {
        return `It's a tie between ${user1} and ${user2}!`;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}
