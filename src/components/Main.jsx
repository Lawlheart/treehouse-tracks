import React from 'react';
import axios from 'axios';
import Track from './Track';
import {browserHistory} from 'react-router';


export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      trackData: {},
      userData: {},
      badgesByClass: {},
      message: "",
      filterEmpty: true
    };
    this.getBadgesByClass = this.getBadgesByClass.bind(this);
    this.getUserData = this.getUserData.bind(this);
    this.search = this.search.bind(this);
  }
  getBadgesByClass(badges) {
    let badgeData = {};
    for(let i=0; i<badges.length; i++) {
      if(badges[i].courses.length > 0) {
        let title = badges[i].courses[0].title;
        badgeData[title] = (badgeData[title] === undefined) ? 1 : badgeData[title] + 1
      }
    }
    return badgeData
  }
  getCompletedClassCount(trackName) {
    return this.state.trackData[trackName].map(course => course.title)
      .filter(course => !!this.state.badgeData[course]).length;
  }
  getCompletedTracks() {
    let trackNames = Object.keys(this.state.trackData);
    return trackNames.filter(trackName =>
      this.getCompletedClassCount(trackName) === this.state.trackData[trackName].length);
  }
  getUserData(username) {
    console.log("NEW USER: " + username);
    axios.get(`https://teamtreehouse.com/${username}.json`).then(res => {
      let badges = res.data.badges;
      let badgeData = this.getBadgesByClass(badges);
      this.setState({
        username: username,
        userData: res.data,
        badgeData: badgeData,
        message: null
      });
    }).catch(err => {
      console.log(err);
      console.log("User not found.");
      this.setState({message: "User not found"});
    });
  }
  search() {
    let query = document.getElementById('treehouse-search').value;
    this.getUserData(query);
  }
  componentWillMount() {
    if(this.params && this.params.username) this.getUserData(this.params.username);
    else this.getUserData("kennethblack");
    axios.get('https://gist.githubusercontent.com/LawlietBlack/2eb63d44f4e44b6193b1555507d8f719/raw/9418b60558e9227590d87763a3d58e430524971b/trackData.json').then(res => {
      this.setState({
        trackData: res.data
      });
    });
  }
  componentWillReceiveProps(next) {
    console.log(next.params);
    if(next.params.username && next.params.username !== this.state.username) this.getUserData(next.params.username);
  }
  render() {
    return <div>
      {this.state.badgeData && <h1>{this.state.username}'s Track Completion</h1>}
      {/*<label htmlFor="treehouse-search">Change User:</label>*/}
      {/*<input type="text" name="treehouse-search" id="treehouse-search"/>*/}
      {/*<button className="btn btn-submit" onClick={this.search}>Search</button>*/}
      {/*{this.state.message && <p>{this.state.message}</p>}*/}
      {this.state.trackData && this.state.badgeData && <h4>Completed Tracks: {this.getCompletedTracks().length}</h4>}
      {(this.state.badgeData && this.state.trackData) &&
      (this.props.params.track && this.state.trackData[this.props.params.track]
        ? <Track title={this.props.params.track}
                 badgeData={this.state.badgeData}
                 params={this.props.params}
                 completedCount={this.getCompletedClassCount(this.props.params.track)}
                 courses={this.state.trackData[this.props.params.track]}/>
        : Object.keys(this.state.trackData).filter(trackName => this.getCompletedClassCount(trackName) > 2)
          .map((trackName, i) =>
          <Track title={trackName}
                 badgeData={this.state.badgeData}
                 params={this.props.params}
                 completedCount={this.getCompletedClassCount(trackName)}
                 courses={this.state.trackData[trackName]} key={i}/>)
      )}
    </div>;
  }
}
