import { NextApiRequest, NextApiResponse } from "next"
import { use } from "react"



export default (request:NextApiRequest, reponse:NextApiResponse) => {
  const users = [
    {id:1, name:'Ari'},
    {id:2, name:'Gabs'},
    {id:3, name:'Roze'},
    {id:4, name:'Be'},
  ]

  return reponse.json(users)
}