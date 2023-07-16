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
      handleChange={(files: FileList) => {
        if (files.length > 5) {
          toast.error('Cannot upload more than 5 files at once');
          return;
        }

        for (const file of files) {
          const key = uid(16);

          // make it display uploading first
          // thats why no expire
          queryClient.setQueryData(QUERY_FILES_KEY, (fl?: UploadedFile[]) => [
            ...(fl ?? []),
            {
              name: file.name,
              key,
            },
          ]);

          api.post('/upload', { params: { sid, key, file } }).then(d => {
            const expire = d.data as number;
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
          });
        }
      }}
      multiple
    />
  );
}
