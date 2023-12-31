import {
  Grow,
  IconButton,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import Countdown from 'react-countdown';
import { useMutation, useQuery } from 'react-query';
import { TEXT_QUERY_KEY, api } from '../api';
import { queryClient } from '../queryClient';
import { toast } from 'react-toastify';
import { TextContent } from '../types';
import copyToClipboard from 'copy-to-clipboard';
import { ContentCopy } from '@mui/icons-material';

const defaultState: TextContent = {
  value: '',
};

type SharedSpaceTextFieldProps = {
  sid?: string;
};

export default function SharedSpaceTextField({
  sid,
}: SharedSpaceTextFieldProps) {
  const theme = useTheme();
  const { data, isFetched, isError } = useQuery<TextContent>(
    TEXT_QUERY_KEY(sid),
    () => api.get('/text', { params: { sid } }).then(d => d.data),
    {
      enabled: Boolean(sid),
    },
  );

  const { mutateAsync, isLoading: isMutationLoading } = useMutation(
    (data: string) =>
      api
        .post('/text', JSON.stringify(data), { params: { sid } })
        .then(d => d.data as number),
  );

  const [debounceValue, setDebounceValue] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (debounceValue !== null) {
      const timeout = setTimeout(() => {
        queryClient.setQueryData(
          TEXT_QUERY_KEY(sid),
          (s: TextContent | undefined) => ({
            ...s,
            value: debounceValue,
          }),
        );

        mutateAsync(debounceValue, {
          onSuccess: expire => {
            queryClient.setQueryData(
              TEXT_QUERY_KEY(sid),
              (s: TextContent | undefined) => ({
                ...s,
                expire,
              }),
            );
          },
          onError: () => {
            toast.error('Failed to save!');
          },
        });
      }, 250);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [debounceValue, mutateAsync, sid]);

  if (!isFetched) {
    return <Skeleton variant="rounded" width="100%" height="125px" />;
  }

  if (isError) {
    return (
      <Typography color="error">
        Failed to fetch content, please try again later!
      </Typography>
    );
  }

  return (
    <Grow in>
      <TextField
        autoFocus
        sx={{
          '& .MuiInputBase-root': {
            bgcolor: theme.palette.mode === 'dark' ? 'action.hover' : undefined,
          },
        }}
        label="Type anything!"
        helperText={
          isMutationLoading ? (
            'Saving...'
          ) : data?.expire ? (
            <span>
              Expired in:{' '}
              <Countdown
                onComplete={() => {
                  queryClient.setQueryData(TEXT_QUERY_KEY(sid), defaultState);
                  setDebounceValue(null);
                }}
                renderer={({ minutes, seconds }) => (
                  <span>
                    {minutes} min {seconds} sec
                  </span>
                )}
                date={data?.expire * 1000}
              />
            </span>
          ) : (
            ''
          )
        }
        multiline
        minRows={4}
        maxRows={15}
        fullWidth
        value={debounceValue ?? data?.value ?? ''}
        InputProps={{
          endAdornment: (
            <Tooltip title="Copy">
              <IconButton
                onClick={async () => {
                  try {
                    copyToClipboard(debounceValue ?? '');
                  } catch (ex) {
                    console.error(ex);
                  }
                }}>
                <ContentCopy />
              </IconButton>
            </Tooltip>
          ),
        }}
        onChange={e => {
          if (e.target.value.length < 10000) {
            setDebounceValue(e.target.value);
          } else {
            toast.error('Text reach limit 10000');
          }
        }}
      />
    </Grow>
  );
}
