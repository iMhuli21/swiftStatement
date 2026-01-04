import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
  logoUploader: f({
    image: {
      maxFileCount: 1,
      maxFileSize: '4MB',
    },
  }).onUploadComplete(async ({ file }) => {
    console.log('upload complete.');
    return { file: file.name };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
