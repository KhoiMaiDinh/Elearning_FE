import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Play,
  Eye,
  FileText,
  Clock,
  GitBranch,
  Undo2,
  RefreshCcw,
  Icon,
  Loader2,
  Banknote,
  TvMinimalPlay,
  X,
} from 'lucide-react';
import { CourseItem, Section } from '@/types/courseType';
import { formatDuration } from '@/helpers/durationFormater';
import CourseStatusBadge from '../badge/courseStatusBadge';
import { APIDeleteDraftLecture, APIHideLecture, APIUnhideLecture } from '@/utils/lecture';
import { ConfirmDialog } from '../alert/AlertConfirm';
import { Badge } from '../ui/badge';

type SectionCardProps = {
  mode: 'edit' | 'view';
  section: Section;
  sectionIndex: number;
  openSectionIds: Set<string>;
  toggleSection: (sectionId: string) => void;
  handleAddLecture: (section: Section) => void;
  handleEditSection: (section: Section) => void;
  handleEditLecture: (section: Section, lecture: CourseItem) => void;
  handleGetCourseInfo: () => void;
};

const SectionCard: React.FC<SectionCardProps> = ({
  mode,
  section,
  sectionIndex,
  openSectionIds,
  toggleSection,
  handleAddLecture,
  handleEditSection,
  handleEditLecture,
  handleGetCourseInfo,
}) => {
  const statusConfig = {
    DRAFT: {
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
    },
    PUBLISHED: {
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-100',
    },
    MODIFIED: {
      color: 'bg-orange-500',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50',
    },
    BANNED: {
      color: 'bg-orange-500',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50',
    },
    DELETED: {
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-gray-50',
    },
  };

  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

  const handleRemoveDraft = async (lecture_id: string) => {
    try {
      await APIDeleteDraftLecture(lecture_id);
      handleGetCourseInfo();
    } catch (error) {
      console.error('Failed to remove draft lecture:', error);
    }
  };

  const handleHideLecture = async (lecture_id: string) => {
    try {
      await APIHideLecture(lecture_id);
      handleGetCourseInfo();
    } catch (error) {
      console.error('Failed to remove draft lecture:', error);
    }
  };

  const handleUnhideLecture = async (lecture_id: string) => {
    try {
      await APIUnhideLecture(lecture_id);
      handleGetCourseInfo();
    } catch (error) {
      console.error('Failed to remove draft lecture:', error);
    }
  };
  return (
    <Card key={section.id} className="border-l-4 border-l-majorelleBlue">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {mode === 'edit' && (
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection(section.id)}
              className="p-0 h-auto"
            >
              {openSectionIds.has(section.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <div className="flex-1">
              <h3 className="font-semibold">
                Chương {sectionIndex + 1}: {section.title}
              </h3>
              <p
                className="text-sm text-muted-foreground mt-1 truncate"
                dangerouslySetInnerHTML={{ __html: section.description }}
              />
              <p className="text-xs text-muted-foreground mt-1">{section?.items?.length} bài học</p>
            </div>
          </div>
          {mode === 'edit' && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleAddLecture(section)}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleEditSection(section)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      {openSectionIds.has(section.id) && (
        <CardContent className="pt-0">
          <div className="space-y-3 ml-8">
            {section?.items.map((lecture, lectureIndex) => {
              const status: string =
                lecture.deletedAt || lecture.is_hidden
                  ? 'DELETED'
                  : (lecture.series?.[0]?.status ?? 'DRAFT');
              const config = statusConfig[status as keyof typeof statusConfig];
              const videoConfigs = {
                uploaded: {
                  text: 'Đang xử lý',
                  textColor: 'text-blue-700 bg-blue-200',
                  icon: Loader2,
                },
                validated: {
                  text: 'Sẵn sàng',
                  textColor: 'text-green-700 bg-green-200',
                  icon: Play,
                },
                rejected: {
                  text: 'Thất bại',
                  textColor: 'text-red-700 bg-red-200',
                  icon: X,
                },
              };
              const videoStatus = lecture?.series?.[0]?.video?.status as unknown as
                | keyof typeof videoConfigs
                | undefined;
              const videoConfig = videoConfigs[videoStatus ?? 'uploaded'];
              console.log(videoStatus, videoConfig);
              return (
                <Card
                  key={lecture.id}
                  className={` hover:ring-1 ring-majorelleBlue bg-gray-50 ${config.bgColor} `}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 text-xs text-black text-opacity-50">
                        {mode === 'edit' && (
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                        )}
                        <div className="bg-white rounded-lg p-1 ring-1">
                          <GitBranch className="h-3 w-3 text-majorelleBlue" /> v
                          {lecture?.series?.[0]?.version}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-row items-center gap-2">
                            <h4 className="font-semibold">{lecture?.series?.[0]?.title}</h4>
                            <CourseStatusBadge status={status} className="relative " />
                            {lecture?.series?.[0]?.is_preview && (
                              <Badge className="relative gap-2 rounded-2xl bg-green-100 text-green-800 hover:bg-green-200">
                                Xem trước
                                <Eye className="h-3 w-3" />
                              </Badge>
                            )}
                          </div>
                          <p
                            className="ql-content text-xs/3 text-smuted-foreground truncate text-DarkBlueGray"
                            dangerouslySetInnerHTML={{
                              __html: lecture?.series?.[0]?.description ?? '',
                            }}
                          />
                          <div className="flex items-center gap-4 text-xs text-muted-foreground ml">
                            <span
                              className={`ml-1 ${videoConfig.textColor} flex items-center gap-1 py-[2px] px-3 rounded-full`}
                            >
                              <videoConfig.icon className="h-3 w-3" />
                              <TvMinimalPlay className="w-3 h-3" />
                              <span className={`ml-1`}>{videoConfig.text}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(lecture.series?.[0]?.duration_in_seconds ?? 0)}
                            </span>
                            {(lecture?.series?.[0]?.resources?.length ?? 0) > 0 && (
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {lecture?.series?.[0]?.resources?.length} tài liệu
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {mode === 'edit' && (
                        <div className="flex items-center gap-2">
                          <ConfirmDialog
                            isOpen={openConfirmDialog}
                            onOpenChange={setOpenConfirmDialog}
                            onConfirm={() => handleRemoveDraft(lecture.id)}
                            title="Xác nhận hủy bản nháp"
                            description="Bạn có chắc chắn muốn hủy bản nháp của bài học này? "
                            confirmText="Xác nhận"
                            confirmClassName="bg-majorelleBlue hover:brightness-110 hover:bg-majorelleBlue"
                          />
                          {status === 'DELETED' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-white hover:shadow-md"
                              onClick={() => handleUnhideLecture(lecture.id)}
                            >
                              <RefreshCcw className="h-4 w-4" />
                            </Button>
                          ) : (
                            <>
                              {lecture.series?.[0]?.status === 'DRAFT' && (
                                <Button
                                  className="hover:bg-white hover:shadow-md"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setOpenConfirmDialog(true)}
                                >
                                  <Undo2 className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                className="hover:bg-white hover:shadow-md"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditLecture(section, lecture)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-white hover:shadow-md"
                                onClick={() => handleHideLecture(lecture.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {section.items.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Chưa có bài học nào trong chương này</p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => handleAddLecture(section)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm bài học đầu tiên
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default SectionCard;
