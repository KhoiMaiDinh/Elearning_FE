"use client";
import React, { useState } from "react";
import { useForm, Controller, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/constants/store";
import { setCourse } from "@/constants/course";
import InputRegisterLecture from "@/components/inputComponent/inputRegisterLecture";
import TextAreaRegisterLecture from "@/components/inputComponent/textAreaRegisterLecture";
import { Button } from "@/components/ui/button";
import {
  APIInitSection,
  APIUpdateSection,
  APIGetFullCourse,
} from "@/utils/course";
import AlertSuccess from "@/components/alert/AlertSuccess";
import AlertError from "@/components/alert/AlertError";
import { Section } from "@/types/courseType";

const sectionSchema = yup.object().shape({
  title: yup.string().required("Tiêu đề phần không được để trống"),
  description: yup.string().required(),
  position: yup.string().required("Thứ tự phần không được để trống"),
});

interface SectionFormProps {
  section: Section;
  onSave: (data: Section) => void;
  onCancel: () => void;
  courseId: string;
}

const SectionForm: React.FC<SectionFormProps> = ({
  section,
  onSave,
  onCancel,
  courseId,
}) => {
  const { control, handleSubmit } = useForm<Section>({
    resolver: yupResolver(sectionSchema) as unknown as Resolver<Section>,
    defaultValues: {
      title: section.title || "",
      description: section.description || "",
      position: section.position || "",
    },
  });

  const sections = useSelector(
    (state: RootState) => state.course.courseInfo?.sections || []
  );
  const courseInfo = useSelector((state: RootState) => state.course.courseInfo);
  const dispatch = useDispatch();
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [description, setDescription] = useState("");

  const isNewSection = !section.id;

  const handleGetCourseInfo = async () => {
    try {
      const response = await APIGetFullCourse(courseInfo.course_id!);
      if (response?.status === 200) {
        dispatch(setCourse(response.data));
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };

  const handleCreateSection = async (data: Section) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        course: { id: courseId },
        previous_section_id:
          sections.length > 0 && sections[sections.length - 1].id
            ? sections[sections.length - 1].id
            : null,
      };
      const response = await APIInitSection(payload);
      if (response?.status === 201) {
        const newSection: Section = {
          ...section,
          id: response.data.id,
          title: data.title,
          description: data.description,
          position: section.position,
          lectures: [],
        };
        onSave(newSection);
        await handleGetCourseInfo();
      }
    } catch (error) {
      console.error("Error creating section:", error);
      setShowAlertError(true);
      setDescription("Không thể tạo phần bài giảng");
      setTimeout(() => setShowAlertError(false), 3000);
      throw error;
    }
  };

  const handleUpdateSection = async (data: Section) => {
    try {
      const response = await APIUpdateSection(section.id || "", {
        title: data.title,
        description: data.description,
      });
      if (response?.status === 200) {
        const updatedSection: Section = {
          ...section,
          title: data.title,
          description: data.description,
        };
        onSave(updatedSection);
        await handleGetCourseInfo();
      }
    } catch (error) {
      console.error("Error updating section:", error);
      setShowAlertError(true);
      setDescription("Không thể cập nhật phần bài giảng");
      setTimeout(() => setShowAlertError(false), 3000);
      throw error;
    }
  };

  const onSubmit = async (data: Section) => {
    if (isNewSection) {
      await handleCreateSection(data);
    } else {
      await handleUpdateSection(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <InputRegisterLecture
            {...field}
            labelText={`Tiêu đề phần ${section.position}`}
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextAreaRegisterLecture
            {...field}
            labelText={`Mô tả phần ${section.position}`}
          />
        )}
      />
      <div className="flex gap-2">
        <Button type="submit" className="bg-majorelleBlue text-white">
          {isNewSection ? "Tạo mới" : "Cập nhật"}
        </Button>
        <Button type="button" onClick={onCancel}>
          Hủy
        </Button>
      </div>
      {showAlertSuccess && <AlertSuccess description={description} />}
      {showAlertError && <AlertError description={description} />}
    </form>
  );
};

export default SectionForm;
