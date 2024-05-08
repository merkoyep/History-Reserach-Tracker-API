import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
const EditCitationModal = ({ onClose, citation, id, reloadCitation }) => {
  const [title, setTitle] = useState(citation.title);
  const [sourceId, setSourceId] = useState(citation.sourceId);
  const [location, setLocation] = useState(citation.location);
  const [notes, setNotes] = useState(citation.notes);
  const [sources, setSources] = useState([]);
  const navigate = useNavigate();
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
    console.log('handleSubmit is called');
    const citationData = {
      title,
      sourceId,
      location,
      notes,
    };
    try {
      const response = await fetch(`http://localhost:3000/citations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(citationData),
      });
      if (response.ok) {
        console.log('Citation updated sucessfully');
        await reloadCitation();
        onClose();
      } else {
        console.log('Failed to update Citation:', response.status);
        alert('Failed to update Citation');
      }
    } catch (error) {
      console.error('Citation update error:', error);
      alert('Failed to update citation. Please try again.');
    }
  };
  const handleDelete = async (event) => {
    try {
      const response = await fetch(`http://localhost:3000/citations/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (response.ok) {
        console.log('Citation deleted successfully');
        onClose();
        navigate('/citations');
      } else {
        console.log('Failed to delete citation', response.status);
        alert('Failed to delete citation');
      }
    } catch (error) {
      console.error('Citation delete error:', error);
      alert('Failed to delete citation. Please try again.');
    }
  };

  return (
    <div className='flex flex-col'>
      <button onClick={onClose} className='self-end'>
        X
      </button>
      <h1 className='text-3xl mb-2 self-center'>Edit citation</h1>
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
          <button type='button' onClick={handleDelete}>
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};
export default EditCitationModal;
