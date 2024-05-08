import { useState, useEffect } from 'react';
import Source from '../components/Source';
import NewSourceModal from '../components/NewSourceModal';

const Sources = () => {
  const [sources, setSources] = useState([]);
  const [openAddSource, setOpenAddSource] = useState(false);
  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await fetch('http://localhost:3000/source', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSources(data.sources);
      } catch (error) {
        console.error('Failed to fetch sources:', error);
      }
    };
    fetchSources();
  });

  const handleAddModalOpen = () => {
    setOpenAddSource(true);
  };
  const handleAddModalClose = () => {
    setOpenAddSource(false);
  };
  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className='flex flex-col m-2'>
      {openAddSource && (
        <div
          className='fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:flex lg:items-center lg:justify-center'
          aria-hidden='true'
          onClick={handleAddModalClose}
        >
          <div
            onClick={handleModalClick}
            className='my-10 mx-8 p-5 bg-white rounded-lg shadow-lg max-w-md lg:w-1/4'
          >
            <NewSourceModal onClose={handleAddModalClose} />
          </div>
        </div>
      )}
      <h1 className='text-3xl mt-3'>Sources</h1>
      <button
        onClick={handleAddModalOpen}
        className='self-end bg-gray-200 px-3 py-1 rounded-xl drop-shadow-xl mx-4'
      >
        + Add Source
      </button>
      <section className='lg:grid lg:grid-cols-4 lg:grid-rows-2 lg:gap-4 lg:h-screen'>
        {sources.map((source) => (
          <Source key={source.id} source={source} />
        ))}
      </section>
    </div>
  );
};
export default Sources;
