import optimajet from '../images/optimajet.svg?url'

/**
 * The app footer.
 * @returns the React element.
 */
export const Footer = () => (
  <div className="footer">
    <div className="logo-optimajet-info">
      <a href="https://optimajet.com/" target="_blank" rel="noreferrer">
        <img src={optimajet} loading="lazy" width="303.8823547363281" height="60" alt="Optimajet logo" className="logo-2" />
      </a>
      <p className="paragraph">
        Optimajet is a software vendor that provides developer tools to help companies build workflow software applications faster, more
        scalably and efficiently, while reducing software development costs. OptimaJet FormBuilder is a lightweight front-end solution that
        provides a simple and flexible way to implement drag and drop form functionality in your React applications.
      </p>
      <p className="paragraph">
        Optimajet Limited, 14 Penn Plaza, 225 West 34th Street, New York, NY 10122
        <br />
        <a href="tel:+14156831308">+1 415-683-1308</a>
        <br />
        <a href="mailto:sales@optimajet.com">sales@optimajet.com</a>
      </p>
      <div>
        <span className="label">We </span>
        <span className="heart">❤</span>
        <span className="label">️ NYC</span>
      </div>
      <p className="paragraph">© 2025 Optimajet Limited. All rights reserved.</p>
    </div>
  </div>
)
