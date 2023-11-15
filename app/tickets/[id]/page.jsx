import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import Loading from '@/app/loading'

export const dynamicParams = true

export async function generateStaticParams()
{
    const res = await fetch('http://localhost:4000/tickets')

    const tickets = await res.json()

    return tickets.map((ticket) => ({

        id: ticket.id
    }))
}

async function getTicket(id) {

    // await new Promise(resolve => setTimeout(resolve, 3000))
    const res = await fetch('http://localhost:4000/tickets/' + id, {
        next : {
            revalidate: 60 // use 0 to opt out of using cache
        }
    })

    if (!res.ok) {
        notFound()
    }

    return res.json()
}

export default async function TicketDetails({ params }) {

    const ticket = await getTicket(params.id)

  
  return (
    <main>
        <nav>
            <h2>Ticket Details</h2>
        </nav>

        <Suspense fallback = {<Loading/>}>
                <div className="card">
                    <h3>{ticket.title}</h3>
                    <small>Created By {ticket.user_email}</small>
                    <p>{ticket.body}</p>
                    <div className={`pill ${ticket.priority}`}>
                        {ticket.priority} priority

                    </div>
                </div>   
        </Suspense>

       
    </main>
  )
}
