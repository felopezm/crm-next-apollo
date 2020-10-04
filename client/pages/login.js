import { useState } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

import Layout from '../components/Layout';


const AUTH_USER = gql`
  mutation authUser($input: AuthInput){
    authUser(input:$input){
      token
    }
  }
`;

export default function Login() {
   // state message
   const [message, saveMessage] = useState(null);

   // mutation 
   const [authUser] = useMutation(AUTH_USER);
   
   //routing
   const router = useRouter();

   // validate form
   const formik = useFormik({
    initialValues:{
      email:'',
      password:''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('email not valid..').required('Email required..'),
      password: Yup.string().required('Password required..')
    }),
    onSubmit: async values => {

      const { email, password } = values;
      try {
       const { data } = await authUser({
          variables:{
            input:{
             email, password
            }
          }
        });
        const {token} = data.authUser;
        localStorage.setItem('token', token);

        saveMessage(`Auth User...`);
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

        <h1 className="text-center text-2xl text-white font-light">Login</h1>

        <div  className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
            <form
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}
            >

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
                  placeholder="Email User"
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
                  placeholder="Password User"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <input 
                type="submit"
                className="bg-gray-800 w-full mt-5 p-2 text-white uppercas hover:bg-gray-900"
                value="Login"
              />
            </form>
          </div>
        </div>
    </Layout>
  )
}
