import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { CloudinaryUploadResponse, mapToMediaCreateInput, MediaCreateInput } from '@/lib/mediaUtils';
import { ResourceType } from '@/graphql/graphql';

interface UseUploadMediaResult {
  uploadMedia: (files: File[]) => Promise<MediaCreateInput[]>;
  progress: number | null;
  isUploading: boolean;
  cancelUpload: () => void;
  error: string | null;
}

const UPLOAD_URL = `${import.meta.env.VITE_API_BASE_URL ?? ''}/api/media/upload`;

export function useUploadMedia(): UseUploadMediaResult {
  const [progress, setProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelSource = useRef<AbortController | null>(null);

  const uploadMedia = useCallback(async (files: File[]): Promise<MediaCreateInput[]> => {
    if (!files.length) return [];

    console.log('⬆️ useUploadMedia: Starting upload for', files.length, 'files');
    setIsUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const token = localStorage.getItem('accessToken');
    cancelSource.current = new AbortController();

    try {
      const response = await axios.post<CloudinaryUploadResponse[]>(
        UPLOAD_URL,
        formData,
        {
          signal: cancelSource.current.signal,
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
          onUploadProgress: (evt) => {
            if (evt.total) {
              const pct = Math.round((evt.loaded * 100) / evt.total);
              setProgress(pct);
            }
          },
        }
      );

      const uploads = response.data.filter((item) => item.success && item.data);

      const mapped = uploads.map((item, i) => {
        const file = files[i];
        const resourceType = file?.type?.startsWith('video')
          ? ResourceType.Video
          : ResourceType.Image;
        return mapToMediaCreateInput(item.data, resourceType);
      });

      console.log('✅ useUploadMedia: mapped', mapped);
      return mapped;
    } catch (err) {
      console.error('❌ Upload failed:', err);
      const msg =
        axios.isAxiosError(err)
          ? (err.response?.data?.message as string) || 'Upload failed'
          : (err as Error).message;
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsUploading(false);
      setProgress(null);
      cancelSource.current = null;
    }
  }, []);

  const cancelUpload = useCallback(() => {
    if (cancelSource.current) {
      cancelSource.current.abort();
      console.warn('🚫 Upload cancelled by user');
      setError('Upload cancelled');
      setIsUploading(false);
      setProgress(null);
    }
  }, []);

  return { uploadMedia, progress, isUploading, cancelUpload, error };
}
