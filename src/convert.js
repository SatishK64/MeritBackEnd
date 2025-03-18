import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

/**
 * Converts the first page of a PDF file to a PNG image
 * @param {string} pdfPath - Path to the PDF file
 * @returns {Promise<string>} - Path to the generated PNG file
 */
export async function convertFirstPageToPng(pdfPath) {
  // Get the directory and filename without extension
  const directory = path.dirname(pdfPath);
  const baseFilename = path.basename(pdfPath, '.pdf');
  const outputPath = path.join(directory, `${baseFilename}.png`);

  try {
    console.log(`Converting PDF to PNG: ${pdfPath}`);
    
    // Use pdftoppm (from poppler) to convert PDF to PNG
    // -f 1 -l 1: Process only the first page
    // -png: Output in PNG format
    // -singlefile: Generate a single file (don't add page numbers to filename)
    const { stdout, stderr } = await execPromise(
      `pdftoppm -f 1 -l 1 -png -singlefile "${pdfPath}" "${path.join(directory, baseFilename)}"`
    );
    
    if (stderr) {
      console.warn('Conversion warning:', stderr);
    }
    
    // console.log(`PNG saved: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Error converting PDF to PNG:', error);
    throw error;
  }
}

export default convertFirstPageToPng;