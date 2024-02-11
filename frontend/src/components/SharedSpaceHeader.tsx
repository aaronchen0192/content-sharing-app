import { ContentCopy, Share } from '@mui/icons-material';
import { TextField, IconButton, Tooltip } from '@mui/material';
import CopyButton from './CopyButton';

type SharedSpaceHeaderProps = {
  sid?: string;
};

export default function SharedSpaceHeader({ sid }: SharedSpaceHeaderProps) {
  return (
    <TextField
      helperText="You can enter any text or upload files and share the link with others.
    All content will be automatically deleted forever after 15 minutes."
      InputProps={{
        endAdornment: (
          <>
            <Tooltip title="Share">
              <IconButton
                onClick={async () => {
                  try {
                    await navigator.share({
                      title: `SharedSpace - ${sid}`,
                      url: window.location.href,
                    });
                  } catch (ex) {
                    console.error(ex);
                  }
                }}>
                <Share />
              </IconButton>
            </Tooltip>
            <CopyButton copyValue={window.location.href}>
              <ContentCopy />
            </CopyButton>
          </>
        ),
      }}
      variant="standard"
      value={window.location.href}
      fullWidth
    />
  );
}
