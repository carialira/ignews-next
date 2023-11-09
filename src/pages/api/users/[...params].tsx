import { NextApiRequest, NextApiResponse } from "next";
import { use } from "react";

export default (request: NextApiRequest, reponse: NextApiResponse) => {
  const query = request.query.params;
  console.log(query[0], "t");

  let users = [
    { id: 1, name: "Ari" },
    { id: 2, name: "Gabs" },
    { id: 3, name: "Roze" },
    { id: 4, name: "Be" },
  ];

  if (query) {
    users = users.filter((u: any) => Number(u.id) === Number(query[0]));
  }

  return reponse.json(users);
};
