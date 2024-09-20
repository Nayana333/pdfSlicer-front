
import { useState, useRef, useEffect } from "react";
import { Document, Page } from "react-pdf";
import axios from 'axios';
import { FaArrowUp } from 'react-icons/fa'; 

function PdfComp(props) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedPages, setSelectedPages] = useState([]);
  const containerRef = useRef(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current.scrollTop > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handlePageSelection = (pageNumber) => {
    if (selectedPages.includes(pageNumber)) {
      setSelectedPages(selectedPages.filter(page => page !== pageNumber));
    } else {
      setSelectedPages([...selectedPages, pageNumber]);
    }
  };

  const handleDownloadSelectedPages = async () => {
    if (selectedPages.length > 0) {
        try {
            const response = await axios.post(
                'http://localhost:5000/download-selected-pages',
                {
                    pdfFile: props.pdfFile.split('/').pop(),
                    selectedPages: selectedPages
                },
                { responseType: 'blob' } 
            );

            
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'selected_pages.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error downloading selected pages:", error);
        }
    } else {
        alert("No pages selected");
    }
  };

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="pdf-div" ref={containerRef}>
      <div className="instructions-container">
        <div className="instructions">Select pages to download</div>
        <button className="fixed-button" onClick={handleDownloadSelectedPages} style={{borderRadius:'20px'}}>
          Download Selected Pages
        </button>
      </div>
      <p>Page {pageNumber} of {numPages}</p>
      <Document file={props.pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (x, i) => i + 1).map((page) => (
         <div key={page} className="page-wrapper">
           <div className="page-container">
             <Page
               pageNumber={page}
               renderTextLayer={false}
               renderAnnotationLayer={false}
             />
             <div className="checkbox-wrapper">
               <input
                 type="checkbox"
                 checked={selectedPages.includes(page)}
                 onChange={() => handlePageSelection(page)}
               />
             </div>
           </div>
         </div>
        ))}
      </Document>
      {showScrollToTop && (
        <button className="scroll-to-top-button" onClick={scrollToTop}>
          <FaArrowUp />
        </button>
      )}
    </div>
  );
}

export default PdfComp;

