import { Link } from 'react-router-dom'

export default function Footer({ showFull = false }) {
  return (
    <footer id="footer" className="footer dark-background">
      {showFull && (
        <div className="container footer-top">
          <div className="row gy-4">
            <div className="col-lg-4 col-md-6 footer-about">
              <Link to="/" className="logo d-flex align-items-center">
                <span className="sitename">SustainRank</span>
              </Link>
              <div className="footer-contact pt-3">
                <p>10th street mumbai</p>
                <p>India</p>
                <p className="mt-3"><strong>Phone:</strong> <span>+1 5589 55488 55</span></p>
                <p><strong>Email:</strong> <span>info@gmail.com</span></p>
              </div>
              <div className="social-links d-flex mt-4">
                <a href="#"><i className="bi bi-twitter-x"></i></a>
                <a href="#"><i className="bi bi-facebook"></i></a>
                <a href="#"><i className="bi bi-instagram"></i></a>
                <a href="#"><i className="bi bi-linkedin"></i></a>
              </div>
            </div>

            <div className="col-lg-2 col-md-3 footer-links">
              <h4>Useful Links</h4>
              <ul>
                <li><i className="bi bi-chevron-right"></i> <Link to="/">Home</Link></li>
                <li><i className="bi bi-chevron-right"></i> <a href="#about">About us</a></li>
                <li><i className="bi bi-chevron-right"></i> <a href="#services">Services</a></li>
                <li><i className="bi bi-chevron-right"></i> <a href="#">Terms of service</a></li>
                <li><i className="bi bi-chevron-right"></i> <a href="#">Privacy policy</a></li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-12 footer-newsletter">
              <h4>Our Newsletter</h4>
              <p>Subscribe to our newsletter and receive the latest news about our products and services!</p>
              <form onSubmit={(e) => e.preventDefault()} className="php-email-form">
                <div className="newsletter-form">
                  <input type="email" name="email" placeholder="Your email" />
                  <input type="submit" value="Subscribe" />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="container copyright text-center mt-4">
      </div>
    </footer>
  )
}
