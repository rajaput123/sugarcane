/**
 * File Upload Types
 * 
 * Defines types for file upload functionality.
 */

export interface UploadedFile {
    id: string;
    name: string;
    size: number; // in bytes
    type: string; // MIME type
    uploadedAt: string; // ISO timestamp
    status: 'uploading' | 'completed' | 'failed';
    uploadProgress?: number; // 0-100
    content?: string; // Extracted PDF text content
    summary?: string; // Summary of PDF content
}

