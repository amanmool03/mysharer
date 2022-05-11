import express from "express";
import multer from "multer";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import File from "../models/File";
import https from "https";
import nodemailer from "nodemailer";
import createEmailTemplate from "../utils/createEmailTemplate";

const router = express.Router();

//setup storage for multer
const storage = multer.diskStorage({});

let upload = multer({
  storage,
});

router.post("/upload", upload.single("myFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Pls import file" });
    }
    console.log(req.file);
    let uploadedFile: UploadApiResponse;

    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "shareme",
        resource_type: "auto", //accept any type default ma image and video
      });
    } catch (error: any) {
      console.log(error.message);
      return res.status(400).json({ message: "Cloudinary error" });
    }
    const { originalname } = req.file;
    const { secure_url, bytes, format } = uploadedFile;

    const file = await File.create({
      filename: originalname,
      sizeInByte: bytes,
      secure_url,
      format,
    });
    res.status(200).json({
      id: file._id,
      downloadPageLink: `${process.env.API_BASE_ENDPOINT_CLIENT}download/${file._id}`,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: "file not found" });
    }

    const { filename, sizeInByte, format } = file;
    res.status(200).json({
      name: filename,
      sizeInByte,
      format,
      id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:id/download", async (req, res) => {
  try {
    const id = req.params.id;
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: "file not found" });
    }

    https.get(file.secure_url, (fileStream) => fileStream.pipe(res));
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/email", async (req, res) => {
  const { id, emailFrom, emailTo } = req.body;

  // check if file exists
  const file = await File.findById(id);
  if (!file) {
    return res.status(404).json({ message: "file not found" });
  }

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    // @ts-ignore
    host: process.env.SENDINBLUE_SMTP_HOST!,
    port: process.env.SENDINBLUE_SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SENDINBLUE_SMTP_USER, // generated ethereal user
      pass: process.env.SENDINBLUE_SMTP_PASSWORD, // generated ethereal password
    },
  });

  // Prepare the email data

  const { filename, sizeInByte } = file;
  const fileSize = `${(Number(sizeInByte) / (1024 * 1024)).toFixed(2)} MB`;
  const downloadPageLink = `${process.env.API_BASE_ENDPOINT_CLIENT}download/${id}`;

  // send mail with defined transport object
  const mailOptions = {
    from: emailFrom, // sender address
    to: emailTo, // list of receivers
    subject: "File Shared with you", // Subject line
    text: `${emailFrom} send a file with you`, // plain text body
    html: createEmailTemplate(emailFrom, downloadPageLink, filename, fileSize), // html body
  };

  // send mail with defined transport object
  await transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error bhayecha guys" });
    }
    file.sender = emailFrom;
    file.receiver = emailTo;

    await file.save();
    return res.status(200).json({ message: "Email sent", data: file });
  });
});

export default router;
