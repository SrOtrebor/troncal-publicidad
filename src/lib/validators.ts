// ============================================================
// File Validators
// ============================================================

const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'tiff', 'tif'];
const MAX_FILE_SIZE_MB = 50; // 50MB max

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates an uploaded file against format and size constraints.
 */
export function validateFile(file: File): ValidationResult {
  // Check format
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_FORMATS.includes(extension)) {
    return {
      valid: false,
      error: `Formato no permitido: .${extension}. Usá JPG, PNG o TIFF.`,
    };
  }

  // Check MIME type
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/tiff',
  ];
  if (!allowedMimes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de archivo no válido. Subí una imagen JPG, PNG o TIFF.`,
    };
  }

  // Check size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    return {
      valid: false,
      error: `El archivo pesa ${fileSizeMB.toFixed(1)} MB. El máximo es ${MAX_FILE_SIZE_MB} MB.`,
    };
  }

  return { valid: true };
}

/**
 * Formats a file size in bytes to a human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
