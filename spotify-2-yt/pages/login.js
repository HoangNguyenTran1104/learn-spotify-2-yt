import {getProviders, signIn} from 'next-auth/react'

function Login(providers) {
  return (
    <div>
       <img className="w-52 mb-5" src="/spotify-logo.png" alt="" />
    </div>
  )
}

export default Login;

export async function getServerSideProps() {
  const providers = await getProviders();
  return{
    props:{
      providers
    }
  }
}

