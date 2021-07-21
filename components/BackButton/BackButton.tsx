import Link from 'next/link'
import React from 'react'

type BackButtonProps ={
  title: string
  href: string
}
const BackButton : React.FC<BackButtonProps> = ({title, href}) =>{
  return (
    <>
        <Link href={href} >
          <a>
            <div className='d-flex mb-20 mt-30 '>
              <img src='/static/back-arrow.svg' alt="Back" className="mr-10"/>
              <h3 className='cup'>{title}</h3>
            </div>
          </a>
        </Link>
    </>
  )
}

export default BackButton
