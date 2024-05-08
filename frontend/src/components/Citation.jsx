import { useState, useEffect } from 'react';
const Citation = ({ citation }) => {
  const [source, setSource] = useState('');

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
  });
  return (
    <div className='flex flex-col border-solid border-2 rounded-xl m-4 p-4 lg:justify-between gap-8'>
      <h2 className='self-start text-2xl underline text-start'>
        <a href={`/citation/${citation.id}`}>{citation.title}</a>
      </h2>
      <p className='self-end'>
        <strong>Source:</strong>{' '}
        <a className='underline' href={`/source/${citation.sourceId}`}>
          {source.title}
        </a>
      </p>
    </div>
  );
};
export default Citation;
