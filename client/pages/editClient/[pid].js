import React from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, gql } from '@apollo/client';
import Swal from 'sweetalert2';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Layout from '../../components/Layout';

const GET_CLIENT = gql`
  query getClient($id: ID!){
    getClient(id:$id){
      id
      full_name
      company
      email
      telephone
    }
  }
`;

const UPDATE_CLIENT = gql`
    mutation updateClient($id: ID!,$input: ClientInput){
        updateClient(id:$id,input:$input){
        id
        full_name
    }
    }
`;

const EditClient = () => {
    // get id client from url
    const router = useRouter();
    const { query: {id} } = router;

    const { data, loading, error } = useQuery(GET_CLIENT,{
        variables:{
            id
        }
    });

     // mutation
     const [ updateClient] = useMutation(UPDATE_CLIENT);

    if(loading) return 'Loading...';

    // console.log('data', data);
    // console.log('loading', loading);
    // console.log('error', error);
    
    const { getClient } = data;

    const schemaValidation =  Yup.object({
        full_name: Yup.string().required('Full Name required..'),
        email: Yup.string().email('email not valid..').required('Email required..'),
        company: Yup.string().required('Company required..'),
        telephone: Yup.string().required('Telephone required..')
    });

    const updateInfoClient = async values => {
        const { full_name, email, company, telephone } = values;

        try {
            const { data } = await updateClient({
                variables:{
                    id,
                    input:{
                        full_name, email, company, telephone
                    }
                }
            });

            Swal.fire(
                'client Edited!',
                 data.updateClient.full_name,
                'success'
            );

            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    return ( 
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Edit client</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema={ schemaValidation }
                        enableReinitialize
                        initialValues={ getClient }
                        onSubmit={ (values) => {
                            updateInfoClient(values);
                        }}
                    >

                     { props => {
                        

                         return (
                            <form
                                className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                                onSubmit={props.handleSubmit}
                            >
                                { props.touched.full_name && props.errors.full_name ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{props.errors.full_name}</p>
                                    </div>
                                ) : null }
    
                                <div className="mt-4">
                                    <label className="block text-gray-700 text-sm font-bold md-2" htmlFor="full_name">
                                    Full Name
                                    </label>
                                    <input 
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="full_name"
                                        type="text"
                                        placeholder="Full Name Client.."
                                        value={props.values.full_name}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />                        
                                </div>
    
                                { props.touched.email && props.errors.email ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{props.errors.email}</p>
                                    </div>
                                ) : null }
    
                                <div className="mt-4">
                                    <label className="block text-gray-700 text-sm font-bold md-2" htmlFor="email">
                                    Email
                                    </label>
                                    <input 
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="email"
                                        type="email"
                                        placeholder="Email Client.."
                                        value={props.values.email}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />                        
                                </div>
    
                                { props.touched.company && props.errors.company ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{props.errors.company}</p>
                                    </div>
                                ) : null }
    
                                <div className="mt-4">
                                    <label className="block text-gray-700 text-sm font-bold md-2" htmlFor="company">
                                    Company
                                    </label>
                                    <input 
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="company"
                                        type="text"
                                        placeholder="Company Client.."
                                        value={props.values.company}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />                        
                                </div>
    
                                { props.touched.telephone && props.errors.telephone ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{props.errors.telephone}</p>
                                    </div>
                                ) : null }
    
                                <div className="mt-4">
                                    <label className="block text-gray-700 text-sm font-bold md-2" htmlFor="telephone">
                                    Telephone
                                    </label>
                                    <input 
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="telephone"
                                        type="tel"
                                        placeholder="Telephone Client.."
                                        value={props.values.telephone}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />                        
                                </div>
    
                                <input 
                                    type="submit"
                                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercas font-bold hover:bg-gray-900"
                                    value="Edit"
                                />
                        </form> 
                        
                         )
                     }}
                    </Formik>   
                </div>
            </div>
       
        </Layout>
     );
}
 
export default EditClient;