import React from "react";

function Search() {
  return (
    <div style={{ paddingTop: "120px" }}>
      <h1>Search</h1>
      <div className="container pt-4">
        <div class="input-group">
          <input
            type="search"
            class="form-control rounded"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="search-addon"
          />
          <button type="button" class="btn btn-outline-primary">
            search
          </button>
        </div>
      </div>
    </div>
  );
}

export default Search;
