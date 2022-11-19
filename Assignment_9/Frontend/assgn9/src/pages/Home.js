import React from 'react'
import Card from '../components/card'
import Navbar from '../components/navbar';

function Home() {
  return (
    <div className='App'>
      <Navbar />
      <Card
        title='Home'
        imageUrl='https://foyr.com/learn/wp-content/uploads/2021/08/design-your-dream-home.jpg'
        body='This is the website Home page'
      />
    </div>
  )
}

export default Home;