import axios from "axios"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const api = axios.create({
  baseURL: "http://127.0.0.1:3000",
  headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'}
})

const toDecimal = (number: any) => {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(number);
};
export default function Prodcatalog() {
    let [page, setPage] = useState<number>(1);
    let [prods, setProds] = useState<[]>([]);
    let [totpage, setTotpage] = useState<number>(0);
    let [totalrecords, setTotalrecords] = useState<number>(0);
    const [message, setMessage] = useState('');

    const fetchCatalog = async (pg: any) => {
      api.get(`auth/products/list/${pg}`)
      .then((res: any) => {
        setProds(res.data.products);
        setTotpage(res.data.totpage);
        setTotalrecords(res.data.totalrecords);
        setPage(res.data.page);
      }, (error: any) => {
            if (error.response) {
                setMessage(error.response.data.message);            
            } else {
              setMessage(error.message);            
            }
            setTimeout(() => {
              setMessage('')
            }, 3000);

              return;
      });      
    }

    useEffect(() => {
      fetchCatalog(page)
    },[page]);

    const firstPage = (event: any) => {
        event.preventDefault();    
        page = 1;
        return fetchCatalog(page);
      }
    
      const nextPage = (event: any) => {
        event.preventDefault();    
        if (page == totpage) {
            setPage(totpage);
            return;
        } else {
          page++;
          return fetchCatalog(page);  
        }
      }
    
      const prevPage = (event: any) => {
        event.preventDefault();    
        if (page === 1) {
          setPage(1);
          return;
          }
          page--;
          return fetchCatalog(page);
      }
    
      const lastPage = (event: any) => {
        event.preventDefault();
        page = totpage;
        return fetchCatalog(page);
      }

    return(
    <div className="container mt-2 mb-9">
            <h3 className="text-warning embossed mt-3">Products Catalog</h3>
            <div className="text-warning">{message}</div>
            <div className="card-group mb-3">
            {prods.map((item) => {
                    return (
                      <div className='col-md-4'>
                      <div key={item['id']} className="card mx-3 mt-3">
                          <img src={`http://127.0.0.1:3000/assets/products/${item['productpicture']}`} className="card-img-top product-size" alt=""/>
                          <div className="card-body">
                            <h5 className="card-title">Descriptions</h5>
                            <p className="card-text desc-h">{item['descriptions']}</p>
                          </div>
                          <div className="card-footer">
                            <p className="card-text text-danger"><span className="text-dark">PRICE :</span>&nbsp;<strong>&#8369;{toDecimal(item['sellprice'])}</strong></p>
                          </div>  
                      </div>
                      
                      </div>
        
                      );
            })}
          </div>    

        <div className='container'>
        <nav aria-label="Page navigation example">
        <ul className="pagination sm">
          <li className="page-item"><Link onClick={lastPage} className="page-link sm" to="/#">Last</Link></li>
          <li className="page-item"><Link onClick={prevPage} className="page-link sm" to="/#">Previous</Link></li>
          <li className="page-item"><Link onClick={nextPage} className="page-link sm" to="/#">Next</Link></li>
          <li className="page-item"><Link onClick={firstPage} className="page-link sm" to="/#">First</Link></li>
          <li className="page-item page-link text-danger sm">Page&nbsp;{page} of&nbsp;{totpage}</li>
        </ul>
      </nav>
      <div className='text-warning'><strong>Total Records : {totalrecords}</strong></div>

      <br/><br/>
      </div>
  </div>
  )
}
