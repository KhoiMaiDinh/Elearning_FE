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
} from 'lucide-react';
import { CourseItem, Section } from '@/types/courseType';
import AddButton from '../button/addButton';

type SectionCardProps = {
  section: Section;
  sectionIndex: number;
  openSectionIds: Set<string>;
  toggleSection: (sectionId: string) => void;
  handleAddLecture: (section: Section) => void;
  handleEditSection: (section: Section) => void;
  handleEditLecture: (section: Section, lecture: CourseItem) => void;
};

const SectionCard: React.FC<SectionCardProps> = ({
  section,
  sectionIndex,
  openSectionIds,
  toggleSection,
  handleAddLecture,
  handleEditSection,
  handleEditLecture,
}) => (
  <Card key={section.id} className="border-l-4 border-l-majorelleBlue">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
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
      </div>
    </CardHeader>
    {openSectionIds.has(section.id) && (
      <CardContent className="pt-0">
        <div className="space-y-3 ml-8">
          {section?.items.map((lecture, lectureIndex) => (
            <Card key={lecture.id} className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <Play className="h-4 w-4 text-majorelleBlue" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{lecture?.series?.[0]?.title}</h4>
                        {lecture.is_preview && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            <Eye className="h-3 w-3" />
                            Xem trước
                          </span>
                        )}
                      </div>
                      <p
                        className="ql-content text-sm text-smuted-foreground mt-1 truncate"
                        dangerouslySetInnerHTML={{ __html: lecture.description }}
                      />
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{lecture.video?.duration_in_seconds}</span>
                        {lecture?.resources?.length > 0 && (
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {lecture.resources.length} tài liệu
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditLecture(section, lecture)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {section.items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Chưa có bài học nào trong chương này</p>
              <Button variant="outline" className="mt-2" onClick={() => handleAddLecture(section)}>
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

export default SectionCard;
