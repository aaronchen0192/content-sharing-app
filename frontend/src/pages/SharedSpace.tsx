import { Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import SharedSpaceHeader from '../components/SharedSpaceHeader';
import SharedSpaceTextField from '../components/SharedSpaceTextField';
import SharedSpaceFileDropField from '../components/SharedSpaceFileDropField';
import SharedSpaceUploadedFileList from '../components/SharedSpaceUploadedFileList';

export default function SharedSpace() {
  const { sid } = useParams();

  return (
    <Stack direction="column" spacing={4}>
      <SharedSpaceHeader />
      <SharedSpaceTextField sid={sid} />
      <div>
        <SharedSpaceFileDropField sid={sid} />
        <SharedSpaceUploadedFileList sid={sid} />
      </div>
      <Typography textAlign="center" maxWidth="100%" color="textPrimary">
        You can text or upload files by drag or click and share the link with
        others. Each piece of content will automatically expire after 15 minutes
      </Typography>
    </Stack>
  );
}
