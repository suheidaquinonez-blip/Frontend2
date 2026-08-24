function Search({ searchTerm, onChange, placeholder }) {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default Search;