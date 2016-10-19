import _ from 'lodash';
import trackData from '../../data/trackData.json';

export const processUserData = (userData) => {
  let newUserModel = _.clone(userData);
  newUserModel.tracks = [];
  newUserModel.completedTracks = [];
  let badges = newUserModel.badges;
  let badgeData = {};
  for(let i=0; i<badges.length; i++) {
    if(badges[i].courses.length > 0) {
      let title = badges[i].courses[0].title;
      badgeData[title] = (badgeData[title] === undefined) ? 1 : badgeData[title] + 1
    }
  }
  newUserModel.badgeData = badgeData;
  newUserModel.tracks = Object.keys(trackData).map(trackName => {
    let track = {
      title: trackName,
      count: trackData[trackName].filter(c => c.type != 'Workshop').length,
      courses: [],
      progress: 0
    };
    track.courses = trackData[trackName].map(course => {
      let completed = newUserModel.badgeData[course.title] || 0;
      if(course.count && completed === course.count) track.progress += 1;
      course.progress = completed;
      return course;
    });
    if(track.progress === track.count) newUserModel.completedTracks.push(trackName);
    return track;
  });
  return newUserModel;
};
