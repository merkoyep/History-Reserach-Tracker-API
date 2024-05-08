import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditSourceModal = ({ onClose, source, id, reloadSource }) => {
  const [title, setTitle] = useState(source.title);
  const [authorFirstName, setAuthorFirstName] = useState(
    source.authorFirstName
  );
  const [authorLastName, setAuthorLastName] = useState(source.authorLastName);
  const [publishDate, setPublishDate] = useState(source.publishDate);
  const [publishedBy, setPublishedBy] = useState(source.publishedBy);
  const [edition, setEdition] = useState(source.edition);
  const [volume, setVolume] = useState(source.volume);
  const [url, setUrl] = useState(source.url);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('handleSubmit is called');
    const sourceData = {
      title,
      authorFirstName,
      authorLastName,
      publishDate,
      publishedBy,
      edition: edition ? parseInt(edition) : null,
      volume: volume ? parseInt(volume) : null,
      url,
    };

    try {
      console.log('About to send fetch request', sourceData);
      const response = await fetch(`http://localhost:3000/source/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(sourceData),
      });
      console.log('fetch completed');
      console.log(response);
      if (response.ok) {
        console.log('Source updated successfully');
        await reloadSource();
        onClose();
      } else {
        console.log('Failed to update source:', response.status);
        alert('Failed to update source');
      }
    } catch (error) {
      console.error('Source update error:', error);
      alert('Failed to update source. Please try again.');
    }
  };
  const handleDelete = async (event) => {
    try {
      const response = await fetch(`http://localhost:3000/source/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (response.ok) {
        console.log('Source deleted successfully');
        onClose();
        navigate('/sources');
      } else {
        console.log('Failed to delete source', response.status);
        alert('Failed to delete source');
      }
    } catch (error) {
      console.error('Source delete error:', error);
      alert('Failed to delete source. Please try again.');
    }
  };

  return (
    <div className='flex flex-col'>
      <button onClick={onClose} className='self-end'>
        X
      </button>
      <h1 className='text-3xl mb-2 self-center'>Edit source</h1>

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
          <button type='button' onClick={handleDelete}>
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};
export default EditSourceModal;
