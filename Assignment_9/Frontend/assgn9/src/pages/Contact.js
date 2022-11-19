import React from 'react'
import Card from '../components/card'
import Navbar from '../components/navbar';

function Contact() {
  return (
    <div className='App'>
      <Navbar />
      <Card
        title='Contact'
        imageUrl='https://foyr.com/learn/wp-content/uploads/2021/08/design-your-dream-home.jpg'
        body='This is the website Home page'
      />
    </div>
  )
}

export default Contact;