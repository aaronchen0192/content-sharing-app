import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import SharedSpaceHeader from './SharedSpaceHeader';

export default function SharedSpace() {
    const { id = 'unknown' } = useParams();

    return (
        <Container maxWidth="sm">
            <SharedSpaceHeader />
        </Container>
    );
}
