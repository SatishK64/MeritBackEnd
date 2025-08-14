import drive from './ConfigDrive.js';
import dotenv from 'dotenv'
import {Readable} from "stream";
import {pdfToPng} from 'pdf-to-png-converter';


dotenv.config();

export async function convertFirstPageToPng(buffer,originalname) {
  try {
    const pngPage = await pdfToPng(buffer, { // The function accepts PDF file path or a Buffer
        viewportScale: 0.75, // The desired scale of PNG viewport. Default value is 1.0 which means to display page on the existing canvas with 100% scale.
        pagesToProcess: [1], // Subset of pages to convert (first page = 1), other pages will be skipped if specified.
        strictPagesToProcess: true, // When `true`, will throw an error if specified page number in pagesToProcess is invalid, otherwise will skip invalid page. Default value is false.
        verbosityLevel: 0, // Verbosity level. ERRORS: 0, WARNINGS: 1, INFOS: 5. Default value is 0.
    });
    if (pngPage && pngPage.length > 0) {
        const metadata={
          name: `${originalname}.png`,
          parents:[`${process.env.PARENTFOLDER}`]

        }
        const media={
          mimeType: "image/png",
          body: Readable.from(Buffer.from(pngPage[0].content))
        }
        try{

          const res = await drive.files.create({
            resource: metadata,
            media: media,
            fields: "id"
          });
          if(!res.data){
            return new Error("Upload error");
          }
          return res.data
        }catch(e){
          console.error("Error",e);
          throw e;
        }
      return res.data;
    }
  } catch (error) {
    console.error('Error converting PDF to PNG:', error);
    throw error;
  }
}

export default convertFirstPageToPng;