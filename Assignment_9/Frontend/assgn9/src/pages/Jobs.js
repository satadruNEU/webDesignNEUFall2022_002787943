import React from 'react'
import Card from '../components/card'
import Navbar from '../components/navbar';

function Jobs() {
  return (
    <div className='App'>
      <Navbar />
      <Card
        title='Jobs'
        imageUrl='https://mdbcdn.b-cdn.net/img/Photos/Slides/img%20(22).webp'
        body='No openings available. Recession time'
      />
    </div>
  )
}

export default Jobs;