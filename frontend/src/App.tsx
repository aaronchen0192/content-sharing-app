import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from 'react-router-dom';
import SharedSpace from './components/SharedSpace';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        path: '/:id',
        element: <SharedSpace />,
    },
]);

function App() {
    return (
        <>
            <RouterProvider router={router} />
            <ToastContainer />
        </>
    );
}

function Home() {
    return (
        <div>
            <h2>Home</h2>
        </div>
    );
}

export default App;
