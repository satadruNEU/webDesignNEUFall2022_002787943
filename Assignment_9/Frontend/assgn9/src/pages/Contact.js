import React from 'react'
import Card from '../components/card'
import Navbar from '../components/navbar';

function Contact() {
  return (
    <div className='App'>
      <Navbar />
      <Card
        title='Contact'
        imageUrl='https://mdbcdn.b-cdn.net/img/Photos/Slides/img%20(14).webp'
        body='You can contact us via email or phone.'
      />
    {/* <button className='btn1'>Logout</button> */}
    </div>
  )
}

export default Contact;