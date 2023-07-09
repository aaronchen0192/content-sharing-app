import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from 'react-router-dom';
import SharedSpace from './components/SharedSpace';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { queryClient } from './queryClient';
import { QueryClientProvider } from 'react-query';

const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const generateId = () => {
    let id = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters[randomIndex];
    }

    return id;
};

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/new',
        element: <Navigate to={`/${generateId()}`} replace />,
    },
    {
        path: '/:sid',
        element: <SharedSpace />,
    },
]);

function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
            <ToastContainer />
        </>
    );
}

function Home() {
    return (
        <div>
            <h2>Hello World</h2>
        </div>
    );
}

export default App;
