import { NextResponse } from "next/server";
import { cloudinary } from "@/cloudinary/config";
import { Buffer } from "buffer";
import { PDFDocument } from "pdf-lib";
import { storeResumeInDB } from "@/lib/actions/general_actions";
import { getCurrentUser } from "@/lib/actions/auth_action";

const MAX_SIZE_BYTES = 1 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    const formData = await request.formData();
    const file = formData.get("file");
    
    const publicIdFromClient =
      user &&
      typeof user["resumePublicId"] !== "undefined" &&
      user["resumePublicId"] !== null
        ? user["resumePublicId"]
        : null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File must be 1MB or less" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const pdfDoc = await PDFDocument.load(fileBuffer);
    const pageCount = pdfDoc.getPageCount();

    if (pageCount > 2) {
      return NextResponse.json(
        { error: "PDF must have 2 pages or fewer" },
        { status: 400 }
      );
    }

    const filename = file.name;
    const base64 = fileBuffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const uploadOptions: Record<string, any> = {
      resource_type: "raw",
      filename_override: filename,
      folder: "resumes-interviewace",
    };

    if (
      typeof publicIdFromClient === "string" &&
      publicIdFromClient.trim() !== ""
    ) {
      const parts = publicIdFromClient.trim().split("/");
      const basePublicId = parts[parts.length - 1]; 
      
      uploadOptions.public_id = basePublicId;
      uploadOptions.overwrite = true;
    }

    const result = await cloudinary.uploader.upload(dataUri, uploadOptions);

    if(user){
      await storeResumeInDB({
        userId: user.id,
        pdfUrl: result.secure_url,
        public_id: result.public_id,
      });

      return NextResponse.json({
      success: true,
      message: "PDF uploaded successfully",
      pdfUrl: result.secure_url
    }, {status: 200});

    }else{
      return NextResponse.json({
      success: false,
      message: "Failed to store PDF",
    }, {status: 400});
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Upload failed", details: error.message, message: "Error uploading file" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ success: true, message: "Hi" });
}
