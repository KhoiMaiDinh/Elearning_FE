import CoursesBlock from "@/components/block/courses-block";
import LecturersBlock from "@/components/block/lecturers-block";

export default function Page() {
  return (
    <div className="w-full h-full flex flex-col gap-3 bg-AntiFlashWhite">
      <div className="w-full h-full flex flex-row gap-3">
        <LecturersBlock />
        <LecturersBlock />
      </div>
      <div className="w-full h-full flex flex-row gap-3">
        <CoursesBlock />
        <CoursesBlock />
      </div>
      <div className="w-full h-full flex flex-row gap-3">
        <CoursesBlock />
        <CoursesBlock />
      </div>
    </div>
  );
}
