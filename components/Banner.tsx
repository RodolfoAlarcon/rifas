import Image from 'next/image';

export const Banner = () => {
  return (
    <div className="relative w-full h-30 md:h-30 overflow-hidden bg-[#b1b1b1]">
        <div className='w-full max-w-5xl flex gap-10 items-center justify-between mx-auto h-full'>
            <div className='hidden flex-1 w-full h-full md:flex items-center justify-end'>
                <div>
                  <p className='text-2xl text-white font-bold text-center'>
                    LOS MEJORES <br />
                    <strong className='text-[#b91419] text-4xl'>PREMIOS</strong>
                  </p>
                </div>
            </div>
            <div className='flex-1 w-full h-full flex items-center justify-center'>
              <img src={"/logo.png"} alt="" className='w-full max-w-50 md:max-w-50 h-22'/>
            </div>
            <div className='hidden flex-1 w-full h-full md:flex items-center justify-start'>
                <div>
                  <p className='text-2xl text-white font-bold text-center'>
                    DONDE TODOS <br />
                    <strong className='text-[#b91419] text-4xl'>GANAN</strong>
                  </p>
                </div>
            </div>
        </div>
    </div>
  );
};