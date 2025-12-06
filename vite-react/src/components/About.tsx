import Footer from "./Footer.tsx";

export default function About() {
  return (
    <>
<div className="card bg-dark border-0 mt-3 about">
  <img src="http://127.0.0.1:3000/assets/images/about.jpg" className="card-img " alt="..."/>
  <div className="card-body">
  </div>
  <div className="card-footer">
  <h2 className="card-title text-white card-x embossed">About Us</h2>
    <p className="card-text text-white card-x">
    NCR is now two companies: NCR Voyix (focused on banking, retail, and restaurant software and services) and NCR Atleos (which provides automated teller machine, or ATM, operations and solutions). Formerly known as NCR Corporation, the split occurred in 2023 to allow each business to focus on their respective industries.  

      </p>
    <p className="card-text"><small>Last updated 3 mins ago</small></p>

  </div>
</div> 
<div className="w-80 fixed-bottom">   
<Footer/>
</div>
</>
  )
}
