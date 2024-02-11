import { ContentCopy, DoneAll } from '@mui/icons-material';
import { ButtonProps, IconButton, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import copyToClipboard from 'copy-to-clipboard';

type CopyButtonProps = ButtonProps & {
  copyValue?: string | null;
};

const CopyButton = ({ copyValue, ...props }: CopyButtonProps) => {
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        setSuccess(false);
      }, 1500);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [success]);

  return (
    <Tooltip title="Copy">
      <IconButton
        {...props}
        onClick={async () => {
          if (copyValue) {
            try {
              copyToClipboard(copyValue);
              setSuccess(true);
            } catch (ex) {
              console.error(ex);
            }
          }
        }}>
        {success ? <DoneAll color="success" /> : <ContentCopy />}
      </IconButton>
    </Tooltip>
  );
};

export default CopyButton;
