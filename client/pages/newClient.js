import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

import Layout from '../components/Layout';

const NEW_CLIENT = gql`
    mutation newClient($input: ClientInput){
        newClient(input: $input){
        id
            full_name
        }
    }
`;

const NewClient = () => {
    // state message
    const [message, saveMessage] = useState(null);

    // mutation 
    const [ newClient] = useMutation(NEW_CLIENT);
   
    //routing
    const router = useRouter();

    // validate form
    const formik = useFormik({
        initialValues:{
        full_name:'',
        email:'',
        company:'',
        telephone:''
        },
        validationSchema: Yup.object({
            full_name: Yup.string().required('Full Name required..'),
            email: Yup.string().email('email not valid..').required('Email required..'),
            company: Yup.string().required('Company required..'),
            telephone: Yup.string().required('Company required..')
        }),
        onSubmit: async values => {

            const { full_name, email, company, telephone } = values;
            try {
                const { data } = await newClient({
                    variables:{
                        input:{
                            full_name,
                            email,
                            company,
                            telephone
                        }
                    }
                });

                saveMessage(`Saved client ${data.newClient.full_name}...`);
                setTimeout(() => {
                    saveMessage(null);
                    router.push('/');
                }, 2000);    

            } catch (error) {
                saveMessage(error.message.replace('GraphQL error:', ''));
                setTimeout(() => {
                    saveMessage(null);
                }, 3500);
            }
        }
    });

    const viewMessage = () =>{
        return(
        <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
            <p>{message}</p>
        </div>
        )
    }
    
    return ( 
        <Layout>
            { message && viewMessage()}

            <h1 className="text-2xl text-gray-800 font-light">new client</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form
                     className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                     onSubmit={formik.handleSubmit}
                     >
                        { formik.touched.full_name && formik.errors.full_name ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                            <p className="font-bold">Error</p>
                            <p>{formik.errors.full_name}</p>
                            </div>
                        ) : null }

                        <div className="mt-4">
                            <labe className="block text-gray-700 text-sm font-bold md-2" htmlFor="full_name">
                            Full Name
                            </labe>
                            <input 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="full_name"
                                type="text"
                                placeholder="Full Name Client.."
                                value={formik.values.full_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />                        
                        </div>

                        { formik.touched.email && formik.errors.email ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                            <p className="font-bold">Error</p>
                            <p>{formik.errors.email}</p>
                            </div>
                        ) : null }

                        <div className="mt-4">
                            <labe className="block text-gray-700 text-sm font-bold md-2" htmlFor="email">
                            Email
                            </labe>
                            <input 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                placeholder="Email Client.."
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />                        
                        </div>

                        { formik.touched.company && formik.errors.company ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                            <p className="font-bold">Error</p>
                            <p>{formik.errors.company}</p>
                            </div>
                        ) : null }

                        <div className="mt-4">
                            <labe className="block text-gray-700 text-sm font-bold md-2" htmlFor="company">
                            Company
                            </labe>
                            <input 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="company"
                                type="text"
                                placeholder="Company Client.."
                                value={formik.values.company}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />                        
                        </div>

                        { formik.touched.telephone && formik.errors.telephone ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                            <p className="font-bold">Error</p>
                            <p>{formik.errors.telephone}</p>
                            </div>
                        ) : null }

                        <div className="mt-4">
                            <labe className="block text-gray-700 text-sm font-bold md-2" htmlFor="telephone">
                            Telephone
                            </labe>
                            <input 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="telephone"
                                type="tel"
                                placeholder="Telephone Client.."
                                value={formik.values.telephone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />                        
                        </div>

                        <input 
                            type="submit"
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercas font-bold hover:bg-gray-900"
                            value="Save"
                        />
                </form>    
                </div>
            </div>
        </Layout>
     );
}
 
export default NewClient;