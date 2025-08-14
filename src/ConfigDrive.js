import { google } from "googleapis";
import {Readable} from "stream";
import dotenv from 'dotenv'

dotenv.config()

const o2auth = new google.auth.OAuth2(
    `${process.env.CLIENT_ID}`,
    `${process.env.CLIENT_SECRET}`,
    `${process.env.REDIRECT_URL}`
)
o2auth.setCredentials({refresh_token: `${process.env.REFRESH_TOKEN}`});
const drive = google.drive({
    version:'v3',
    auth: o2auth
});

export async function Upload(buffer,mimetype,name) {
    const metadata={
          name: name,
          parents:[`${process.env.PARENTFOLDER}`]
        }
    const media={
        mimeType: mimetype,
        body: Readable.from(buffer)
    }
    try{
        const res = await drive.files.create({
                    resource: metadata,
                    media: media,
                    fields: "id"
                    }
        );
        if (!res.data){
            return new Error("Upload Failed");
        }
        console.log(res.data);
        return res.data;
    }catch(e){
        console.error("Error uploading:", e);
        throw e;
    }
    
}
export default drive;
