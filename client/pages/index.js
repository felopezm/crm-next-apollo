import { useQuery, gql } from '@apollo/client';
import Link from 'next/link';

import Layout from '../components/Layout';
import Client from '../components/Client';


const GET_CLIENTS_VENDOR = gql`
  query getClientsVendor{
    getClientsVendor{
      id
      full_name
      company
      email
    }
  }
`;

const Index = () => {  

  const { data, loading, error } = useQuery(GET_CLIENTS_VENDOR);

  if(loading) return 'Loading...';
  
  if(!data.getClientsVendor){
     window.location.href = 'login';
  }

  return (
    <div>
      <Layout>
         <h1 className="text-2xl text-gray-800 font-light">Clients</h1>
         <Link href="/newClient">
           <a 
            className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold"
            >
             New Client
             </a>
         </Link>

         <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-white">
                  <th className="w-1/5 py-2">Name</th>
                  <th className="w-1/5 py-2">Company</th>
                  <th className="w-1/5 py-2">email</th>
                  <th className="w-1/5 py-2">Edit</th>
                  <th className="w-1/5 py-2">Remove</th>                 
              </tr>
            </thead>

            <tbody className="bg-white">
              {data.getClientsVendor.map( client => (
                <Client 
                  key={client.id}
                  client={client}
                />
              ))}
            </tbody>
         </table>
      </Layout>
    </div>
  )
}

export default Index;
