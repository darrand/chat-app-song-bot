import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { BiPowerOff } from "react-icons/bi"

export default function Logout() {
    const navigate = useNavigate()
    const handleClick = () => {
        localStorage.clear()
        navigate("/login")
    }
  return (
    <Button>
        <BiPowerOff onClick={handleClick}/>
    </Button>
  )
}

const Button = styled.button`
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #9a86f4;
    border: none;
    cursor: pointer;
    svg {
        font-size: 1.3rem;
        color: #ebe7ff;
    }
`;