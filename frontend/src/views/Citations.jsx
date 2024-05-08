import Citation from '../components/Citation';
import NewCitationModal from '../components/NewCitationModal';
import { useEffect, useState } from 'react';
const Citations = () => {
  const [citations, setCitations] = useState([]);
  const [openAddCitation, setOpenAddCitation] = useState(false);
  useEffect(() => {
    const fetchCitations = async () => {
      try {
        const response = await fetch('http://localhost:3000/citations', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCitations(data.citations);
      } catch (error) {
        console.error('Failed to fetch citations:', error);
      }
    };
    fetchCitations();
  });
  const handleAddModalOpen = () => {
    setOpenAddCitation(true);
  };
  const handleAddModalClose = () => {
    setOpenAddCitation(false);
  };
  const handleModalClick = (event) => {
    event.stopPropagation();
  };
  return (
    <div className='flex flex-col m-2'>
      {openAddCitation && (
        <div
          className='fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:flex lg:items-center lg:justify-center'
          aria-hidden='true'
          onClick={handleAddModalClose}
        >
          <div
            onClick={handleModalClick}
            className='my-10 mx-8 p-5 bg-white rounded-lg shadow-lg max-w-md lg:w-1/4'
          >
            <NewCitationModal onClose={handleAddModalClose} />
          </div>
        </div>
      )}
      <h1 className='text-3xl mt-3'>Citations</h1>
      <button
        onClick={handleAddModalOpen}
        className='self-end bg-gray-200 px-3 py-1 rounded-xl drop-shadow-xl mx-4'
      >
        + Add Citation
      </button>
      <section className='lg:grid lg:grid-cols-4 lg:gap-4'>
        {citations.map((citation) => (
          <Citation key={citation.id} citation={citation} />
        ))}
      </section>
    </div>
  );
};
export default Citations;
