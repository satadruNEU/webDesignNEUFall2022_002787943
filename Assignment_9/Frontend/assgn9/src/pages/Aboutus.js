import React from 'react'
import Card from '../components/card'
import Navbar from '../components/navbar';

function Aboutus() {
  return (
    <div className='App'>
      <Navbar />
      <Card
        title='Aboutus'
        imageUrl='https://foyr.com/learn/wp-content/uploads/2021/08/design-your-dream-home.jpg'
        body='This is the website Home page'
      />
    </div>
  )
}

export default Aboutus;