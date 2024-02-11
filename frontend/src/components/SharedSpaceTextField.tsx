import {
  FormControl,
  FormHelperText,
  Grow,
  InputLabel,
  OutlinedInput,
  Paper,
  Skeleton,
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
import { ContentCopy } from '@mui/icons-material';
import CopyButton from './CopyButton';

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

  const label = 'Type anything here to share!';
  return (
    <Grow in>
      <FormControl variant="outlined" fullWidth>
        <Paper elevation={2}>
          <InputLabel htmlFor="my-input">{label}</InputLabel>
          <OutlinedInput
            sx={{
              '& .MuiInputBase-root': {
                bgcolor:
                  theme.palette.mode === 'dark' ? 'action.hover' : undefined,
              },
            }}
            label={label}
            multiline
            minRows={5}
            maxRows={15}
            fullWidth
            autoFocus
            id="my-input"
            aria-describedby="my-helper-text"
            value={debounceValue ?? data?.value ?? ''}
            endAdornment={
              <CopyButton
                sx={{ alignSelf: 'flex-end' }}
                size="small"
                copyValue={debounceValue ?? data?.value ?? ''}>
                <ContentCopy />
              </CopyButton>
            }
            onChange={e => {
              if (e.target.value.length < 10000) {
                setDebounceValue(e.target.value);
              } else {
                toast.error('Text reach limit 10000');
              }
            }}
          />
        </Paper>
        <FormHelperText id="my-helper-text">
          {isMutationLoading ? (
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
          )}
        </FormHelperText>
      </FormControl>
    </Grow>
  );
}
