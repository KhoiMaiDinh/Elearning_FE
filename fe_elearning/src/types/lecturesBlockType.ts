import { Delta } from "quill";

type lectureBlock = {
  avatar?: string;
  name?: string;
  rating?: number;
  major?: string;
  // description?: Delta;
  description?: string;

  numberCourse?: number;
  numberStudent?: number;
};
export default lectureBlock;
