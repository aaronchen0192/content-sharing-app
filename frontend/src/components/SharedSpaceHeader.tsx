import { ContentCopy } from '@mui/icons-material';
import { TextField, IconButton } from '@mui/material';
import copyToClipboard from 'copy-to-clipboard';
import { toast } from 'react-toastify';

export default function SharedSpaceHeader() {
    return (
        <TextField
            label="Share Space URL"
            InputProps={{
                endAdornment: (
                    <IconButton
                        onClick={() => {
                            try {
                                copyToClipboard(window.location.href);
                            } catch (ex) {
                                console.error(ex);
                                toast.error('Copy Failed', {
                                    toastId: 'copy',
                                });
                            }
                        }}>
                        <ContentCopy />
                    </IconButton>
                ),
            }}
            variant="standard"
            value={window.location.href}
            fullWidth
        />
    );
}
