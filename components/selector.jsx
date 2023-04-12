import { useState } from 'react';
import { RxCaretDown } from 'react-icons/rx';
import { BsArrowDown } from 'react-icons/bs';
import { CgOptions } from 'react-icons/cg';
import { RiCloseLine } from 'react-icons/ri';
import { FiSearch } from 'react-icons/fi';
import Image from 'next/image';
import { coinsList } from '@/data/coins';

const initialType2Data = {
    value: '',
    currentPrice: 0.00,
    name: 'ETH',
    img: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02Ljk3NyAxNy45NDJMLjAyOSAxMy44NGw2Ljk0OCA5Ljc5MiA2Ljk1Mi05Ljc5Mi02Ljk1MyA0LjEwM3pNNy4wODIuOTlMLjEzNCAxMi41Mmw2Ljk0OCA0LjEwOCA2Ljk0Ny00LjEwNEw3LjA4Mi45OXoiIGZpbGw9IiMwMDAiLz48L3N2Zz4='
}

const initialType1Data = {
    value: '',
    currentPrice: 0.00,
    name: '',
    img: ''
}

function Selector({ setMaker, setTaker }) {
  const [activeTab, setActiveTab] = useState(1);
  const [transform, setTransform] = useState(false);
  const [displaySearch, setDisplaySearch] = useState(null);
  const [coinsListData, setCoinsListData] = useState(coinsList);
  const [type, setType] = useState(null);
  const [active, setActive] = useState(false);
  const [type2Data, setType2Data] = useState(initialType2Data);
  const [type1Data, setType1Data] = useState(initialType1Data);


  const handleType = (type) => {
    console.log('type', type)
    setType(type);
    type === 1 ? setDisplaySearch('you_pay') : setDisplaySearch('you_receive');
    type === 1 && setActive(true)
  }

  const handleSearch = (e) => {
      const { value } = e.target;

    // Search for a specific coin
    // Convert input and names of coins list to lowercase before compare
    setCoinsListData(coinsList.filter(newArr => (
        String(newArr.name).toLowerCase().includes(String(value).toLowerCase()) ||  String(newArr.abbreviation).toLowerCase().includes(String(value).toLowerCase())
    )))
  }

  const handleChosenCoin = (coin) => {
    setDisplaySearch(null);

    if(type === 1) {
        setType1Data(prevData => ({...prevData, name: coin.abbreviation, img: coin.img}));
        setMaker(coin)
    } else {
        setType2Data(prevData => ({...prevData, name: coin.abbreviation, img: coin.img}))
        setTaker(coin);
    }

    setCoinsListData(coinsList.filter(c => c.id !== coin.id))
  }

  return (
    <div className='w-[550px] shadow-[0_0_20px_-5px_rgba(0,0,0,.2)] rounded-2xl py-4 relative'>
        <div className='flex justify-between items-center px-6 border-b border-gray-200 mb-6'>
            <div className='flex gap-x-5'>
            <button onClick={() => setActiveTab(1)} className={`${activeTab === 1 ? 'border-b-2 text-primary-color' : 'text-secondary-color'} border-secondary-color w-fit sm-text py-3 cursor-pointer transition-all block`}>Market</button>
            <button disabled onClick={() => setActiveTab(2)} className={`${activeTab === 2 ? 'border-b-2 text-primary-color' : 'text-secondary-color'} border-secondary-color w-fit sm-text py-3 cursor-not-allowed transition-all block`}>Limit</button>
            </div>
            <div>
                <CgOptions className='text-[rgba(112,110,255,.7)] text-xl mr-1 cursor-pointer'/>
            </div>
        </div>

        <div>
            <div className={`flex ${transform ? 'flex-col-reverse' : 'flex-col'}`}>
                <div className='pb-3'>
                    {transform ? 
                    <h5 className='mx-6 sm-text pb-5 text-primary-color'>You Receive</h5>
                    :
                    <h5 className='mx-6 sm-text pb-5 text-primary-color'>You Pay</h5>
                    }

                    {
                        active ?
                            <div className='flex justify-between px-6 pl-5 items-center'>
                                <div onClick={() => handleType(1)} className='flex items-center hover:bg-slate-100 rounded-md p-1 py-2 cursor-pointer'>
                                    <div className='w-[26px] h-[26px] rounded-full flex justify-center items-center border border-[rgba(0,0,0,0.16)] mr-2 bg-[rgba(45,114,218,0.1)]'>
                                        <Image width="12" height="12" className='object-cover' src={type1Data.img} alt="etherum" />
                                    </div>
                                    <h4 className='lg-text text-primary-color'>{type1Data.name}</h4>
                                    <RxCaretDown className='ml-[.2rem] text-2xl'/>
                                </div>
                                <div className='text-right w-1/2 bg-[rgb(247,247,255)] rounded-2xl px-3 py-1'>
                                    <input className='text-right w-full lg-text text-primary-color outline-none bg-transparent placeholder:text-secondary-color' value={type1Data.value} onChange={(e) => setType2Data(prevData => ({...prevData, value: e.target.value}))} type='number' placeholder='0'/>
                                    <p className='text-[.9rem] font-medium text-secondary-color mt-1'>${Number(type1Data.currentPrice).toFixed(2)}</p>
                                </div>
                            </div>
                        :
                            <div 
                                onClick={() => handleType(1)} 
                                className='mx-5 lg-text flex items-center text-primary-color hover:bg-slate-50 cursor-pointer w-[12.1rem] p-1 py-2 rounded-md'
                            >
                                <h3>Choose Token</h3>
                                <RxCaretDown className='ml-2'/>
                            </div>
                    }
                </div>

                <div className='relative mt-[2rem] mb-[1.5rem]'>
                    <hr />
                    <div onClick={() => {
                        setTransform(!transform);
                    }} className='w-[2.3rem] h-[2.3rem] bg-white border border-gray-200 rounded-full flex justify-center items-center absolute left-[calc(50%_-_1.5rem)] top-[-1.3rem] hover:border-[rgba(112,110,255,.5)] cursor-pointer'>
                        <BsArrowDown className='text-secondary-color text-[1.3rem]'/>
                    </div>
                </div>

                <div>
                    {transform ? 
                    <h5 className='mx-6 sm-text pb-2 text-primary-color'>You Pay</h5>
                    :
                    <h5 className='mx-6 sm-text pb-2 text-primary-color'>You Receive</h5>
                    }

                    <div className='flex justify-between px-6 pl-5 items-center'>
                        <div onClick={() => handleType(2)} className='flex items-center hover:bg-slate-100 rounded-md p-1 py-2 cursor-pointer'>
                            <div className='w-[26px] h-[26px] rounded-full flex justify-center items-center border border-[rgba(0,0,0,0.16)] mr-2 bg-[rgba(45,114,218,0.1)]'>
                                <Image width="12" height="12" className='object-cover' src={type2Data.img} alt="etherum" />
                            </div>
                            <h4 className='lg-text text-primary-color'>{type2Data.name}</h4>
                            <RxCaretDown className='ml-[.2rem] text-2xl'/>
                        </div>
                        <div className='text-right w-1/2 bg-[rgb(247,247,255)] rounded-2xl px-3 py-1'>
                            <input className='text-right w-full lg-text text-primary-color outline-none bg-transparent placeholder:text-secondary-color' value={type2Data.value} onChange={(e) => setType2Data(prevData => ({...prevData, value: e.target.value}))} type='number' placeholder='0'/>
                            <p className='text-[.9rem] font-medium text-secondary-color mt-1'>${Number(type2Data.currentPrice).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>


            <div className='px-6'>
                <button className='text-center bg-secondary-color text-white w-full p-4 mt-3 rounded-xl hover:opacity-90'>Connect Wallet</button>
            </div>
        </div>

        {/* Display search ovelay */}
        {
            displaySearch &&
            <div className='bg-white absolute left-0 right-0 top-0 bottom-0 z-1 py-4 rounded-2xl'>
                <div className='flex justify-between items-center px-6 border-gray-200 mb-5 relative'>
                    <h5 className='sm-text text-primary-color'>{displaySearch === 'you_receive' ? 'You Receive' : 'You Pay'}</h5>

                    <div>
                        <RiCloseLine className='text-slate-500 text-2xl cursor-pointer' onClick={() => {
                            setDisplaySearch(null);
                            setType(null)
                        }}/>
                    </div>
                </div>
            
                <div className='flex items-center mx-6 pb-2 border-b focus-within:border-b-2 focus-within:border-[rgb(112,110,255,.5)] mb-4'>
                    <FiSearch className='text-primary-color mr-2 text-[1.1rem]'/>
                    <input onChange={(e) => handleSearch(e)} type='text' placeholder='Search or paste any token' autoFocus className='w-full outline-none sm-text'/>
                </div>

                <div className='mx-8 h-[calc(100%_-_6rem)] overflow-auto'>

                    {coinsListData.length > 0 ?
                    coinsListData.map((item) => (
                        <div key={item.id} onClick={() => handleChosenCoin(item)} className={`flex items-center px-2 py-2 mb-2 cursor-pointer border rounded-2xl border-transparent ${'border'-item.color} hover:border-[${item.color}]`}>
                            <div className={`border-[2px] border-primary-color rounded-full w-[50px] h-[50px] flex items-center justify-center`} style={{backgroundColor: item.color}}>
                                <Image width={24} height={24} src={item.img || ''} alt={item.name}/>
                            </div>
                            <h4 className='ml-3 sm-text'>{item.name} <span className='text-secondary-color'> - {item.abbreviation}</span></h4>
                        </div>
                    ))
                    :
                    <div className='bg-[rgb(246,246,255)] py-8 rounded-2xl'>
                        <p className='text-center text-slate-500'>We can’t find this token</p>
                    </div>
                    }
                    <div className='absolute bottom-[-1.5rem] right-0 left-0 h-[6rem] bg-gradient-to-t from-transparent via-white to-transaparent'></div>
                </div>

            </div>
        }
    </div>
  )
}



export default Selector