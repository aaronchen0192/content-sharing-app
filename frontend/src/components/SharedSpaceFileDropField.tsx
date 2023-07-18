import { FileUploader } from 'react-drag-drop-files';
import { queryClient } from '../queryClient';
import { UploadedFile } from '../types';
import { QUERY_FILES_KEY, api } from '../api';
import { uid } from 'uid';
import { toast } from 'react-toastify';
import { styled } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import 'react-dropzone/examples/theme.css';
import { useCallback } from 'react';

type SharedSpaceFileDropFieldProps = {
  sid?: string;
};

const StyledFileUploaderContainer = styled('div')(({ theme }) => ({
  '& .file-uploader': {
    maxWidth: 'none !important',
    border: `2px dashed ${theme.palette.primary.main}`,
  },
}));

export default function SharedSpaceFileDropField({
  sid,
}: SharedSpaceFileDropFieldProps) {
  // const onDrop = useCallback(async (files: FileList) => {
  //   for (const file of files) {
  //     const key = uid(16);

  //     // create initial file content as loading status
  //     queryClient.setQueryData(QUERY_FILES_KEY, (fl?: UploadedFile[]) => [
  //       ...(fl ?? []),
  //       {
  //         name: file.name,
  //         key,
  //       },
  //     ]);
  //   }
  // }, []);

  // const { getRootProps, getInputProps } = useDropzone({
  //   maxFiles: 5,
  //   multiple: true,
  //   onDrop,
  // });

  return (
    <StyledFileUploaderContainer>
      {/* <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div> */}
      <FileUploader
        maxSize={15}
        classes="file-uploader"
        handleChange={async (files: FileList) => {
          if (files.length > 5) {
            toast.error('Cannot upload more than 5 files at once');
            return;
          }
          for (const file of files) {
            const key = uid(16);

            // create initial file content as loading status
            queryClient.setQueryData(QUERY_FILES_KEY, (fl?: UploadedFile[]) => [
              ...(fl ?? []),
              {
                name: file.name,
                key,
              },
            ]);

            try {
              // get s3 presigned url for post
              const { data: presignedUrl } = await api.get<string>(
                `file/upload/signed-url`,
                {
                  params: { sid, key, fileType: file.type },
                },
              );
              // post to s3
              await api.put(presignedUrl, file, {
                headers: {
                  'Content-Type': file.type,
                },
              });

              // post key for tracking
              const { data: expire } = await api.post(
                'file/key',
                JSON.stringify(file.name),
                {
                  params: { sid, key },
                },
              );

              // upload file success, update expire date
              queryClient.setQueryData(QUERY_FILES_KEY, (fl?: UploadedFile[]) =>
                (fl ?? []).map(f =>
                  f.key === key
                    ? {
                        ...f,
                        expire,
                      }
                    : f,
                ),
              );
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (ex: any) {
              toast.error(
                `Failed to upload ${file.name} - ${
                  ex.message ?? 'UNKNOWN ERROR'
                }`,
              );

              // upload file success, update expire date
              queryClient.setQueryData(QUERY_FILES_KEY, (fl?: UploadedFile[]) =>
                (fl ?? []).filter(f => f.key !== key),
              );
            }
          }
        }}
        multiple
      />
    </StyledFileUploaderContainer>
  );
}
