// src/services/CourseService.js

import axios from 'axios';

const CourseService = {
  fetchCoursesForParent: () => axios.get('http://localhost:5000/api/parent/courses'),
  addCourse: (courseData) => axios.post('http://localhost:5000/api/courses', courseData),
  payForCourse: (courseId) => axios.post(`http://localhost:5000/api/courses/${courseId}/pay`),
};

export default CourseService;
