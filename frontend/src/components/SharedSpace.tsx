import { Container, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import SharedSpaceHeader from './SharedSpaceHeader';
import SharedSpaceTextField from './SharedSpaceTextField';
import SharedSpaceFileDropField from './SharedSpaceFileDropField';
import SharedSpaceUploadedFileList from './SharedSpaceUploadedFileList';

export default function SharedSpace() {
  const { sid } = useParams();

  return (
    <Container maxWidth="sm">
      <Stack direction="column" spacing={4}>
        <SharedSpaceHeader />
        <SharedSpaceTextField sid={sid} />
        <div>
          <SharedSpaceFileDropField sid={sid} />
          <SharedSpaceUploadedFileList sid={sid} />
        </div>
      </Stack>
    </Container>
  );
}
