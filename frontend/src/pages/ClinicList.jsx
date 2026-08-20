import { useState } from 'react'

import CitySearchTab from '../components/CitySearchTab'
import NearMeTab from '../components/NearMeTab'

export default function ClinicList() {
  const [activeTab, setActiveTab] = useState('nearby')

  return (
    <main className="mx-auto max-w-6xl px-4 py-32 sm:px-6">
      <div className="flex flex-col items-center text-center animate-[fade-in-up_1s_cubic-bezier(0.32,0.72,0,1)_forwards] opacity-0 [animation-delay:200ms]">
        <div className="mb-4 inline-block rounded-full bg-soft-border px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-soft-text">
          Healthcare Network
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-soft-text sm:text-7xl">
          Find a clinic
        </h1>
        <p className="mt-6 text-lg text-soft-muted max-w-2xl">
          Discover trusted care nearby or search across the country with our premium healthcare network.
        </p>
      </div>
      
      <div className="mt-20 flex justify-center animate-[fade-in-up_1s_cubic-bezier(0.32,0.72,0,1)_forwards] opacity-0 [animation-delay:400ms]">
        <div className="inline-flex rounded-full p-1.5 ring-1 ring-soft-border bg-soft-border/50 shadow-soft-inner">
          <button 
            onClick={() => setActiveTab('nearby')} 
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-700 ease-fluid ${
              activeTab === 'nearby' 
                ? 'bg-soft-surface text-soft-text shadow-sm' 
                : 'text-soft-muted hover:text-soft-text hover:bg-soft-surface/50'
            }`}
          >
            Near Me
          </button>
          <button 
            onClick={() => setActiveTab('city')} 
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-700 ease-fluid ${
              activeTab === 'city' 
                ? 'bg-soft-surface text-soft-text shadow-sm' 
                : 'text-soft-muted hover:text-soft-text hover:bg-soft-surface/50'
            }`}
          >
            Search by City
          </button>
        </div>
      </div>
      
      <div className="mt-16 animate-[fade-in-up_1s_cubic-bezier(0.32,0.72,0,1)_forwards] opacity-0 [animation-delay:600ms]">
        {activeTab === 'nearby' ? <NearMeTab /> : <CitySearchTab />}
      </div>
    </main>
  )
}
