export interface MediaType {
  id?: string;
  media_id?: string;
  bucket?: string;
  key?: string;
  status?: UploadStatus;
  rejection_reason?: string;
  entity?: string;
  entity_property?: string;
  expires_at?: string;
  user_id?: string;
}

export enum UploadStatus {
  PENDING = 'pending',
  UPLOADED = 'uploaded',
  VALIDATED = 'validated',
  REJECTED = 'rejected',
  DELETED = 'deleted',
}
