import React from 'react';

const Track = (props) => {
  return (<div className="track-data">
    <h1>{props.title} Track Completion</h1>
    <h4>Courses: {props.courses.length}</h4>
    {props.courses.map((course, i) => <div className="course" key={i}>
      <h4>{course.title} ({props.badgeData[course.title] || 0}/{course.count})</h4>

    </div>)}
  </div>)
};

export default Track;