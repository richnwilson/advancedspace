import { useEffect, useState, useRef } from 'react';
import './App.css';
import { ToastContainer} from 'react-toastify';
import common from './helpers/common';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function App() {
  const [ stateVal, setStateVal ] = useState({
    loading: true,
    title:"",
    file:"",
    allFiles: null
  });
  const { title, file, allFiles, loading }  = stateVal

  const formRef = useRef(null)

  useEffect(() => {
    getAllFiles()
    setStateVal((prev) => ({ ...prev, loading: false}))
  }, [])

  const getAllFiles = async () => {
    try {
      const { data: { status = "false", data = []}} = await axios.get("http://localhost:5000/getFiles");
      if (status === 'ok') {
        setStateVal((prev) => ({ ...prev, allFiles: data}))
      }
    } catch (e) {
      common.displayMessage('error',e?.response?.data || 'Error showing files')
    }
  }

  const plotdata = async (filename) => {
    try {
       const { data: { status = "false", data = []}} = await axios.get(`http://localhost:5000/getFile/${filename}`);
    } catch (e) {
      common.displayMessage('error',e?.response?.data || 'Error plotting data')
    }
  }
  const submit = async(e) => {
    try {
      e.preventDefault();
      const formData = new FormData()
      formData.append('title',title)
      formData.append('file',file)
      const result = await axios.post("http://localhost:5000/uploadFile",formData, { headers: { "Content-Type": "multipart/form-data"}})
      if (formRef.current) {
        formRef.current.reset();
      }
      await getAllFiles()
      common.displayMessage('success',result.data)
    } catch(e) {
      common.displayMessage('error',e?.response?.data || '')
    }
  }

  if (loading) return <div className="dot-pulse"></div>
  
  return (
    <>
      <h2 className="text-center m-8">Upload csv file to mongo and show uploads in browser</h2>
      <div className="flex items-center justify-center">
        <img src={`${process.env.PUBLIC_URL}/logo.webp`} alt="My App Logo" />
        <form ref={formRef} onSubmit={submit}>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label htmlFor="title" className="block mb-2.5 text-sm font-medium text-heading">Title of file</label>
              <input onChange={(e) => setStateVal((prev) => ({ ...prev, title: e.target.value}))} type="text" id="title" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Title..." required />
            </div>
            <div>
              <label htmlFor="file" className="block mb-2.5 text-sm font-medium text-heading">Upload ...</label>
              <input onChange={(e) => setStateVal((prev) => ({ ...prev, file: e.target.files[0]}))} type="file" id="file" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" accept=".csv, text/csv" required />
            </div>
          </div>  
          <button type="submit" className="text-white bg-sky-500/50 box-border border border-transparent hover:bg-blue-500 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
            Submit
          </button>
        </form>
      </div>
      <h2 className="text-center m-8">Pick a dataset to plot</h2>
      <div className="mt-4 flex items-center justify-evenly">
        { allFiles === null ? "" : allFiles.map(({title, filename}) => {
          return (
            <a href="/#" className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs hover:bg-neutral-secondary-medium">
              <h5 class="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">{title}</h5>
              <button onClick={() => plotdata(filename)} type="button" className="text-white bg-sky-500/50 box-border border border-transparent hover:bg-blue-500 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                Plot
              </button>
            </a>
          )
        })
        }
      </div>
      <div className="mt-4 flex items-center justify-evenly">
        
      </div>
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
