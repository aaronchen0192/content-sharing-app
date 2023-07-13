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

type SharedSpaceFileDropFieldProps = {
    sid?: string;
};

const BYTES_LIMIT = 1000000;

const fileTypes = ['JPG', 'PNG', 'GIF', 'txt'];

export default function SharedSpaceFileDropField({
    sid,
}: SharedSpaceFileDropFieldProps) {
    const [files, setFile] = useState<File[] | null>(null);

    return (
        <FileUploader
            handleChange={(files: FileList) => {
                const fileArr: File[] = [];

                for (const file of files) {
                    fileArr.push(file);
                }
                setFile(fileArr);
            }}
            multiple
            types={fileTypes}
        />
    );
}
