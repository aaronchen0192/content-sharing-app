import Countdown from 'react-countdown';
import { useQuery } from 'react-query';
import { queryClient } from '../queryClient';
import {
    Typography,
    Stack,
    List,
    ListItemText,
    Skeleton,
    Grow,
    ListItem,
    IconButton,
    Tooltip,
    ListItemAvatar,
    Avatar,
} from '@mui/material';
import { FileDownload, Source } from '@mui/icons-material';
import { QUERY_FILES_KEY, api } from '../api';
import { UploadedFile } from '../types';

export type SharedSpaceUploadedFileListProps = {
    sid?: string;
};

export default function SharedSpaceUploadedFileList({
    sid,
}: SharedSpaceUploadedFileListProps) {
    const { data, isFetched, isError } = useQuery<UploadedFile[]>(
        QUERY_FILES_KEY,
        () => api.get('/keys', { params: { sid } }).then(d => d.data),
        {
            initialData: [
                {
                    name: 'f1',
                    key: 'k1',
                    expire: Date.now() / 1000 + 15,
                },
            ],
        },
        // () =>
        //     // todo: replace with axios get file list
        //     new Promise(resolve =>
        //         setTimeout(() => {
        //             resolve([
        //                 {
        //                     name: 'f1',
        //                     key: 'k1',
        //                     expire: Date.now() / 1000 + 15,
        //                 },
        //                 {
        //                     name: 'f2',
        //                     key: 'k2',
        //                     expire: Date.now() / 1000 + 20,
        //                 },
        //                 {
        //                     name: 'f3',
        //                     key: 'k3',
        //                     expire: Date.now() / 1000 + 10,
        //                 },
        //             ]);
        //         }, 1000 * 2),
        //     ),
        // {
        //     initialData: [],
        // },
    );

    if (isError) {
        return (
            <Typography color="error">
                Failed to load upload contents
            </Typography>
        );
    }
    if (!data || !isFetched) {
        return (
            <Stack mt={2} spacing={2}>
                <Skeleton variant="rounded" height="35px" />
                <Skeleton variant="rounded" height="35px" />
                <Skeleton variant="rounded" height="35px" />
                <Skeleton variant="rounded" height="35px" />
            </Stack>
        );
    }

    const onDownloadFile = () => {
        window.open(`http://www.example.com?sid=${sid}`, '_blank');
    };

    return (
        <List>
            {data.map(file => (
                <Grow in key={file.key}>
                    <ListItem
                        divider
                        secondaryAction={
                            <Tooltip title="Download Content">
                                <IconButton onClick={onDownloadFile}>
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
                            primary={`Line item ${file.name}`}
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
                                                    QUERY_FILES_KEY,
                                                    (fl?: UploadedFile[]) =>
                                                        fl?.filter(
                                                            f =>
                                                                now <=
                                                                (f.expire ?? 0),
                                                        ) ?? [],
                                                );
                                            }}
                                            renderer={({
                                                minutes,
                                                seconds,
                                            }) => (
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
