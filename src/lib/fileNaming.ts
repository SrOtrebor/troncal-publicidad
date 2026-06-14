// ============================================================
// File Naming — Automatic rename system
// ============================================================

/**
 * Generates a standardized filename for uploaded ad assets.
 * Format: [SlotID]_[ClientName]_[YYYYMMDD].[ext]
 * 
 * @example
 * generateFileName('slot-p12-full', 'Juan Pérez', 'jpg')
 * // → "slot-p12-full_JuanPerez_20260614.jpg"
 */
export function generateFileName(
  slotId: string,
  clientName: string,
  originalExtension: string
): string {
  const sanitizedName = clientName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-zA-Z0-9]/g, '')    // Remove special chars
    .trim();

  const now = new Date();
  const dateStr = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');

  const ext = originalExtension.toLowerCase().replace(/^\./, '');
  
  return `${slotId}_${sanitizedName}_${dateStr}.${ext}`;
}

/**
 * Extracts the file extension from a filename.
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}
