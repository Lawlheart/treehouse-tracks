import React from 'react';
import {Link} from 'react-router';

const Track = (props) => {
  let root = props.params.username ? `/${props.params.username}/` : '/';
  return (<div className="track-data">
    {props.params.track && <Link to={`${root}`} ><h1>Tracks Home</h1></Link>}
    {props.params.track
      ? <h1>{props.title} Track Completion</h1>
      : <h1><Link to={`${root}tracks/${props.title}`} >{props.title} Track Completion</Link></h1>}
    <h4>Courses: {props.completedCount}/{props.courses.filter(c => c.type !== 'Workshop').length}</h4>
    {props.courses.map((course, i) => <div className="course" key={i}>
      <h4>{course.title} {course.type === 'Workshop' ? "(Workshop)"
        : `${props.badgeData[course.title] || 0}/${course.count}`}</h4>

    </div>)}
  </div>)
};

export default Track;