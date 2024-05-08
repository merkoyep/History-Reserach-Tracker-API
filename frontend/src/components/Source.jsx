const Source = ({ source }) => {
  return (
    <div className='flex flex-col border-solid border-2 rounded-xl m-4 p-4 lg:justify-between'>
      <h3 className='self-start text-3xl underline'>
        <a href={`source/${source.id}`}>{source.title}</a>
      </h3>
      <div className='w-2/3 self-end'>
        <p className='text-end'>
          Author: {source.authorFirstName} {source.authorLastName}
        </p>
      </div>
    </div>
  );
};
export default Source;
