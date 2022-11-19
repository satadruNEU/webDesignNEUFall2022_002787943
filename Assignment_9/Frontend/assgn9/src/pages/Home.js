import React from 'react'
import Card from '../components/card'
import Navbar from '../components/navbar';

function Home() {
  return (
    <div className='App'>
      <Navbar />
      <Card
        title='Home'
        imageUrl='https://mdbcdn.b-cdn.net/img/Photos/Slides/img%20(10).webp'
        body='Home Page content is here'
      />
    </div>
  )
}

export default Home;