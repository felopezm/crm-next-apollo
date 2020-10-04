import React from 'react';
import { Router, useRouter } from 'next/router';

import { useQuery, gql } from '@apollo/client';

const GET_USER = gql`
    query getUser{
        getUser{
        id
        email
        full_name
        }
    }
`;

const Header = () => {

    const router = useRouter();

    const { data, loading, error } = useQuery(GET_USER);

    if(loading) return 'Loading...';

    if(!data) return router.push('/login');

    const singOut = () =>{
        localStorage.removeItem('token');
        router.push('/login');
    }

    return ( 
        <div className="flex justify-between mb-6">
            <p className="mr-2">Hola {data.getUser.full_name}</p>

            <button
                onClick={() => singOut()}
                type="button"
                className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white  shadow-md"
            >
               Sing Out
            </button>
        </div>
     );
}
 
export default Header;