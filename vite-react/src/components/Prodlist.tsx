import axios from 'axios';
import { useState, useEffect } from 'react';

const api = axios.create({
  baseURL: "http://127.0.0.1:3000",
  headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'}
})


export default function Prodlist() {

  const toDecimal = (number: any) => {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(number);
  };

    let [page, setPage] = useState<number>(1);
    let [totpage, setTotpage] = useState<number>(0);
    let [totalrecs, setTotalrecs] = useState<number>(0);
    let [message, setMessage] = useState<string>('');
    let [products, setProducts] = useState<[]>([]);

    const fetchProducts = (pg: any) => {
      api.get(`auth/products/list/${pg}`)
      .then((res: any) => {
        setProducts(res.data.products);
        setTotpage(res.data.totpage);
        setTotalrecs(res.data.totalrecords);
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
      fetchProducts(page);
   },[page]);

    const firstPage = (event: any) => {
        event.preventDefault();    
        page = 1;
        fetchProducts(page);
        return;    
      }
    
      const nextPage = (event: any) => {
        event.preventDefault();    
        if (page == totpage) {
            setPage(totpage);
            return;
        }
        page++;
        return fetchProducts(page);
      }
    
      const prevPage = (event: any) => {
        event.preventDefault();    
        if (page === 1) {
          return;
          }
          page--;
          return fetchProducts(page);
      }
    
      const lastPage = (event: any) => {
        event.preventDefault();
        page = totpage;
        return fetchProducts(page);
      }  
  
  return (
    <div className="container">
            <h1 className='text-warning embossed mt-3'>Products List</h1>

            <table className="table table-danger table-striped">
            <thead>
                <tr>
                <th className="bg-primary text-white" scope="col">#</th>
                <th className="bg-primary text-white" scope="col">Descriptions</th>
                <th className="bg-primary text-white" scope="col">Qty</th>
                <th className="bg-primary text-white" scope="col">Unit</th>
                <th className="bg-primary text-white" scope="col">Price</th>
                </tr>
            </thead>
            <tbody>

            {products.map((item) => {
            return (
              <tr key={item['id']}>
                 <td>{item['id']}</td>
                 <td>{item['descriptions']}</td>
                 <td>{item['qty']}</td>
                 <td>{item['unit']}</td>
                 <td>&#8369;{toDecimal(item['sellprice'])}</td>
               </tr>
              );
            })}

            </tbody>
            </table>

            <nav aria-label="Page navigation example">
        <ul className="pagination sm">
          <li className="page-item"><a onClick={lastPage} className="page-link sm" href="/#">Last</a></li>
          <li className="page-item"><a onClick={prevPage} className="page-link sm" href="/#">Previous</a></li>
          <li className="page-item"><a onClick={nextPage} className="page-link sm" href="/#">Next</a></li>
          <li className="page-item"><a onClick={firstPage} className="page-link sm" href="/#">First</a></li>
          <li className="page-item page-link text-danger sm">Page&nbsp;{page} of&nbsp;{totpage}</li>

        </ul>
      </nav>
      <div className='text-warning'><strong>Total Records : {totalrecs}</strong></div>
      <div className='text-warning'>{message}</div>
    </div>    
  )
}
