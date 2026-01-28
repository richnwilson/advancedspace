import { useEffect, useState, useRef } from 'react';
import common from '../helpers/common';
import axios from 'axios';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis,  
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const Data = () => {
  const [ stateVal, setStateVal ] = useState({
    loading: true,
    title:"",
    file:"",
    allFiles: null,
    isData: false,
    dataJSON: []
  });
  const { title, file, allFiles, loading, isData, dataJSON }  = stateVal

  const formRef = useRef(null)

  useEffect(() => {
    getAllFiles()
    setStateVal((prev) => ({ ...prev, loading: false}))
  }, [])

  const getAllFiles = async () => {
    try {
      const { data: { status = "false", data = []}} = await axios.get(`${process.env.REACT_APP_BACKEND}:5000/getFiles`);
      if (status === 'ok') {
        setStateVal((prev) => ({ ...prev, allFiles: data}))
      }
    } catch (e) {
      common.displayMessage('error',e?.response?.data || 'Error showing files')
    }
  }

  const plotdata = async (filename) => {
    try {
       const { data: { status = "false", data = []}} = await axios.get(`${process.env.REACT_APP_BACKEND}:5000/getFile/${filename}`);
       const dataJSON = typeof data === 'string' ? JSON.parse(data) : data;
       setStateVal((prev) => ({ ...prev, dataJSON, isData: true}))
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
      const result = await axios.post(`${process.env.REACT_APP_BACKEND}:5000/uploadFile`,formData, { headers: { "Content-Type": "multipart/form-data"}})
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
    <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-2">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Advanced Space" className="mx-auto h-10 w-auto" />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">Upload csv file to mongo and show uploads in browser</h2>
    </div>  
      <h2 className="text-center m-8"></h2>
      <div className="flex items-center justify-center">
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
        { !allFiles || allFiles.length === 0 ? <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert"><span className="font-medium">No datasets available</span></div> : allFiles.map(({title, filename}) => {
          return (
            <div key = {title} href="/#" className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs hover:bg-neutral-secondary-medium">
              <h5 className="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">{title}</h5>
              <button onClick={() => plotdata(filename)} type="button" className="text-white bg-sky-500/50 box-border border border-transparent hover:bg-blue-500 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                Plot
              </button>
            </div>
          )
        })
        }
      </div>
      { isData && 
        <div className="mt-4 flex items-center justify-evenly">
          <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  
                  {/* Define your Axes and map them to keys in your JSON */}
                  <XAxis type="number" dataKey="X" name="Stature" unit="cm" />
                  <YAxis type="number" dataKey="Y" name="Weight" unit="kg" />
                  
                  {/* Tooltip shows data on hover */}
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  
                  {/* The Scatter plot itself */}
                  <Scatter name="User Data" data={dataJSON} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>        
        </div>
      }
    </>
  );
}

export default Data;