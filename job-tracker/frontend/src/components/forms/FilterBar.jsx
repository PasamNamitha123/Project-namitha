
export default function FilterBar({
  search,
  setSearch,
  status,
  setStatus,
  location,
  setLocation,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) {
  return (
    <div className="filter-bar">

      {/* Search */}
      <div className="filter-group search-group">
        <label htmlFor="application-search">
          Search applications
        </label>

        <input
          id="application-search"
          type="search"
          placeholder="Search company or job role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Status filter */}
      <div className="filter-group">
        <label htmlFor="status-filter">
          Status
        </label>

        <select
          id="status-filter"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="wishlist">Wishlist</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Location filter */}
      <div className="filter-group">
        <label htmlFor="location-filter">
          Location
        </label>

        <input
          id="location-filter"
          type="text"
          placeholder="Enter location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* Sorting */}
      <div className="filter-group">
        <label htmlFor="sort-by">
          Sort by
        </label>

        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="position">Board position</option>
          <option value="company">Company name</option>
          <option value="role">Job role</option>
          <option value="status">Status</option>
          <option value="applied_on">Applied date</option>
        </select>
      </div>

      {/* Sort order */}
      <div className="filter-group">
        <label htmlFor="sort-order">
          Order
        </label>

        <select
          id="sort-order"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

    </div>
  );
}
