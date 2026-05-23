import { forwardRef } from 'react'
import { CAIFLogo } from './CAIFLogo'

interface IndividualPosterProps {
  photo: string | null
  name: string
  title: string
  type?: 'individual' | 'group'
}

export const Poster = forwardRef<HTMLDivElement, IndividualPosterProps>(
  ({ photo, name, title, type = 'individual' }, ref) => {
    return (
      <div className='h-175 w-135 bg-orange text-xl text-left text-white overflow-hidden' ref={ref}>
        <div className="flex px-8 justify-between text-left mb-6 pt-6">
          <div className='text-5xl w-3/5 font-bold'>{type === 'individual' ? "I'll" : "We'll"} be attending</div>
          <CAIFLogo className='-mt-10'/>
        </div>
        <div className="z-10 flex justify-center">
          <div className="size-140">
            <div className='size-full bg-white rounded-full overflow-hidden border-none outline-none'>
              {photo ? (
                <img
                  src={photo}
                  alt="group"
                  className='size-full object-cover border-none outline-none'
                />
              ) : (
                <div
                  className='size-full object-cover bg-[#e5e7eb] flex items-center justify-center'
                >
                  <svg width="90" height="90" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                      stroke="#9ca3af"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle cx="9" cy="7" r="4" stroke="#9ca3af" strokeWidth="1.5" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-green h-70 w-135 -mt-65 z-50 relative p-4">
          <div className='mb-6'>Find me where ideas are in Motion</div>
          <div className='font-semibold text-4xl'>{name || "John Doe Jonathan"}</div>
          <div>{title || "Founder Electro Co."}</div>
          <div className="flex w-full justify-between items-end text-sm">
            <div className='mb-2 font-semibold'>#CAIF2026</div>
            <div className='w-45 text-right'>
              May 29 - 30, 2026 <br />
              89, Chestnut ST <br />
              Toronto, ON
            </div>

          </div>
        </div>
      </div>
    )
  }
)

