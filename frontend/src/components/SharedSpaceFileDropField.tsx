import { FileUploader } from 'react-drag-drop-files';
import { queryClient } from '../queryClient';
import { UploadedFile } from '../types';
import { QUERY_FILES_KEY, api } from '../api';
import { uid } from 'uid';
import { toast } from 'react-toastify';

type SharedSpaceFileDropFieldProps = {
  sid?: string;
};

export default function SharedSpaceFileDropField({
  sid,
}: SharedSpaceFileDropFieldProps) {
  return (
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
  );
}
