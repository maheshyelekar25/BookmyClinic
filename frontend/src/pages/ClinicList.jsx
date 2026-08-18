import { useState } from 'react'

import CitySearchTab from '../components/CitySearchTab'
import NearMeTab from '../components/NearMeTab'

export default function ClinicList() {
  const [activeTab, setActiveTab] = useState('nearby')

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Find a clinic</h1>
      <p className="mt-2 text-slate-600">Discover trusted care nearby or search across India.</p>
      <div className="mt-8 border-b border-slate-200">
        <button onClick={() => setActiveTab('nearby')} className={`mr-6 border-b-2 px-1 pb-3 text-sm font-semibold ${activeTab === 'nearby' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500'}`}>Near Me</button>
        <button onClick={() => setActiveTab('city')} className={`border-b-2 px-1 pb-3 text-sm font-semibold ${activeTab === 'city' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500'}`}>Search by City</button>
      </div>
      <div className="mt-6">{activeTab === 'nearby' ? <NearMeTab /> : <CitySearchTab />}</div>
    </main>
  )
}
