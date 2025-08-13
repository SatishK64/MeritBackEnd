import fs from 'fs';
import path from 'path';

import {pdfToPng} from 'pdf-to-png-converter';
import util from 'util';


export async function convertFirstPageToPng(pdfPath) {
  // Get the directory and filename without extension
  const directory = path.dirname(pdfPath);
  const baseFilename = path.basename(pdfPath, '.pdf');
  const outputPath = path.join(directory, `${baseFilename}.png`);
  console.log(directory)
  try {
    const pngPages = await pdfToPng(pdfPath, { // The function accepts PDF file path or a Buffer
        viewportScale: 0.75, // The desired scale of PNG viewport. Default value is 1.0 which means to display page on the existing canvas with 100% scale.
        pagesToProcess: [1], // Subset of pages to convert (first page = 1), other pages will be skipped if specified.
        strictPagesToProcess: true, // When `true`, will throw an error if specified page number in pagesToProcess is invalid, otherwise will skip invalid page. Default value is false.
        verbosityLevel: 0, // Verbosity level. ERRORS: 0, WARNINGS: 1, INFOS: 5. Default value is 0.
    });
    if (pngPages && pngPages.length > 0) {
      fs.writeFileSync(outputPath, pngPages[0].content);
      console.log('File saved manually:', outputPath);
    }
    
    return outputPath;
  } catch (error) {
    console.error('Error converting PDF to PNG:', error);
    throw error;
  }
}

export default convertFirstPageToPng;