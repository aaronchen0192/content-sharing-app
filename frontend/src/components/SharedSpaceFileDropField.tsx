import { queryClient } from '../queryClient';
import { UploadedFile } from '../types';
import { QUERY_FILES_KEY, api } from '../api';
import { uid } from 'uid';
import { toast } from 'react-toastify';
import { Box, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import 'react-dropzone/examples/theme.css';
import React from 'react';
import { CloudUpload } from '@mui/icons-material';

type SharedSpaceFileDropFieldProps = {
  sid?: string;
};

export default function SharedSpaceFileDropField({
  sid,
}: SharedSpaceFileDropFieldProps) {
  const onDrop = React.useCallback(
    async (files: File[]) => {
      if (files.length > 5) {
        toast.error('Cannot upload more than 5 files at once');
        return;
      }

      const filesToUpload = files.map(file => ({
        file,
        metadata: {
          name: file.name,
          key: uid(16),
        },
      }));

      // create initial file content as loading status
      queryClient.setQueryData(QUERY_FILES_KEY(sid), (fl?: UploadedFile[]) => [
        ...(fl ?? []),
        ...filesToUpload.map(f => f.metadata),
      ]);

      for (const f of filesToUpload) {
        const {
          file,
          metadata: { key },
        } = f;

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
          queryClient.setQueryData(
            QUERY_FILES_KEY(sid),
            (fl?: UploadedFile[]) =>
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
            `Failed to upload ${file.name} - ${ex.message ?? 'UNKNOWN ERROR'}`,
          );

          // upload file success, update expire date
          queryClient.setQueryData(
            QUERY_FILES_KEY(sid),
            (fl?: UploadedFile[]) => (fl ?? []).filter(f => f.key !== key),
          );
        }
      }
    },
    [sid],
  );

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      maxFiles: 5,
      multiple: true,
      onDrop,
    });

  const isActive = isDragAccept || isFocused;
  return (
    <Box
      bgcolor={isActive ? 'action.selected' : 'action.hover'}
      borderColor={
        isDragReject ? 'error.main' : isActive ? 'primary.main' : undefined
      }
      color={
        isDragReject
          ? 'error.main'
          : isActive
          ? 'primary.main'
          : 'text.secondary'
      }
      {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      {isDragReject ? (
        <Typography color="error">
          You can only upload up to 5 files at once
        </Typography>
      ) : (
        <>
          <CloudUpload
            fontSize="large"
            color={isActive ? 'primary' : undefined}
          />
          <Typography align="center" color={isActive ? 'primary' : undefined}>
            Drag 'n' drop some files here, or click to select files
          </Typography>
        </>
      )}
    </Box>
  );
}
