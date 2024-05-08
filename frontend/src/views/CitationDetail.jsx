import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditCitationModal from '../components/EditCitationModal';
const CitationDetail = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const [citation, setCitation] = useState('');
  const [source, setSource] = useState('');
  const [openEditCitation, setOpenEditCitation] = useState(false);
  useEffect(() => {
    const fetchCitation = async () => {
      try {
        const response = await fetch(`http://localhost:3000/citation/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCitation(data.citation);
      } catch (error) {
        console.error('Failed to fetch source:', error);
      }
    };
    fetchCitation();
  }, [id]);
  useEffect(() => {
    const fetchSource = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/source/${citation.sourceId}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSource(data.source);
      } catch (error) {
        console.error('Failed to fetch source:', error);
      }
    };
    fetchSource();
  }, [id, citation.sourceId]);
  const handleEditModalOpen = () => {
    setOpenEditCitation(true);
  };
  const handleEditModalClose = () => {
    setOpenEditCitation(false);
  };
  const reloadCitation = async () => {
    try {
      const response = await fetch(`http://localhost:3000/citation/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Reloading', source);
      setCitation(data.citation);
    } catch (error) {
      console.error('Failed to reload source:', error);
    }
  };
  const handleModalClick = (event) => {
    event.stopPropagation();
  };
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <main className='lg:flex lg:justify-center'>
      <div className='flex flex-col lg:w-1/2'>
        <button
          onClick={handleBackClick}
          className='px-3 py-1 m-3 self-start underline'
        >
          <p>Back</p>
        </button>
        {openEditCitation && (
          <div
            className='fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:flex lg:items-center lg:justify-center'
            aria-hidden='true'
            onClick={handleEditModalClose}
          >
            <div
              onClick={handleModalClick}
              className='my-10 mx-8 p-5 bg-white rounded-lg shadow-lg max-w-md lg:w-1/4'
            >
              <EditCitationModal
                onClose={handleEditModalClose}
                reloadCitation={reloadCitation}
                citation={citation}
                id={id}
              />
            </div>
          </div>
        )}
        <h1 className='text-3xl mt-2'>Citation View</h1>
        <section className='flex flex-col gap-2 items-start border-solid border-2 m-4 rounded-xl p-3'>
          <div className='flex justify-between w-full'>
            {' '}
            <h2 className='text-2xl'>{citation.title}</h2>
            <button
              className='self-end bg-gray-200 px-3 py-1 rounded-xl drop-shadow-xl'
              onClick={handleEditModalOpen}
            >
              Edit Citation
            </button>
          </div>
          <p>
            Source:{' '}
            <a className='underline' href={`/source/${citation.sourceId}`}>
              {source.title}
            </a>
          </p>
          <p>Location: {citation.location}</p>
          <h3 className='self-center font-medium'>Notes</h3>
          <p>{citation.notes}</p>
        </section>
      </div>
    </main>
  );
};
export default CitationDetail;
