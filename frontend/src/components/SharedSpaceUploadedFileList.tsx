import Countdown from 'react-countdown';
import { useQuery } from 'react-query';
import { queryClient } from '../queryClient';
import {
  Typography,
  List,
  ListItemText,
  Grow,
  ListItem,
  IconButton,
  Tooltip,
  ListItemAvatar,
  Avatar,
  LinearProgress,
} from '@mui/material';
import { FileDownload, Source } from '@mui/icons-material';
import { QUERY_FILES_KEY, api, baseUrl } from '../api';
import { UploadedFile } from '../types';

export type SharedSpaceUploadedFileListProps = {
  sid?: string;
};

export default function SharedSpaceUploadedFileList({
  sid,
}: SharedSpaceUploadedFileListProps) {
  const { data, isFetched, isError } = useQuery<UploadedFile[]>(
    QUERY_FILES_KEY(sid),
    () => api.get('/file/list', { params: { sid } }).then(d => d.data),
    {
      initialData: [],
    },
  );

  if (isError) {
    return <Typography color="error">Failed to load file contents</Typography>;
  }
  if (!data || !isFetched) {
    return <LinearProgress />;
  }

  return (
    <List>
      {data.map((file, i) => (
        <Grow
          in
          key={file.key}
          timeout={{
            enter: (i + 1) * 250,
          }}>
          <ListItem
            divider
            secondaryAction={
              <Tooltip title="View/Download Content">
                <IconButton
                  component="a"
                  href={`${baseUrl}/file/retrieve/signed-url?sid=${sid}&key=${file.key}`}
                  target="_blank">
                  <FileDownload color="action" />
                </IconButton>
              </Tooltip>
            }>
            <ListItemAvatar>
              <Avatar>
                <Source />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography color="textPrimary">{file.name}</Typography>}
              secondary={
                !file?.expire ? (
                  'Uploading...'
                ) : (
                  <span>
                    Expired in:{' '}
                    <Countdown
                      onComplete={() => {
                        const now = Date.now() / 1000;
                        queryClient.setQueryData(
                          QUERY_FILES_KEY(sid),
                          (fl?: UploadedFile[]) =>
                            fl?.filter(f => now <= (f.expire ?? 0)) ?? [],
                        );
                      }}
                      renderer={({ minutes, seconds }) => (
                        <span>
                          {minutes} min {seconds} sec
                        </span>
                      )}
                      date={file?.expire * 1000}
                    />
                  </span>
                )
              }
            />
          </ListItem>
        </Grow>
      ))}
    </List>
  );
}
