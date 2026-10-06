import axios from "../config/axios";

class CourseService {
  async getAllCourse(){
    const response = await axios.get('/cfp/course');
    return response.data;
  }
}

export const courseService = new CourseService();