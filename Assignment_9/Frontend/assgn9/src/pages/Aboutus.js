import React from 'react'
import Card from '../components/card'
import Navbar from '../components/navbar';

function Aboutus() {
  return (
    <div className='App'>
      <Navbar />
      <Card
        title='About Us'
        imageUrl='https://mdbcdn.b-cdn.net/img/Photos/Slides/img%20(18).webp'
        body='About us can be found here about the company'
      />
    {/* <button className='btn1'>Logout</button> */}
    </div>
  )
}

export default Aboutus;