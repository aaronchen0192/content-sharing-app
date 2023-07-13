import React, { useState } from 'react';
import Countdown from 'react-countdown';
import { useMutation, useQuery } from 'react-query';
import { api } from '../api';
import { queryClient } from '../queryClient';
import { toast } from 'react-toastify';
import { FileUploader } from 'react-drag-drop-files';
import CommentIcon from '@mui/icons-material/Comment';
import {
    Typography,
    Stack,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from '@mui/material';

type SharedSpaceUploadedFileListProps = {
    sid?: string;
};

interface UploadedFile {
    name: string;
    key?: string;
    expire?: number;
}

const BYTES_LIMIT = 1000000;

const fileTypes = ['JPG', 'PNG', 'GIF', 'txt'];

export default function SharedSpaceUploadedFileList({
    sid,
}: SharedSpaceUploadedFileListProps) {
    const test: UploadedFile[] = [
        { name: 'f1', key: 'k1', expire: 100000 },
        { name: 'f2', key: 'k2', expire: 200000 },
        { name: 'f3', key: 'k3', expire: Date.now() + 300000 },
    ];

    return (
        <List>
            {test.map(file => (
                <ListItem
                    disableGutters
                    secondaryAction={
                        <IconButton aria-label="comment">
                            <CommentIcon />
                        </IconButton>
                    }>
                    <ListItemText
                        primary={`Line item ${file.name}`}
                        secondary={
                            !file?.expire ? (
                                'Uploading...'
                            ) : file?.expire ? (
                                <span>
                                    Expired in:{' '}
                                    <Countdown
                                        onComplete={() => {
                                            //queryClient.setQueryData(
                                            //TEXT_QUERY_KEY,
                                            //defaultState,
                                            //);
                                        }}
                                        renderer={({ minutes, seconds }) => (
                                            <span>
                                                {minutes} min {seconds} sec
                                            </span>
                                        )}
                                        date={file?.expire * 1000}
                                    />
                                </span>
                            ) : (
                                ''
                            )
                        }
                    />
                </ListItem>
            ))}
        </List>
    );
}
