import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { queryClient } from './queryClient';
import { QueryClientProvider } from 'react-query';
import './index.css';
import Home from './pages/Home';
import SharedSpace from './pages/SharedSpace';
import CustomThemeProvider from './providers/CustomThemeProvider';
import Layout from './components/Layout';
import New from './pages/New';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/new',
        element: <New />,
      },
      {
        path: '/:sid',
        element: <SharedSpace />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <CustomThemeProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
        <ToastContainer />
      </CustomThemeProvider>
    </>
  );
}

export default App;
