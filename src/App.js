import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/auth.js';
import Data from './pages/data.js';
import ProtectedRoute from './pages/protectedroute.js';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/data" replace />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/data" element={<Data />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
      />
    </>
  );
}

export default App;
