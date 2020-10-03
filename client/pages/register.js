import React, { useState } from 'react'
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const NEW_USER = gql`
  mutation newUser($input: UserInput){
    newUser(input: $input){
      id
      full_name
      email
    }
  }
`;

export default function Register() {
  // state message
  const [message, saveMessage] = useState(null);

  // mutation 
  const [ newUser] = useMutation(NEW_USER);

  //routing
  const router = useRouter();

  // validate form
  const formik = useFormik({
    initialValues:{
      full_name:'',
      email:'',
      password:''
    },
    validationSchema: Yup.object({
      full_name: Yup.string().required('Full Name required..'),
      email: Yup.string().email('email not valid..').required('Email required..'),
      password: Yup.string().required('Password required..').min(6,'Password min 6 characters..')
    }),
    onSubmit: async values => {

      const { full_name, email, password } = values;
      try {
       const { data } = await newUser({
          variables:{
            input:{
              full_name, email, password
            }
          }
        });
        saveMessage(`Success, User ${data.newUser.full_name} Created `);
        setTimeout(() => {
          saveMessage(null);
          router.push('/login');
        }, 3000);

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

        <h1 className="text-center text-2xl text-white font-light">Register</h1>

        <div  className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
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
                  placeholder="Full Name..."
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
                <labe className="block text-gray-700 text-sm font-bold md-2" htmlFor="name">
                  Email
                </labe>
                <input 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Email.."
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              { formik.touched.password && formik.errors.password ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.password}</p>
                </div>
              ) : null }

              <div className="mt-4">
                <labe className="block text-gray-700 text-sm font-bold md-2" htmlFor="password">
                  Password
                </labe>
                <input 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Password.."
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <input 
                type="submit"
                className="bg-gray-800 w-full mt-5 p-2 text-white uppercas hover:bg-gray-900"
                value="Send"
              />
            </form>
          </div>
        </div>
    </Layout>
  )
}
