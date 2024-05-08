import { useState } from 'react';

const NewSourceModal = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [authorFirstName, setAuthorFirstName] = useState('');
  const [authorLastName, setAuthorLastName] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [publishedBy, setPublishedBy] = useState('');
  const [edition, setEdition] = useState('');
  const [volume, setVolume] = useState('');
  const [url, setUrl] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    const sourceData = {
      title,
      authorFirstName,
      authorLastName,
      publishDate,
      publishedBy,
      edition: edition ? parseInt(edition) : null,
      volume: volume ? parseInt(volume) : null,
    };

    try {
      const response = await fetch('http://localhost:3000/source/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(sourceData),
      });
      if (response.ok) {
        window.location.href = '/sources';
      } else {
        alert('Failed to add source');
      }
    } catch (error) {
      alert('Source add error:', error.message);
    }
  };
  return (
    <div className='flex flex-col'>
      <button onClick={onClose} className='self-end'>
        X
      </button>
      <h1 className='text-3xl mb-2 self-center'>Add new source</h1>

      <form
        onSubmit={handleSubmit}
        className='flex flex-col items-start gap-2 w-full'
      >
        <div className='flex flex-col items-start w-full px-3'>
          <label htmlfor='title'>Source Title</label>
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
          <label htmlfor='authorFirstName'>Author's First Name</label>
          <input
            type='text'
            id='authorFirstName'
            name='authorFirstName'
            value={authorFirstName}
            onChange={(e) => setAuthorFirstName(e.target.value)}
            className='bg-gray-200 rounded-lg w-full px-3'
            required
          />
        </div>
        <div className='flex flex-col items-start w-full px-3'>
          <label htmlfor='authorLastName'>Author's Last Name</label>
          <input
            type='text'
            id='authorLastName'
            name='authorLastName'
            value={authorLastName}
            onChange={(e) => setAuthorLastName(e.target.value)}
            className='bg-gray-200 rounded-lg w-full px-3'
          />
        </div>
        <div className='flex flex-col items-start w-full px-3'>
          <label htmlfor='publishDate'>Date Published</label>
          <input
            type='date'
            id='publishDate'
            name='publishDate'
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
            required
          />
        </div>
        <div className='flex flex-col items-start w-full px-3'>
          <label htmlfor='publishedBy'>Publisher</label>
          <input
            type='text'
            id='publishedBy'
            name='publishedBy'
            value={publishedBy}
            onChange={(e) => setPublishedBy(e.target.value)}
            className='bg-gray-200 rounded-lg w-full px-3'
          />
        </div>
        <div className='flex flex-col items-start w-full px-3'>
          <label htmlfor='edition'>Edition</label>
          <input
            type='number'
            id='edition'
            name='edition'
            value={edition}
            onChange={(e) => setEdition(e.target.value)}
            className='bg-gray-200 rounded-lg w-full px-3'
          />
        </div>
        <div className='flex flex-col items-start w-full px-3'>
          <label htmlfor='volume'>Volume</label>
          <input
            type='number'
            id='volume'
            name='volume'
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className='bg-gray-200 rounded-lg w-full px-3'
          />
        </div>
        <div className='flex flex-col items-start w-full px-3'>
          <label htmlfor='url'>Url</label>
          <input
            type='url'
            id='url'
            name='url'
            value={url}
            onChange={(e) => {
              console.log(e.target.value);
              setUrl(e.target.value);
            }}
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

export default NewSourceModal;
