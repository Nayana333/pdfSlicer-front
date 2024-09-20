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

  return (
    <div style={{ backgroundColor: '#111827', minHeight: '100vh', padding: '24px' }}>
      <Toaster position="top-right" reverseOrder={false} />
      <nav style={{ height: '50px', width: '100%', backgroundColor: '#1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
        <img 
          src="/signature.png" 
          alt="Logo"
          style={{ height: '50px', width: 'auto' }} 
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaBars style={{ fontSize: '20px', color: 'white' }} />
          <FaBars style={{ fontSize: '25px', color: 'red' }} />
        </div>
      </nav>
  
      <div style={{ display: 'flex', marginTop: '32px' }}>
        <div style={{ 
          width: '700px', 
          marginRight: '32px', 
          position: 'sticky', 
          top: '20px', 
          height: 'calc(100vh - 70px)', 
          overflowY: 'auto', 
        }}>
          <div style={{ 
            backgroundColor: '#1f2937', 
            borderColor: '#374151', 
            borderWidth: '1px', 
            padding: '24px', 
            borderRadius: '16px', 
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' 
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              marginBottom: '24px', 
              textAlign: 'center', 
              backgroundClip: 'text', 
              background: 'linear-gradient(90deg, #3b82f6, #9333ea)', 
              color: 'white' 
            }}>
              Transform Your PDFs
            </h2>
  
            <form onSubmit={submitImage}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#ffffff' }} htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter PDF Title"
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#111827', color: '#ffffff' }} 
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
  
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#ffffff' }} htmlFor="fileUpload">
                  Choose PDF File
                </label>
                <input
                  type="file"
                  id="fileUpload"
                  accept="application/pdf"
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#111827', color: '#ffffff' }}
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
  
              <div>
                <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '30px', backgroundColor: '#ef4444', color: 'white', fontWeight: 'bold', border: 'none' }}>
                  <i className="bi bi-upload"></i> SUBMIT
                </button>
              </div>
            </form>
          </div>
  
          <div style={{ marginTop: '24px' }}>
            <h5 style={{ color: 'white' }}>Uploaded PDFs:</h5>
            <div>
              {allImage == null
                ? ''
                : allImage.map((data) => (
                    <div key={data._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', marginBottom: '8px' }}>
                      <h6 style={{ color: '#ffffff' }}>Title: {data.title}</h6>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: '8px', border: 'none' }} onClick={() => showPdf(data.pdf)}>
                          Show PDF
                        </button>
                        <button style={{ padding: '8px', backgroundColor: '#ef4444', color: '#ffffff', borderRadius: '8px', border: 'none' }} onClick={() => deletePdf(data._id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                ))}
            </div>
          </div>
        </div>
  
        {/* PdfComp Section */}
        <div style={{ flexGrow: 1, maxWidth: '60%', marginTop: '16px' }}>
          {pdfFile ? (
            <PdfComp pdfFile={pdfFile} />
          ) : (
            <div style={{ padding: '24px', backgroundColor: 'white', border: '1px solid #374151', borderRadius: '8px' }}>
              <p>No PDF selected.</p>
              <p>Please select a PDF from the uploaded list to view it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  
 
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