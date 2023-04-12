import { useEffect, useState } from 'react'

function Table({ results, maker, taker }) {
    const [bids, setBids] = useState([]);
    const [asks, setAsks] = useState([]);
    const [bidsTableData, setBidsTableData] = useState([]);
    const [asksTableData, setAsksTableData] = useState([]);
    const [orders, setOrders] = useState([]);
    const [bidsRange1, setBidsRange1] = useState(0);
    const [bidsRange2, setBidsRange2] = useState(10);
    const [asksRange1, setAsksRange1] = useState(0);
    const [asksRange2, setAsksRange2] = useState(10);

    useEffect(() => {
      if(results?.payload) {
        let currentOrder = results.payload[0];
        console.log('makerToken', currentOrder.order?.makerToken)
        console.log('takerToken', currentOrder.order?.takerToken)

        const index = orders.findIndex(order => order.metaData?.orderHash === currentOrder.metaData?.orderHash);

        if(index === -1) {
          setOrders((prevOrders) => ([...prevOrders, {...currentOrder.order, remainingFillableTakerAmount: currentOrder.metaData.remainingFillableTakerAmount}]))
        } else if(currentOrder.metaData.remainingFillableTakerAmount === 0) {
          setOrders((prevOrders) => (prevOrders.splice(index, 1)))
        } else {
          setOrders((prevOrders) => (prevOrders[index] = {...currentOrder.order, remainingFillableTakerAmount}))
        }
      }
    }, [results])
    
    useEffect(() => {
      if(orders.length > 0) {    

        orders.forEach(order => {
          if((order.makerToken === String(maker.address).toLowerCase()) || (order.makerToken === String(taker.address).toLowerCase())) {
            let price = order.takerAmount / order.makerAmount;
            let total = order.makerAmount * price;
            let quantity = order.remainingFillableTakerAmount / price;
            setBids((currBids) => ([...currBids, {
              makerAmount: order.makerAmount,  
              takerAmount: order.takerAmount,
              price: Number(price).toFixed(2),
              total: Number(total).toFixed(2),
              quantity: Number(quantity).toFixed(2)
            }]));
          } 

          if((order.takerToken === String(maker.address).toLowerCase()) || (order.takerToken === String(taker.address).toLowerCase())) {
            let price = Number(order.takerAmount / order.makerAmount).toFixed(2)
            let total = order.makerAmount * price;
            let quantity = order.remainingFillableTakerAmount / price;
            setAsks((currAsks) => ([...currAsks, {
              makerAmount: order.makerAmount,  
              takerAmount: order.takerAmount,
              price: Number(price).toFixed(2),
              total: Number(total).toFixed(),
              quantity: Number(quantity).toFixed(2)
            }]));
          }
        })
      }
    }, [orders])

    useEffect(() => {
      if(bids.length % 10 === 0) {
        setBidsTableData(bids.slice(bidsRange1, bidsRange2));
        setBidsRange1(prev => prev + 10);
        setBidsRange2(prev => prev + 10)
      }
      if(asks.length % 10 === 0) {
        setAsksTableData(asks.slice(asksRange1, asksRange2));
        setAsksRange1(prev => prev + 10);
        setAsksRange2(prev => prev + 10);
      }
    }, [JSON.stringify(bids), JSON.stringify(asks)])  

    // console.log('asks', asks.length)
    // console.log('bids', bids.length)
    
    // console.log('asks Table Data', asksTableData.length)
    // console.log('bids Table Data', bidsTableData.length)

    // console.log('Bids Range-1', bidsRange1)
    // console.log('Bids range-2', bidsRange2)

    // console.log('Asks Range-1', asksRange1)
    // console.log('Asks range-2', asksRange2)

  return (
    <div className=' bg-[rgb(18,23,35)] rounded-md h-screen overflow-auto p-2 flex justify-between items-start'>
      <div className='w-[47%]'>
        <table className='w-full table-auto h-screen overflow-auto'>
          <thead>
            <tr className='text-[.95rem] text-[rgb(191,193,200)]'>
              <th className='py-2 font-medium text-left'>Price(USD)</th>
              <th className='py-2 font-medium text-center'>Quantity(USD)</th>
              <th className='py-2 font-medium text-right'>Total(USD)</th>
            </tr>
          </thead>

          <tbody className='text-[.9rem] text-[rgb(191,193,200)]'>
            {asksTableData.map((order, i) => {
              return (
                <tr key={i} className=''>
                  <td className='text-[rgb(17,129,92)]'>{order.price}</td>
                  <td className='pr-8 text-right'>{order.quantity}</td>
                  <td className='pl-4 text-right'>{order.total}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className='w-[47%]'>
        <table className='w-full table-auto h-screen overflow-auto'>
          <thead>
            <tr className='text-[.95rem] text-[rgb(191,193,200)]'>
              <th className='py-2 font-medium text-left'>Total(USD)</th>
              <th className='py-2 font-medium text-center'>Quantity(USD)</th>
              <th className='py-2 font-medium text-right'>Price(USD)</th>
            </tr>
          </thead>

          <tbody className='text-[.9rem] text-[rgb(191,193,200)] '>
            {bidsTableData.map((order, i) => {
              return (
                <tr key={i}>
                  <td className='text-left'>{order.total}</td>
                  <td className='text-left pl-7'>{order.quantity}</td>
                  <td className='text-right text-[rgb(187,51,54)]'>{order.price}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table