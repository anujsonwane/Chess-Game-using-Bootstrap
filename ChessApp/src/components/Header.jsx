import React from 'react';

// Header using a Bootstrap navbar so the toggler icon renders correctly
function Header() {
  return (
    <nav className="navbar navbar-light bg-light border-bottom">
      <div className="container-fluid d-flex justify-content-start align-items-center ms-2 me-4">
        <button
          className="navbar-toggler me-4"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasMenu"
          aria-controls="offcanvasMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <img src="/images/chess_title_icon.png" alt="Chess Icon" className="img-fluid me-2" style={{ width: '40px', height: '40px' }} />
        <span className="navbar-brand mb-0 h1">Chess App</span>
      </div>

      {/* offcanvas menu definition */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasMenu"
        aria-labelledby="offcanvasMenuLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasMenuLabel">
            Menu
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="list-unstyled mb-0">
            <li className="py-2">
              <a href="#" className="text-decoration-none">
                Profile
              </a>
            </li>
            <li className="py-2">
              <a href="#" className="text-decoration-none">
                About App
              </a>
            </li>
            <li className="py-2">
              <a href="#" className="text-decoration-none">
                Settings
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
