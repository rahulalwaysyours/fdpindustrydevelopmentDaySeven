import { useState, useEffect } from 'react';

/**
 * Component 4: LIVE SEARCH WITH REAL API CALLS (Debounced)
 * 
 * This is an advanced example demonstrating:
 * - Making REAL API calls based on search input
 * - Debouncing to reduce API requests (performance & cost optimization)
 * - Handling loading states during searches
 * - Cleanup to cancel outdated requests
 * - Difference between client-side filtering vs server-side search
 * 
 * KEY DIFFERENCE from SearchWithDebounce:
 * ❌ SearchWithDebounce: Fetches ALL data once, filters locally
 * ✅ LiveSearchAPI: Makes NEW API call for each search query
 * 
 * When to use each:
 * - Local filtering: Small datasets (< 100 items), fast UI updates
 * - API search: Large datasets, server-side filtering, real-time data
 * 
 * LEARNING POINTS:
 * - Debouncing saves API calls (and money on paid APIs!)
 * - AbortController cancels outdated requests
 * - Empty search = empty results (no initial fetch)
 * - Loading states are crucial for good UX
 */
function LiveSearchAPI() {
  // STATE for search functionality
  const [searchTerm, setSearchTerm] = useState(''); // What user types
  const [debouncedSearch, setDebouncedSearch] = useState(''); // Delayed/debounced term
  const [products, setProducts] = useState([]); // Search results
  const [loading, setLoading] = useState(false); // Loading during search
  const [error, setError] = useState(null); // Error state
  const [totalResults, setTotalResults] = useState(0); // Total matches found

  /**
   * EFFECT 1: DEBOUNCE the search term
   * 
   * Problem: If we made an API call on EVERY keystroke, we'd spam the server!
   * - User types "laptop" = 6 keystrokes = 6 API calls
   * - With paid APIs, this costs money
   * - With rate-limited APIs, you get blocked
   * 
   * Solution: DEBOUNCING
   * - Wait 600ms after user stops typing
   * - Then make ONE API call with the final search term
   * 
   * Example timeline:
   * User types: l...a...p...t...o...p (typing takes ~2 seconds)
   * Without debounce: 6 API calls
   * With debounce: 1 API call (600ms after "p")
   */
  useEffect(() => {
    console.log('⌨️ User typed:', searchTerm);

    // Set up a timer to update debouncedSearch after 600ms of no typing
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      console.log('⏰ Debounce timer fired! Will search for:', searchTerm);
    }, 600); // 600ms delay

    /**
     * CLEANUP FUNCTION
     * 
     * This is THE KEY to debouncing!
     * 
     * What happens:
     * 1. User types "l" → timer starts (600ms countdown)
     * 2. User types "a" → cleanup runs (clears previous timer)
     * 3. New timer starts (600ms countdown from "la")
     * 4. User types "p" → cleanup runs again
     * ... and so on ...
     * 
     * Only when user STOPS typing for 600ms does the timer complete!
     */
    return () => {
      clearTimeout(timer);
      console.log('🧹 Cleared previous timer');
    };
  }, [searchTerm]); // Runs every time searchTerm changes

  /**
   * EFFECT 2: SEARCH API when debounced term changes
   * 
   * This is where the REAL API call happens!
   * Only runs when debouncedSearch changes (600ms after user stops typing)
   * 
   * We use AbortController to cancel requests if user types again
   * before the previous request completes.
   */
  useEffect(() => {
    // Don't search if search term is empty or too short
    if (!debouncedSearch.trim() || debouncedSearch.length < 2) {
      setProducts([]);
      setTotalResults(0);
      return;
    }

    /**
     * ABORT CONTROLLER
     * 
     * Problem: User types "lap", then quickly changes to "phone"
     * - API call for "lap" is still loading
     * - API call for "phone" starts
     * - "lap" results come back AFTER "phone" results
     * - UI shows wrong results!
     * 
     * Solution: Cancel the "lap" request when "phone" search starts
     */
    const abortController = new AbortController();

    const searchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`🔍 Making API call to search for: "${debouncedSearch}"`);

        /**
         * DummyJSON API - Product Search
         * 
         * Endpoint: https://dummyjson.com/products/search?q=searchTerm
         * 
         * This API searches products by title, description, brand
         * Returns paginated results with total count
         */
        const response = await fetch(
          `https://dummyjson.com/products/search?q=${encodeURIComponent(debouncedSearch)}&limit=20`,
          { signal: abortController.signal } // Pass abort signal
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log(`✅ Found ${data.total} products matching "${debouncedSearch}"`);
        
        setProducts(data.products);
        setTotalResults(data.total);
        setError(null);

      } catch (err) {
        /**
         * Handle different error types
         */
        if (err.name === 'AbortError') {
          // Request was cancelled - this is normal!
          console.log('🚫 Request cancelled (user typed something new)');
        } else {
          // Real error
          console.error('❌ Search error:', err);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    searchProducts();

    /**
     * CLEANUP: Cancel request if component unmounts or search changes
     * 
     * This prevents:
     * - Memory leaks
     * - Outdated results showing up
     * - Race conditions
     */
    return () => {
      console.log('Cancelling previous search request');
      abortController.abort();
    };

  }, [debouncedSearch]); // Only runs when debounced search changes

  /**
   * Event Handler: Update search term on keystroke
   */
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  /**
   * Event Handler: Clear search
   */
  const handleClearSearch = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setProducts([]);
    setTotalResults(0);
  };

  return (
    <div style={{ color: 'red' }} className="component-container">
      <h2>🌐 Live API Search (Debounced)</h2>
      <p className="description">
        Search products with <strong>real-time API calls</strong>. Each search makes a NEW request to the server.
        <br />
        <strong>Debouncing waits 600ms</strong> after you stop typing to reduce API calls.
        <br />
        💡 <em>Try typing slowly vs quickly to see the difference!</em>
      </p>

      {/* Info Box */}
      <div style={{
        background: '#f0f8ff',
        padding: '15px',
        color: 'red',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '0.9em',
        borderLeft: '4px solid #2196F3'
      }}>
        <strong>📊 How this works:</strong>
        <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>You type in the search box</li>
          <li>Timer starts (600ms countdown)</li>
          <li>If you keep typing, timer resets</li>
          <li>When you stop for 600ms, API call is made</li>
          <li>Results are fetched from DummyJSON API</li>
        </ol>
        <div style={{ marginTop: '10px', fontSize: '0.85em', color: '#666' }}>
          <strong>Why debounce?</strong> Without it, typing "phone" would make 5 API calls (p, ph, pho, phon, phone).
          With debounce, it makes just 1 call!
        </div>
      </div>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search products (e.g., phone, laptop, watch)..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
          style={{
            width: '100%',
            padding: '12px 15px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            outline: 'none',
            transition: 'border-color 0.3s',
          }}
        />
        
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="btn-clear"
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#ff5252',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '8px 12px',
              cursor: 'pointer',
            }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Search Status */}
      <div style={{
        margin: '15px 0',
        padding: '10px',
        color: 'red',
        background: loading ? '#fff3cd' : '#d4edda',
        borderRadius: '5px',
        border: `1px solid ${loading ? '#ffc107' : '#28a745'}`,
      }}>
        {loading && (
          <p style={{ margin: 0, color: '#856404' }}>
            ⏳ Searching for "{debouncedSearch}"...
          </p>
        )}
        
        {!loading && debouncedSearch && (
          <p style={{ margin: 0, color: '#155724' }}>
            ✅ Found {totalResults} product{totalResults !== 1 ? 's' : ''} matching "{debouncedSearch}"
          </p>
        )}
        
        {!loading && !debouncedSearch && (
          <p style={{ margin: 0, color: '#666' }}>
            💭 Start typing to search... (minimum 2 characters)
          </p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          padding: '15px',
          background: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          color: '#721c24',
          marginBottom: '20px',
        }}>
          ❌ Error: {error}
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto',
          }}></div>
          <p style={{ marginTop: '15px', color: '#666' }}>Searching...</p>
        </div>
      )}

      {/* Results */}
      {!loading && products.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          marginTop: '20px',
        }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '10px',
                padding: '15px',
                background: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '10px',
                }}
              />
              <h3 style={{
                margin: '10px 0',
                fontSize: '1.1em',
                color: '#333',
              }}>
                {highlightText(product.title, debouncedSearch)}
              </h3>
              <p style={{
                fontSize: '0.9em',
                color: '#666',
                margin: '8px 0',
                height: '60px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {product.description}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '10px',
                paddingTop: '10px',
                borderTop: '1px solid #eee',
              }}>
                <span style={{
                  fontSize: '1.2em',
                  fontWeight: 'bold',
                  color: '#2196F3',
                }}>
                  ${product.price}
                </span>
                <span style={{
                  background: '#4CAF50',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.85em',
                }}>
                  ⭐ {product.rating}
                </span>
              </div>
              <div style={{
                marginTop: '8px',
                fontSize: '0.85em',
                color: '#888',
              }}>
                Brand: <strong>{product.brand}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && debouncedSearch && products.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#f9f9f9',
          borderRadius: '10px',
          marginTop: '20px',
        }}>
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>🔍</div>
          <h3 style={{ color: '#666', marginBottom: '10px' }}>
            No products found for "{debouncedSearch}"
          </h3>
          <p style={{ color: '#999' }}>
            Try searching for: phone, laptop, watch, or furniture
          </p>
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .search-container {
          position: relative;
          margin: 20px 0;
        }
        
        .highlight {
          background-color: yellow;
          font-weight: bold;
          padding: 2px 4px;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}

/**
 * HELPER FUNCTION: Highlight matching text in search results
 * 
 * Makes the search term stand out in the results by highlighting it
 */
function highlightText(text, highlight) {
  if (!highlight.trim()) {
    return text;
  }

  try {
    // Create regex to match search term (case-insensitive)
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <span key={index} className="highlight">
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  } catch (e) {
    // If regex fails (special characters), just return original text
    return text;
  }
}

export default LiveSearchAPI;