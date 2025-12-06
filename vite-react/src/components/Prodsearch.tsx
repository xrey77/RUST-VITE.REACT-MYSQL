import axios from 'axios';
import { useState } from 'react';

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


export default function Prodsearch() {
  let [message, setMessage] = useState('');
  let [prodsearch, setProdsearch] = useState<[]>([]);
  let [page, setPage] = useState<number>(1);
  let [totpage, setTotpage] = useState<number>(0);
  let [totalrecords, setTotalrecords] = useState<number>(0);
  let [searchkey, setSearchkey] = useState<string>('');

  const getProdsearch = async (event: any) => {
      event.preventDefault();
      setMessage("please wait .");
      await api.get(`auth/products/search/${page}/${searchkey}`)
      .then((res: any) => {
          setProdsearch(res.data.products);
          setTotpage(res.data.totpage);
          setTotalrecords(res.data.totalrecords)
          setPage(res.data.page);
          setTimeout(() => {
            setMessage('');
          }, 1000);

      }, (error: any) => {     
        if (error.response){
          setMessage(error.response.data.message);
        } else {
          setMessage(error.message);
        }
        setProdsearch([]);
        setTimeout(() => {
            setMessage('');
        }, 3000);
          return;
      });  
  }

  const getProdPage = async (page: number) => {
    setMessage("please wait .");
    await api.get(`/auth/products/search/${page}/${searchkey}`)
    .then((res: any) => {
        setProdsearch(res.data.products);
        setTotpage(res.data.totpage);
        setPage(res.data.page);
        setTimeout(() => {
          setMessage('');
        }, 1000);


    }, (error: any) => {        
      if (error.response){
        setMessage(error.response.data.message);
      } else {
        setMessage(error.message);
      }
      setProdsearch([]);
      setTimeout(() => {
          setMessage('');
      }, 3000);
        return;
    });  
}

  const firstPage = (event: any) => {
    event.preventDefault();    
    page = 1;
    return getProdPage(page);
  }

  const nextPage = (event: any) => {
    event.preventDefault();    
    if (page == totpage) {
        page = 0;
        setPage(totpage);
        return;
    } else {
      page++;
      return getProdPage(page);  
    }
  }

  const prevPage = (event: any) => {
    event.preventDefault();    
    if (page === 1) {
      setPage(1);
      return;
      }
      page--;
      return getProdPage(page);
  }

  const lastPage = (event: any) => {
    event.preventDefault();
    page = totpage;
    return getProdPage(page);
  }  
   
return (
  <div className="container-fluid mb-10">
      <h2 className='text-warning embossed mt-3'>Products Search</h2>

      <form className="row g-3" onSubmit={getProdsearch} autoComplete='off'>
          <div className="col-auto">
            <input type="text" required className="form-control-sm" value={searchkey} onChange={e => setSearchkey(e.target.value)} placeholder="enter Product keyword"/>
            <div className='searcMsg text-warning'>{message}</div>
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary btn-sm mb-3">search</button>
          </div>

      </form>
      <div className="container-fluid mb-9">
        <div className="card-group">
      {prodsearch.map((item) => {
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
        {
          totpage > 1 ? 
          <>
          <nav aria-label="Page navigation example">
            <ul className="pagination sm mt-3">
              <li className="page-item"><a onClick={lastPage} className="page-link sm" href="/#">Last</a></li>
              <li className="page-item"><a onClick={prevPage} className="page-link sm" href="/#">Previous</a></li>
              <li className="page-item"><a onClick={nextPage} className="page-link sm" href="/#">Next</a></li>
              <li className="page-item"><a onClick={firstPage} className="page-link sm" href="/#">First</a></li>
              <li className="page-item page-link text-danger sm">Page&nbsp;{page} of&nbsp;{totpage}</li>
            </ul>
          </nav>
          <div className='text-warning'><strong>Total Records : {totalrecords}</strong></div>
          </>
        :
        null
        }

        <br/><br/><br/>
      </div>
  </div>  
  )
}

