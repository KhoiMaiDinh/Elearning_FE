import { useState } from "react";
import { Flag, Star, X } from "lucide-react";
import { APICreateReport } from "@/utils/report";
import AlertSuccess from "../alert/AlertSuccess";
import AlertError from "../alert/AlertError";

export default function ButtonMore({ course_id }: { course_id: string }) {
  const [showMore, setShowMore] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [content, setContent] = useState("");
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [alertDescription, setAlertDescription] = useState("");

  const handleCreateReport = async () => {
    const data = {
      type: "COURSE",
      content_id: course_id,
      reason: content,
    };
    const response = await APICreateReport(data);
    if (response?.status === 200) {
      setShowReport(false);
      setContent("");
      setShowAlertSuccess(true);
      setAlertDescription("Báo cáo đã được gửi thành công");
      setTimeout(() => {
        setShowAlertSuccess(false);
      }, 3000);
    } else {
      setShowAlertError(true);
      setAlertDescription("Báo cáo không thành công");
      setTimeout(() => {
        setShowAlertError(false);
      }, 3000);
    }
  };

  return (
    <>
      <div className="fixed bottom-10 right-2 z-50 flex flex-col items-end gap-3">
        {/* Menu Options */}
        {showMore && (
          <div className="mb-2 w-40 rounded-lg bg-white p-2 shadow-md dark:bg-eerieBlack">
            <ul className="flex flex-col gap-2 text-sm">
              <li
                className="flex items-center gap-2 cursor-pointer hover:text-majorelleBlue"
                onClick={() => {
                  setShowReport(true);
                  setShowMore(false);
                }}
              >
                <Flag size={16} />
                <span>Báo cáo</span>
              </li>
              <li className="flex items-center gap-2 cursor-pointer hover:text-majorelleBlue">
                <Star size={16} />
                <span>Đánh giá</span>
              </li>
            </ul>
          </div>
        )}

        {/* Nút ba chấm */}
        <button
          onClick={() => setShowMore((prev) => !prev)}
          className="text-white flex h-10 w-10 items-center justify-center rounded-full bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue shadow-md transition hover:scale-110"
        >
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-white" />
            <div className="h-1 w-1 rounded-full bg-white" />
            <div className="h-1 w-1 rounded-full bg-white" />
          </div>
        </button>
      </div>

      {/* Popup Report Form */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-[90%] max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-eerieBlack">
            <button
              className="absolute right-3 top-3 text-gray-400 hover:text-red-500"
              onClick={() => setShowReport(false)}
            >
              <X size={20} />
            </button>
            <h2 className="mb-4 text-lg font-semibold text-eerieBlack dark:text-white">
              Gửi báo cáo khóa học
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Submit logic ở đây
                setShowReport(false);
              }}
              className="flex flex-col gap-4"
            >
              <textarea
                required
                placeholder="Nội dung báo cáo..."
                className="min-h-[100px] w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-majorelleBlue dark:bg-black dark:text-white"
              />
              <button
                type="submit"
                onClick={handleCreateReport}
                className="self-end rounded bg-majorelleBlue px-4 py-2 text-white hover:bg-opacity-80"
              >
                Gửi báo cáo
              </button>
            </form>
          </div>
        </div>
      )}

      {showAlertSuccess && <AlertSuccess description={alertDescription} />}
      {showAlertError && <AlertError description={alertDescription} />}
    </>
  );
}
