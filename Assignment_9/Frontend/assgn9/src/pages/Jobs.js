import React from 'react'
import Card from '../components/card'
import Navbar from '../components/navbar';

function Jobs() {
    const data = [
        {
            id:1, name: "Software Developer: 15 Jobs"
        },
        {
            id:2, name: "Data Analyst: 10 Jobs"
        },
        {
            id:3, name: "UI/UX Designer: 20 Jobs"
        }
    ]
  return (
    <div className='App'>
      <Navbar />
      <Card
        title='Jobs'
        imageUrl='https://mdbcdn.b-cdn.net/img/Photos/Slides/img%20(22).webp'
        body='Available Job Openings:'
      />
      {
         data.map((user)=>(
            <div>{user.name}</div>
         ))
      }
    {/* <button className='btn1'>Logout</button> */}
    </div>
  )
}

export default Jobs;