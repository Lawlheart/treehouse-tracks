import React from 'react';
import axios from 'axios';
import Track from './Track';
import {browserHistory} from 'react-router';
import trackData from '../../data/trackData.json';
import {processUserData} from '../helpers/treehouse';

export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      userData: {},
      badgesByClass: {}
    };
    this.getBadgesByClass = this.getBadgesByClass.bind(this);
    this.getUserData = this.getUserData.bind(this);
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
    return trackData[trackName].map(course => course.title)
      .filter(course => !!this.state.badgeData[course]).length;
  }
  getCompletedTracks() {
    let trackNames = Object.keys(trackData);
    return trackNames.filter(trackName =>
      this.getCompletedClassCount(trackName) === trackData[trackName].length);
  }
  getUserData(username) {
    console.log("NEW USER: " + username);
    axios.get(`https://teamtreehouse.com/${username}.json`).then(res => {
      processUserData(res.data);
      this.setState({
        username: username,
        userData: res.data,
        badgeData: this.getBadgesByClass(res.data.badges)
      });
    }).catch(err => {
      console.log(err);
    });
  }
  componentWillMount() {
    if(this.params && this.params.username) this.getUserData(this.params.username);
    else this.getUserData("kennethblack");
  }
  componentWillReceiveProps(next) {
    if(next.params.username && next.params.username !== this.state.username) this.getUserData(next.params.username);
  }
  render() {
    return <main>
      {this.state.badgeData && <h1>{this.state.username}'s Track Completion</h1>}
      {trackData && this.state.badgeData && <h3>Completed Tracks: {this.getCompletedTracks().length}</h3>}
      {this.state.badgeData && trackData &&
      (this.props.params.track && trackData[this.props.params.track]
        ? <Track title={this.props.params.track}
                 badgeData={this.state.badgeData}
                 params={this.props.params}
                 completedCount={this.getCompletedClassCount(this.props.params.track)}
                 courses={trackData[this.props.params.track]}/>
        : Object.keys(trackData).filter(trackName => this.getCompletedClassCount(trackName) > 2)
          .map((trackName, i) =>
          <Track title={trackName}
                 badgeData={this.state.badgeData}
                 params={this.props.params}
                 completedCount={this.getCompletedClassCount(trackName)}
                 courses={trackData[trackName]} key={i}/>)
      )}
    </main>;
  }
}
