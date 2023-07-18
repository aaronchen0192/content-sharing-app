import { Box, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import SharedSpaceHeader from '../components/SharedSpaceHeader';
import SharedSpaceTextField from '../components/SharedSpaceTextField';
import SharedSpaceFileDropField from '../components/SharedSpaceFileDropField';
import SharedSpaceUploadedFileList from '../components/SharedSpaceUploadedFileList';

export default function SharedSpace() {
  const { sid } = useParams();

  return (
    <Stack direction="column" spacing={2} alignItems="center">
      <SharedSpaceHeader sid={sid} />

      <SharedSpaceTextField sid={sid} />
      <Box width="100%">
        <SharedSpaceFileDropField sid={sid} />
        <SharedSpaceUploadedFileList sid={sid} />
      </Box>
    </Stack>
  );
}
