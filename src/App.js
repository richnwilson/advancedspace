import { useEffect, useState } from 'react';
import './App.css';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [ stateVal, setStateVal ] = useState({
    title:"",
    file:""
  });

  const { title, file }  = stateVal

  const submit = async(e) => {
    e.preventDefault();
    const formData = new FormData()
    formData.append('title',title)
    formData.append('file',file)
  }
  return (
    <div className="flex items-center justify-center h-screen" onSubmit={submit}>
      <img src={`${process.env.PUBLIC_URL}/logo.webp`} alt="My App Logo" />
      <form>
        <h2 className="text-center m-4">Upload csv file to mongo and show uploads in browser</h2>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label htmlFor="title" className="block mb-2.5 text-sm font-medium text-heading">Title of file</label>
            <input onChange={(e) => setStateVal((prev) => ({ ...prev, title: e.target.value}))} type="text" id="title" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Title..." required />
          </div>
          <div>
            <label htmlFor="file" className="block mb-2.5 text-sm font-medium text-heading">Upload ...</label>
            <input onChange={(e) => setStateVal((prev) => ({ ...prev, file: e.target.files[0]}))} type="file" id="file" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" accept='application/csv' required />
          </div>
        </div>  
        <button type="submit" className="text-white bg-sky-500/50 box-border border border-transparent hover:bg-blue-500 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
          Submit
        </button>
      </form>
     
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
    </div>
  );
}

export default App;
