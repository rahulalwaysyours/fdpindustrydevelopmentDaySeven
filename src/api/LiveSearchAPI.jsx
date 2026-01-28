import { useState, useEffect } from 'react';

/*
  LiveSearchAPI Component

  This component demonstrates:
  - Live search using a real API
  - Debouncing to control API request frequency
  - AbortController for request cancellation
  - Proper loading and error handling

  Designed and implemented by Rahul Kesarwani
*/

function LiveSearchAPI() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  /* Debounce user input */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  /* API search based on debounced input */
  useEffect(() => {
    if (!debouncedSearch.trim() || debouncedSearch.length < 2) {
      setProducts([]);
      setTotalResults(0);
      return;
    }

    const abortController = new AbortController();

    const searchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://dummyjson.com/products/search?q=${encodeURIComponent(
            debouncedSearch
          )}&limit=20`,
          { signal: abortController.signal }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }

        const data = await response.json();
        setProducts(data.products);
        setTotalResults(data.total);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    searchProducts();

    return () => abortController.abort();
  }, [debouncedSearch]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setProducts([]);
    setTotalResults(0);
  };

  return (
    <div className="component-container">
      <h2>Live Product Search Using API</h2>

      <p className="description">
        This module demonstrates a debounced live search implementation using a
        real API. API requests are triggered only after the user pauses typing,
        improving performance and reducing unnecessary network calls.
      </p>

      <p style={{ fontSize: '0.9em', color: '#555' }}>
        Designed and implemented by <strong>Rahul Kesarwani</strong>
      </p>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search products by name or category"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />

        {searchTerm && (
          <button onClick={handleClearSearch} className="btn-clear">
            Clear
          </button>
        )}
      </div>

      {/* Search Status */}
      <div className="status-box">
        {loading && <p>Searching for "{debouncedSearch}"...</p>}

        {!loading && debouncedSearch && (
          <p>
            {totalResults} result{totalResults !== 1 ? 's' : ''} found for "
            {debouncedSearch}"
          </p>
        )}

        {!loading && !debouncedSearch && (
          <p>Start typing to search (minimum two characters).</p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="error-box">
          Error: {error}
        </div>
      )}

      {/* Results */}
      {!loading && products.length > 0 && (
        <div className="results-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.thumbnail} alt={product.title} />

              <h3>{highlightText(product.title, debouncedSearch)}</h3>

              <p className="description-text">
                {product.description}
              </p>

              <div className="product-footer">
                <span className="price">${product.price}</span>
                <span className="brand">{product.brand}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && debouncedSearch && products.length === 0 && (
        <div className="no-results">
          <h3>No results found</h3>
          <p>Please try a different search keyword.</p>
        </div>
      )}
    </div>
  );
}

/* Highlight helper */
function highlightText(text, highlight) {
  if (!highlight.trim()) return text;

  try {
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <strong key={index}>{part}</strong>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  } catch {
    return text;
  }
}

export default LiveSearchAPI;
