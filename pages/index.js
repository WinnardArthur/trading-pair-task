import Head from 'next/head'
import Selector from '@/components/selector';
import Table from '@/components/table';
import { useEffect, useState } from 'react';


export default function Home() {
  const [maker, setMaker] = useState(null); 
  const [taker, setTaker] = useState(null);
  const [results, setResults] = useState([]);
  
  const endpoint = `wss://api.0x.org/orderbook/v1`;
  
  useEffect(() => {
    if(maker && taker) {
      const conn = new WebSocket(endpoint);

      conn.onopen = () => {
        conn.send(JSON.stringify({
          "type": 'subscribe',
          "channel": 'orders',
          "requestId": "123e4567-e89b-12d3-a456-426655440123",
          request: {
            makerToken: String(maker.address).toLowerCase(),
            takerToken: String(taker.address).toLowerCase(),
          },
          limit: 10
        }))
      }

      conn.onmessage = (event) => {
        setResults(JSON.parse(event.data))
      }

      conn.onerror = (error) => {
        console.log('An error occured:', error)
      }

      conn.onclose = () => {
        console.log('Closing connection')
      }

      return () => {
        conn.close();
      }
    }

  }, [maker, taker])


  // console.log('maker', maker?.abbreviation, String(maker?.address).toLowerCase());
  // console.log('taker', taker?.abbreviation, String(taker?.address).toLowerCase());

  // console.log('results', results)

  return (
    <>
      <Head>
        <title>risk-fe-test-task</title>
        <meta name="description" content="risk-fe-test-task" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main >
        <div className='py-[5rem] px-[5%] flex items-start justify-between gap-x-8'>
          <div className='w-full h-full rounded-md'>
            {(maker && taker) &&
              <p className='text-gray-500 font-medium'>{maker?.abbreviation}/{taker?.abbreviation}</p>
            }
            <Table maker={maker} taker={taker} results={results}/>
          </div>

          <Selector setMaker={setMaker} setTaker={setTaker}/>
        </div>
      </main>
    </>
  )
}
