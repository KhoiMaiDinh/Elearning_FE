'use client';
import React from 'react';
import UpsertInstructor from './upsertLecture';

interface FilePreview {
  url: string;
  name: string;
  file?: File;
}

interface _FileData {
  certificate_file: {
    key: string;
    bucket: string;
    status: string;
    rejected_reason: string | null;
  };
}

const ProfileLecture = () => {
  return <UpsertInstructor mode="update" />;
};

export default ProfileLecture;
