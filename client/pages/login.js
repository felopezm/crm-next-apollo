import Head from 'next/head'
import Layout from '../components/Layout';

export default function Login() {
  return (
    <Layout>
        <h1 className="text-center text-2xl text-white font-light">Login</h1>

        <div  className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
            <form
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
            >
              <div className="mt-4">
                <labe className="block text-gray-700 text-sm font-bold md-2" htmlFor="name">
                  Email
                </labe>
                <input 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Email User"
                />
              </div>
              <div className="mt-4">
                <labe className="block text-gray-700 text-sm font-bold md-2" htmlFor="password">
                  Password
                </labe>
                <input 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Password User"
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
