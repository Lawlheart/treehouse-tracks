import React from 'react';
import axios from 'axios';
import Track from './Track';
import {browserHistory} from 'react-router';
import {processUserData} from '../helpers/treehouse';

export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      userData: null
    };
    this.getUserData = this.getUserData.bind(this);
  }
  getUserData(username) {
    console.log("NEW USER: " + username);
    axios.get(`https://teamtreehouse.com/${username}.json`).then(res => {
      this.setState({
        username: username,
        userData: processUserData(res.data)
      });
    });
  }
  componentDidMount() {
    console.log(window.location);
    let username = window.location.hash.split(/[?/]/)[1];
    if(username.indexOf('?') >=0) username = 'kennethblack';
    this.getUserData(username);
  }
  componentWillReceiveProps(next) {
    if(next.params.username && next.params.username !== this.state.username) this.getUserData(next.params.username);
  }
  render() {
    console.log(this.state.userData);
    if(!this.state.userData) return <main>Loading</main>;
    return <main>
      <h1>{this.state.username}'s Track Completion</h1>
      <h3>Completed Tracks: {this.state.userData.completedTracks.length}</h3>
      {this.props.params.track
      ? <Track trackData={this.state.userData.tracks.filter(t => t.title === this.props.params.track)[0]}
               params={this.props.params} />
      : this.state.userData.tracks.filter(track => track.progress > 2).map((track, i) =>
        <Track trackData={track} params={this.props.params} key={i}/>)}
    </main>;
  }
}
