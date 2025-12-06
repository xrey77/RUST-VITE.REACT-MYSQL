import Footer from "./Footer.tsx";
import '../index.css';

export default function Home() {
  return (
    <>    
    <div className="carousel-box">
<div id="carouselExampleCaptions" className="carousel slide">
  <div className="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" aria-label="Slide 4"></button>
  </div>
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img src="http://127.0.0.1:3000/assets/images/4.png" className="d-block w-100" alt="..."/>
      <div className="carousel-caption d-none d-md-block">
      </div>
    </div>
    <div className="carousel-item">
      <img src="http://127.0.0.1:3000/assets/images/3.png" className="d-block w-100" alt="..."/>
      <div className="carousel-caption d-none d-md-block">
      </div>
    </div>
    <div className="carousel-item">
      <img src="http://127.0.0.1:3000/assets/images/2.png" className="d-block w-100" alt="..."/>
      <div className="carousel-caption d-none d-md-block">
      </div>
    </div>
    <div className="carousel-item">
      <img src="http://127.0.0.1:3000/assets/images/1.png" className="d-block w-100" alt="..."/>
      <div className="carousel-caption d-none d-md-block">
      </div>
    </div>

  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>    
<div className="card border-0 mt-3">
  <div className="card-header bg-dark">
    <strong>
    <h3 className="text-secondary text-white embossed">Play a part in shaping the future of self-service financial solutions</h3>
    </strong>    
  </div>
</div>
<div className="card-body">
    <p className="card-text txt-justified mx-4">
    We will make a valued contribution towards our goal of continually innovating to expand self-service financial access 
    <br/><br/>
    Our people are the heart of the solutions we deliver. Collaborating with diverse teams across continents, you’ll have the opportunity to innovate, to impact change and to create exceptional experiences for our customers and, in turn, their customers. Our business spans more than 60 countries—where will you find your fit?    
    </p>
  </div>
  <div className="footer-contact footer-home"> 
</div>
</div>
<br/><br/><br/><br/><br/><br/>

<div className="footer-home text-white">
  <Footer/>
</div>
</>

  )
}
