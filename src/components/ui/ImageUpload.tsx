import { useState, useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { cn } from '@/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<string | null>;
  className?: string;
  label?: string;
  error?: string;
}

export function ImageUpload({
  value,
  onChange,
  onUpload,
  className,
  label,
  error,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    setUploading(true);
    try {
      const url = await onUpload(file);
      if (url) {
        onChange(url);
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="space-y-2">
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            className={cn(
              'w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors',
              error && 'border-red-500'
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
              <>
                <Camera className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 text-center">
                  Clique para
                  <br />
                  selecionar
                </p>
              </>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
