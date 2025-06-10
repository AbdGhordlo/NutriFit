import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import { FaCamera, FaTrash, FaCloudUploadAlt } from "react-icons/fa";
import ErrorModal from "../ErrorModal";

export interface ProgressPhoto {
  id: number;
  url: string;
  uploaded_at: string;
}

interface ProgressPhotosProps {
  photos: ProgressPhoto[];
  uploadCountThisMonth: number;
  loading: boolean;
  error?: string | null;
  handlePhotoUpload: (file: File) => Promise<void>;
  handleDeletePhoto: (photoId: number) => Promise<void>;
  clearError: () => void;
}

const ProgressPhotos: React.FC<ProgressPhotosProps> = ({
  photos,
  uploadCountThisMonth,
  loading,
  handlePhotoUpload,
  handleDeletePhoto,
  error,
  clearError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFileSizeError(
          "File size must be 5MB or less. Please choose a smaller image."
        );
        return;
      }
      handlePhotoUpload(file).catch(() => {});
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        if (file.size > 5 * 1024 * 1024) {
          setFileSizeError(
            "File size must be 5MB or less. Please choose a smaller image."
          );
          return;
        }
        handlePhotoUpload(file).catch(() => {});
      } else {
        setFileSizeError("Please drop an image file.");
      }
    },
    [handlePhotoUpload]
  );

  const closeFileSizeError = () => setFileSizeError(null);

  return (
    <div className="progress-photos bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Progress Photos</h2>
        <motion.label
          className="cursor-pointer bg-primary-green text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 hover:bg-primary-hover transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaCamera />
          <span>Add Photo</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </motion.label>
      </div>
      <div
        className={`min-h-[200px] rounded-lg border-2 border-dashed transition-colors ${
          isDragging ? "border-primary-green bg-teal-50" : "border-gray-300"
        } ${photos.length === 0 ? "flex items-center justify-center" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : photos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FaCloudUploadAlt className="mx-auto text-5xl mb-4 text-gray-400" />
            <p className="font-medium">Drag & drop your progress photo here</p>
            <p className="text-sm mt-2">or click the Add Photo button above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            <AnimatePresence>
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  className="relative group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <img
                      src={photo.url}
                      alt={`Progress from ${format(
                        parseISO(photo.uploaded_at),
                        "MMM d, yyyy"
                      )}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/70 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <motion.button
                        className="text-white p-2 hover:text-red-500 transition-colors"
                        whileHover={{ scale: 1.2 }}
                        onClick={() => handleDeletePhoto(photo.id)}
                      >
                        <FaTrash size={20} />
                      </motion.button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {format(parseISO(photo.uploaded_at), "MMM d, yyyy")}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      <div className="mt-4 text-sm text-gray-500">
        <p>
          * You can upload two progress photos per month to track your fitness
          journey.
        </p>
        {uploadCountThisMonth > 0 && (
          <p className="mt-1">Uploads this month: {uploadCountThisMonth}/2</p>
        )}
      </div>
      <ErrorModal isOpen={!!error} message={error ?? ""} onClose={clearError} />
      <ErrorModal
        isOpen={!!fileSizeError}
        message={fileSizeError ?? ""}
        onClose={closeFileSizeError}
      />
    </div>
  );
};

export default ProgressPhotos;
