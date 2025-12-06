import Footer from "./Footer.tsx";

export default function Contact() {
  return (
    <>
    <div className="contact-bg">
      <div className="card border-0 mb-3 mt-5 contact">
        <div className="row g-0">
          <div className="col-md-4">
            <img src="http://127.0.0.1:3000/assets/images/contact.jpeg" className="card-h rounded-start" alt="..."/>
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h2 className="card-title text-white embossed">Contact Us</h2>
              <p className="card-text text-white txt-justified">
              NCR Voyix Corporation, previously known as NCR Corporation and National Cash Register, is a global software, consulting and technology company providing several professional services and electronic products. It manufactured self-service kiosks, point-of-sale terminals, automated teller machines, check processing systems, and barcode scanners.<br/><br/>
              NCR's U.S. headquarters is in Atlanta, Georgia, which serves as the central hub for their global operations and attracts employees and customers. The company, now split into two entities (NCR Voyix and NCR Atleos), focuses on different areas but maintains its presence in Atlanta. 
                </p>
              <p className="card-text"><small className="text-body-secondary">
              <strong>NCR's U.S. Headquarters</strong> <br/>
              Location: The main U.S. office is located in Atlanta, Georgia.
              </small></p>
            </div>
          </div>
        </div>
      </div>   
      <div className="footer-contact"> 
        <Footer/>
      </div>
      </div>      
</>
  )
}
