import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Check, Loader } from 'lucide-react';

interface CloudinaryUploaderProps {
  onUploadSuccess: (url: string, publicId: string, width: number, height: number) => void;
  folder?: string;
}

export default function CloudinaryUploader({ onUploadSuccess, folder = 'gallery' }: CloudinaryUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudName = 'dripslxj9';

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError(null);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    await uploadToCloudinary(file);
  };

  const uploadToCloudinary = async (file: File) => {
    setUploading(true);
    setProgress(0);

    try {
      // Create FormData for direct upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default'); // Use unsigned preset or create one
      formData.append('folder', folder);

      // Upload with progress tracking
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(percentComplete);
        }
      });

      const uploadPromise = new Promise<any>((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error('Upload failed'));
          }
        });
        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
      });

      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
      xhr.send(formData);

      const result = await uploadPromise;
      
      setUploadedUrl(result.secure_url);
      onUploadSuccess(result.secure_url, result.public_id, result.width, result.height);
      
    } catch (err: any) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      handleFileSelect({ target: fileInputRef.current } as any);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const reset = () => {
    setPreview(null);
    setUploadedUrl(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyUrl = () => {
    if (uploadedUrl) {
      navigator.clipboard.writeText(uploadedUrl);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!preview && !uploadedUrl && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Drag and drop an image here, or click to select
          </p>
          <p className="text-sm text-gray-500">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>
      )}

      {preview && !uploadedUrl && (
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-700">Uploading...</p>
                <button
                  onClick={reset}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={uploading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {uploading && (
                <div className="mb-2">
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {Math.round(progress)}%
                  </p>
                </div>
              )}
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {uploadedUrl && (
        <div className="border border-green-300 bg-green-50 rounded-lg p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <img
                src={uploadedUrl}
                alt="Uploaded"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-5 h-5 text-green-600" />
                <p className="text-green-700">Upload successful!</p>
              </div>
              <div className="bg-white rounded border border-green-200 p-2 mb-2">
                <p className="text-sm text-gray-600 break-all">{uploadedUrl}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyUrl}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                >
                  Copy URL
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition text-sm"
                >
                  Upload Another
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
