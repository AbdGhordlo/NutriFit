import { useState, useCallback, useEffect } from "react";
import { uploadProgressPhoto, listProgressPhotos, deleteProgressPhoto } from "../../services/progressService";
import { useAuth } from "../../utils/useAuth";
import { parseISO } from "date-fns";

export interface ProgressPhoto {
  id: number;
  url: string;
  uploaded_at: string;
}

export function useProgressPhotos() {
  const { getAuthToken, getAuthUserId } = useAuth();
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [uploadCountThisMonth, setUploadCountThisMonth] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    const token = getAuthToken();
    const userId = getAuthUserId();
    if (!token || !userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listProgressPhotos(userId, token);
      setPhotos(data);
      // Count uploads for this month
      const now = new Date();
      const monthUploads = data.filter((p: ProgressPhoto) => {
        const d = parseISO(p.uploaded_at);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
      setUploadCountThisMonth(monthUploads.length);
      setCurrentMonth(now.getMonth());
    } catch (e: any) {
      setPhotos([]);
      setError(e.message || "Failed to fetch progress photos");
    } finally {
      setLoading(false);
    }
  }, [getAuthToken, getAuthUserId]);

  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line
  }, []);

  const handlePhotoUpload = async (file: File) => {
    const token = getAuthToken();
    const userId = getAuthUserId();
    if (!token || !userId) return;
    const now = new Date();
    const currentMonthNow = now.getMonth();
    if (currentMonthNow !== currentMonth) {
      setUploadCountThisMonth(0);
      setCurrentMonth(currentMonthNow);
    }
    if (uploadCountThisMonth >= 2) {
      setError("You can only upload two progress photos per month.");
      return;
    }
    try {
      const res = await uploadProgressPhoto(userId, token, file);
      setPhotos((prev) => [res, ...prev]);
      setUploadCountThisMonth((prev) => prev + 1);
    } catch (e: any) {
      // If Multer file size error, show a user-friendly message
      if (e.message && e.message.includes("Upload error: File too large")) {
        setError("File size must be 5MB or less. Please choose a smaller image.");
      } else {
        setError(e.message || "Failed to upload photo.");
      }
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    const token = getAuthToken();
    const userId = getAuthUserId();
    if (!token || !userId) return;
    try {
      await deleteProgressPhoto(userId, photoId, token);
      setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
      setUploadCountThisMonth((prev) => Math.max(0, prev - 1));
    } catch (e: any) {
      throw new Error(e.message || "Failed to delete photo.");
    }
  };

  const clearError = () => setError(null);

  return {
    photos,
    uploadCountThisMonth,
    currentMonth,
    loading,
    error,
    fetchPhotos,
    handlePhotoUpload,
    handleDeletePhoto,
    clearError,
  };
}
