import { useState, useEffect } from 'react';

const NewCitationModal = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [sources, setSources] = useState([]);
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
  const handleSubmit = async (event) => {
    event.preventDefault();
    const citationData = {
      title,
      sourceId,
      location,
      notes,
    };

    try {
      const response = await fetch('http://localhost:3000/citations/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(citationData),
      });
      if (response.ok) {
        window.location.href = '/citations';
      } else {
        alert('Failed to add citation');
      }
    } catch (error) {
      alert('Citation add error:', error.message);
    }
  };
  return (
    <div className='flex flex-col'>
      <button onClick={onClose} className='self-end'>
        X
      </button>
      <h1 className='text-3xl mb-2 self-center'>Add new citation</h1>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col items-start gap-2 w-full'
      >
        <div className='flex flex-col items-start w-full px-3'>
          <label for='title'>Citation Title</label>
          <input
            type='text'
            id='title'
            name='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='bg-gray-200 rounded-lg w-full px-3'
            required
          />
        </div>
        <div className='flex flex-col items-start w-full px-3'>
          <label for='source'>Source</label>
          <select
            id='sourceId'
            name='sourceId'
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
          >
            <option value=''>Select a source</option>
            {sources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.title}
              </option>
            ))}
          </select>
        </div>
        <div className='flex flex-col items-start w-full px-3'>
          <label for='location'>Location of citation in source</label>
          <input
            type='text'
            id='location'
            name='location'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className='bg-gray-200 rounded-lg w-full px-3'
          />
        </div>
        <div className='flex flex-col items-start w-full px-3'>
          <label for='notes'>Notes</label>
          <textarea
            type='text'
            id='notes'
            name='notes'
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className='bg-gray-200 rounded-lg w-full px-3'
          />
        </div>

        <div>
          <button
            className='bg-gray-200 px-3 py-1 rounded-xl drop-shadow-xl m-3'
            type='submit'
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCitationModal;
