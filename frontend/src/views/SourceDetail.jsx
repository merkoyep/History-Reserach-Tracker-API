import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditSourceModal from '../components/EditSourceModal';
import NewCitationModal from '../components/NewCitationModal';
import Citation from '../components/Citation';
const SourceDetail = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const [source, setSource] = useState('');
  const [citations, setCitations] = useState([]);
  const [openAddCitation, setOpenAddCitation] = useState(false);
  const [openEditSource, setOpenEditSource] = useState(false);

  useEffect(() => {
    const fetchSource = async () => {
      try {
        const response = await fetch(`http://localhost:3000/source/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSource(data.source);
        setCitations(data.source.citations || []);
      } catch (error) {
        console.error('Failed to fetch source:', error);
      }
    };
    fetchSource();
  }, [id]);
  const handleEditModalOpen = () => {
    setOpenEditSource(true);
  };
  const handleEditModalClose = () => {
    setOpenEditSource(false);
  };
  const handleAddModalOpen = () => {
    setOpenAddCitation(true);
  };
  const handleAddModalClose = () => {
    setOpenAddCitation(false);
  };

  const reloadSource = async () => {
    try {
      const response = await fetch(`http://localhost:3000/source/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Reloading', source);
      setSource(data.source);
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
        {openEditSource && (
          <div
            className='fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:flex lg:items-center lg:justify-center'
            aria-hidden='true'
            onClick={handleEditModalClose}
          >
            <div
              onClick={handleModalClick}
              className='my-10 mx-8 p-5 bg-white rounded-lg shadow-lg max-w-md lg:w-1/4'
            >
              <EditSourceModal
                onClose={handleEditModalClose}
                reloadSource={reloadSource}
                source={source}
                id={id}
              />
            </div>
          </div>
        )}
        <h1 className='text-3xl mt-2'>Source View</h1>
        <section className='flex flex-col items-start border-solid border-2 m-4 rounded-xl p-3'>
          <div className='flex justify-between w-full'>
            <h2 className='text-2xl'>{source.title}</h2>
            <button
              onClick={handleEditModalOpen}
              className='self-end bg-gray-200 px-3 py-1 rounded-xl drop-shadow-xl'
            >
              Edit Source
            </button>
          </div>
          <div className='flex flex-col items-start w-2/3'>
            <p>
              <strong>Author:</strong> {source.authorFirstName}{' '}
              {source.authorLastName}
            </p>
            <p>
              <strong>Published:</strong> {source.publishDate}
            </p>
            <p>
              <strong>Published By:</strong> {source.publishedBy}
            </p>
            <p>
              <strong>Edition: {source.edition}</strong> Volume: {source.volume}
            </p>
            <p className='text-start'>
              <strong>Link:</strong>{' '}
              <a className='underline' href={source.url}>
                {source.url}
              </a>
            </p>
          </div>
        </section>
        <h2 className='text-lg '>Citations</h2>
        <button
          onClick={handleAddModalOpen}
          className='self-end bg-gray-200 px-3 py-1 rounded-xl drop-shadow-xl mx-4'
        >
          + Add Citation
        </button>
        <div className='lg:grid lg:grid-cols-3 lg:gap-4'>
          {citations.map((citation) => (
            <Citation key={citation.id} citation={citation} />
          ))}
        </div>
      </div>
    </main>
  );
};
export default SourceDetail;
