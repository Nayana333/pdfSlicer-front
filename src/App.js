import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { pdfjs } from 'react-pdf';
import PdfComp from './components/PdfComp';
import { FaBars, FaTrash } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function App() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState('');
  const [allImage, setAllImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    getPdf();
  }, []);

  const getPdf = async () => {
    const result = await axios.get('http://localhost:5000/get-files');
    console.log(result.data.data);
    setAllImage(result.data.data);
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    const result = await axios.post('http://localhost:5000/upload-files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    });
    if (result.data.status === 'OK') {
      toast.success('Uploaded successfully!');
      getPdf();
    }
  };

  const showPdf = (pdf) => {
    setPdfFile(`http://localhost:5000/files/${pdf}`);
  };

  const deletePdf = async (pdfId) => {
    try {
      await axios.delete(`http://localhost:5000/delete-file/${pdfId}`);
      getPdf();
      toast.success('Deleted successfully!');
    } catch (error) {
      toast.error('Error deleting PDF!');
    }
  };

  
  
 
}

export default App;

// return (
//   <div style={{backgroundColor:'red'}}>
//     <Toaster position="top-right" reverseOrder={false} />
// <nav className="navbar navbar-light" style={{ height: '50px', width: '100%' }}>
// <img 
//     src="/signature.png" 
//     alt="Logo"
//     style={{ height: '80px', width: 'auto' }} 
//   />
//   <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
//   <FaBars style={{ fontSize: '20px', color: 'black' }} />
//   <FaBars style={{ fontSize: '25px', color: 'red' }} />
//       </div>
// </nav>

//   <div className="container">
//     <div className="left-section">
//       <form className="formStyle p-4 shadow-lg  bg-light" onSubmit={submitImage}>
// <h4 className="text-center fw-bold text-uppercase mb-4 text-danger">Upload Your PDF</h4>

// <div className="mb-3">
//   <label htmlFor="title" className="form-label fw-bold">
//     Title
//   </label>
//   <input
//     type="text"
//     className="form-control"
//     id="title"
//     placeholder="Enter PDF Title"
//     required
//     onChange={(e) => setTitle(e.target.value)}
//   />
// </div>

// <div className="mb-3">
//   <label htmlFor="fileUpload" className="form-label fw-bold">
//     Choose PDF File
//   </label>
//   <input
//     type="file"
//     className="form-control"
//     id="fileUpload"
//     accept="application/pdf"
//     required
//     onChange={(e) => setFile(e.target.files[0])}
//   />
// </div>

// <div className="d-grid gap-2">
//   <button className="btn btn-danger btn-block fw-bold" type="submit" style={{borderRadius:"30px"}}>
//     <i className="bi bi-upload"></i> SUBMIT
//   </button>
// </div>
// </form>


//       <div className="uploaded">
//         <h5 style={{color:"white"}}>UPLOADED PDFs</h5>
//         <div className="output-div">
//           {allImage == null
//             ? ''
//             : allImage.map((data) => {
//                 return (
//                   <div className="inner-div" key={data._id}>
//                     <h6>Title: {data.title}</h6>
//                     <button className="btn btn-dark" onClick={() => showPdf(data.pdf)} style={{ marginRight: '5px' }}>
//                       Show PDF
//                     </button>
//                     <button className="btn btn-light" onClick={() => deletePdf(data._id)}>
//                       <FaTrash /> 
//                     </button>
//                   </div>
//                 );
//               })}
//         </div>
//       </div>
//     </div>

//     <div className="right-section">
//       {pdfFile ? (
//         <PdfComp pdfFile={pdfFile} />
//       ) : (
//         <div className="empty-message-container">
//     <p>No PDF selected.</p>
//     <p>Please select a PDF from the uploaded list to view and select.</p>
//     <img
//       src="/vecteezy_3d-cute-kid-character-confused-on-a-laptop_34618258.png" 
//       alt="No PDF"
//       style={{ width: '200px', height: 'auto', marginTop: '20px' }}
//     />
//   </div>
//       )}
//     </div>
//   </div>
//   </div>
// );