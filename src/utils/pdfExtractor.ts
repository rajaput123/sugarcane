/**
 * PDF Content Extractor
 * 
 * Extracts text content from PDF files and generates summaries.
 */

export class PDFExtractor {
    /**
     * Extract text content from PDF file
     */
    static async extractText(file: File): Promise<string> {
        // Store original console methods to restore later
        const originalError = console.error;
        const originalWarn = console.warn;
        
        try {
            // Suppress PDF.js worker errors (fake worker is acceptable)
            console.error = (...args: any[]) => {
                const msg = args[0]?.toString() || '';
                if (msg.includes('worker') || msg.includes('WorkerMessageHandler') || msg.includes('fake worker') || msg.includes('dynamically imported module')) {
                    return; // Suppress worker-related errors
                }
                originalError.apply(console, args);
            };
            
            console.warn = (...args: any[]) => {
                const msg = args[0]?.toString() || '';
                if (msg.includes('worker') || msg.includes('WorkerMessageHandler') || msg.includes('fake worker')) {
                    return; // Suppress worker-related warnings
                }
                originalWarn.apply(console, args);
            };

            // Dynamically import pdfjs-dist to avoid SSR issues
            const pdfjsLib = await import('pdfjs-dist');
            
            // Set worker source - use jsdelivr CDN (more reliable)
            if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
                // Use jsdelivr CDN - it's more reliable
                // The worker will fall back to fake worker if this fails, which still works
                pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.530/build/pdf.worker.min.js`;
            }

            // Read file as array buffer
            const arrayBuffer = await file.arrayBuffer();
            
            // Load PDF document
            const loadingTask = pdfjsLib.getDocument({ 
                data: arrayBuffer,
                useSystemFonts: true,
                verbosity: 0, // Suppress warnings
            });
            const pdf = await loadingTask.promise;
            
            let fullText = '';
            
            // Extract text from all pages (limit to first 10 pages for performance)
            const maxPages = Math.min(pdf.numPages, 10);
            for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                
                // Combine all text items
                const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(' ');
                
                fullText += pageText + '\n';
            }
            
            // Restore console methods
            console.error = originalError;
            console.warn = originalWarn;
            
            return fullText.trim();
        } catch (error) {
            // Restore console methods in case of error
            console.error = originalError;
            console.warn = originalWarn;
            
            // Only log non-worker errors
            const errorMsg = error?.toString() || '';
            if (!errorMsg.includes('worker') && !errorMsg.includes('WorkerMessageHandler')) {
                console.error('Error extracting PDF text:', error);
            }
            // Return empty string if extraction fails
            return '';
        }
    }

    /**
     * Generate summary from extracted text
     */
    static generateSummary(text: string, maxLength: number = 300): string {
        if (!text || text.trim().length === 0) {
            return 'No content could be extracted from this PDF.';
        }

        // Clean up text (remove excessive whitespace)
        const cleanedText = text.replace(/\s+/g, ' ').trim();
        
        // If text is shorter than maxLength, return as is
        if (cleanedText.length <= maxLength) {
            return cleanedText;
        }

        // Extract first paragraph or first maxLength characters
        // Try to find a good breaking point (sentence end)
        const truncated = cleanedText.substring(0, maxLength);
        const lastPeriod = truncated.lastIndexOf('.');
        const lastExclamation = truncated.lastIndexOf('!');
        const lastQuestion = truncated.lastIndexOf('?');
        
        const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
        
        if (lastSentenceEnd > maxLength * 0.5) {
            // Use sentence end if it's not too early
            return truncated.substring(0, lastSentenceEnd + 1) + '...';
        }
        
        // Otherwise, just truncate at word boundary
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > 0) {
            return truncated.substring(0, lastSpace) + '...';
        }
        
        return truncated + '...';
    }

    /**
     * Extract and summarize PDF content
     */
    static async extractAndSummarize(file: File): Promise<{ content: string; summary: string }> {
        const content = await this.extractText(file);
        const summary = this.generateSummary(content);
        
        return { content, summary };
    }
}

