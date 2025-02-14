'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const TabsComponent = ({ items }:{items:{title:string,content:React.ReactNode}[]}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const firstBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstBtnRef.current?.focus();
  }, []);

  return (
    <div className=' flex   py-12'>
      <div className=' flex flex-col gap-y-2 w-full'>
        <div className=' p-1  rounded-xl flex justify-between items-center gap-x-2 font-bold text-white'>
          {items.map((item, index) => (
            <button
              ref={index === 0 ? firstBtnRef : null}
              key={index}
              onClick={() => setSelectedTab(index)}
              className={`outline-none w-full p-2 hover:bg-blue-300 rounded-xl text-cneter focus:ring-2 focus:bg-blue-600 focus:text-white ${
                selectedTab === index ? 'bg-blue-600 text-white' : 'ring-2 bg-white text-blue-600'
              } `}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className='bg-white p-2 rounded-xl'>
          {items.map((item, index) => (
            <div
              key={index}
              className={`${selectedTab === index ? '' : 'hidden'}`}
            >
                    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
              {item.content}
                    </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabsComponent;