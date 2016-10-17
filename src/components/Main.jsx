import React from 'react';
import axios from 'axios';
import Track from './Track';


export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      trackData: {},
      userData: {},
      badgesByClass: {}
    };
    this.getBadgesByClass = this.getBadgesByClass.bind(this)
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

  componentWillMount() {
    axios.get('https://teamtreehouse.com/kennethblack.json').then(res => {
      let badges = res.data.badges;
      let badgeData = this.getBadgesByClass(badges);
      this.setState({
        userData: res.data,
        badgeData: badgeData
      });
    });
    axios.get('https://gist.githubusercontent.com/LawlietBlack/2eb63d44f4e44b6193b1555507d8f719/raw/9418b60558e9227590d87763a3d58e430524971b/trackData.json').then(res => {
      this.setState({
        trackData: res.data
      });
    });
  }
  render() {
    return <div>
      {(this.state.badgeData && this.state.trackData) && <Track title="Full Stack JavaScript" badgeData={this.state.badgeData} courses={this.state.trackData["Full Stack JavaScript"]}/>}
    </div>;
  }
}
