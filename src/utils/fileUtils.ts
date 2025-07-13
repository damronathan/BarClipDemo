import { VideoFileInfo } from '../types/video';

/**
 * Validates if a file is a video file
 * @param file - The file to validate
 * @returns true if the file is a video, false otherwise
 */
export const isValidVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

/**
 * Gets video file information for logging
 * @param file - The video file
 * @returns VideoFileInfo object with name, type, and size
 */
export const getVideoFileInfo = (file: File): VideoFileInfo => {
  return {
    name: file.name,
    type: file.type,
    size: file.size
  };
};

/**
 * Creates FormData with a video file
 * @param file - The video file to append
 * @returns FormData object with the file appended as 'VideoFile'
 */
export const createVideoFormData = (file: File): FormData => {
  const formData = new FormData();
  formData.append('VideoFile', file, file.name);
  return formData;
};

/**
 * Validates file existence
 * @param file - The file to check
 * @returns true if file exists, false otherwise
 */
export const fileExists = (file: File | null): boolean => {
  return file !== null;
};
