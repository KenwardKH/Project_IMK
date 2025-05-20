import { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';

interface PaymentModalProps {
  onClose: () => void;
}

export default function PaymentModal({ onClose }: PaymentModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Upload Bukti Pembayaran</h2>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">Pilih Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-100 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-200"
          />
        </div>

        {imagePreview && (
          <div className="mb-4 overflow-hidden rounded-lg border border-gray-200">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full object-cover"
            />
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            className="bg-gray-400 px-4 text-sm text-white hover:bg-gray-500"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            type="button"
            className="bg-green-600 px-4 text-sm text-white hover:bg-green-700"
            onClick={() => {
              if (selectedFile) {
                // Lakukan aksi upload di sini
                console.log('File yang diupload:', selectedFile);
              }
              onClose();
            }}
          >
            Kirim
          </Button>
        </div>
      </div>
    </div>
  );
}
