import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function Home() {
  const router = useRouter();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const handleExistingLogin = async () => {
    router.push('/login');
  }

  return (
    <>
      <div className="text-center w-full">
        <div className="text-center">
          <h1 className="text-6xl sm:text-8xl">
            <span className="text-slate-300">My Helpdesk</span>
          </h1>
          <h2 className="text-2xl opacity-70"></h2>
        </div>
        <p className="text-xl mt-4 ml-2 mr-2 ">
          Breathe a sigh of relief, a helpdesk that works!
        </p>
        <div className="mt-8 text-center relative">
          <button onClick={() => handleExistingLogin()} className={` z-90 text-white font-bold py-2 px-4 bg-slate-500 rounded hover:cursor-pointer ${formSubmitted === true ? " transition delay-100 opacity-0" : ""}`}>
            Get Help
          </button>
        </div>

        <footer className={styles.footer}>
          <a
            href="http://www.ampli.city"
            target="_blank"
            rel="noopener noreferrer"
          >
            Created for Eric, Shanti, and Kyle.
          </a>
        </footer>
      </div >
    </>

  )
}
