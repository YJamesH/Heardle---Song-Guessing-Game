import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import track from 'src/models/track';
import fetchFromSpotify from 'src/services/api';

const TOKEN_KEY = "whos-who-access-token";

interface playlist {
  id: string,
  images: any[],
  name: string,
  description: string,
  tracks: {
    href: string,
    total: number
  }
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  albumToSearch: string = ""
  playlistsToAdd: playlist[] = [];
  currentPlaylist: playlist = {
    id: "0",
    images: [],
    name: "null",
    description: "null",
    tracks: {
      href: "null",
      total: 0
    }
  };
  message: string = ""

  constructor(private router: Router ) { }

  ngOnInit(): void {
    let playList = localStorage.getItem('CUR_PLAYLIST')
    if(playList) {
      this.currentPlaylist = JSON.parse(playList)
    }
  }

  async getData() {
    const tokenString = localStorage.getItem(TOKEN_KEY)
    let token = JSON.parse(tokenString ? tokenString : "")
    let res = await fetchFromSpotify({
      token: token.value,
      endpoint: `search?q=${this.getQueryString(this.albumToSearch)}&type=playlist&limit=5`
    })

    this.playlistsToAdd = res.playlists.items
    console.log(this.playlistsToAdd)
  }
 
  async getGameData() {
    const tokenString = localStorage.getItem(TOKEN_KEY)
    const parsedGameData = []

    let token = JSON.parse(tokenString ? tokenString : "")
    let res = await fetchFromSpotify({
      token: token.value,
      endpoint: `playlists/${this.currentPlaylist.id}/tracks`
    })

    for(const item of res.items) {
      parsedGameData.push({
        id: item.track.id,
        name: item.track.name,
        preview_url: item.track.preview_url
      })
    }

    return parsedGameData
  }

  updateAlbum(s: string) {
    this.albumToSearch = s
  }

  getQueryString(s: string) {
    const array = s.split(" ")
    return array.join("+")
  }

  changeCurrentPlaylist(pl: playlist) {
    this.currentPlaylist = pl
    this.message = ''
    localStorage.setItem('CUR_PLAYLIST', JSON.stringify(this.currentPlaylist))
  }

  validatePlaylist(t: track[]) {
    const validArray = t.filter((track) => track.preview_url)

    return validArray.length > 6
  }

  async playGame() {
    if(this.currentPlaylist.id === "0") return

    let gameData = await this.getGameData()

    if(!this.validatePlaylist(gameData)) {
      this.message = "Couldn't play because the selected track has less than 6 preview urls available. Please choose a different track."
      return
    }
    this.message = ''

    localStorage.setItem('CUR_TRACKS', JSON.stringify(gameData))
    this.router.navigateByUrl('game')
  }

}
