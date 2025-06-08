'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const LoginPage = () => {

  const { isSignedIn, user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    const role = user?.publicMetadata.role;

    if (role) {
      router.push(`/${role}`)
    }
  },[user, router]);

  return (
    <div className='h-screen flex items-center justify-center bg-blueSkyLight'>
      <SignIn.Root>
        <SignIn.Step name='start' className='bg-blueLight p-12 rounded-md shadow-2xl flex flex-col gap-2 items-center'>
          <Image src="/logoclinic.png" alt='' width={80} height={80} className="mb-2"/>
          <h1 className='text-xl font-bold flex items-center gap-2'>
            Centro de Tratamento de Sacavem
          </h1>
          <h2 className="text-neutral  text-center mb-2">Entrar na aplicação</h2>

          <Clerk.GlobalError className='text-sm text-red-400'/>  
          <Clerk.Field name="identifier" className='flex flex-col gap-2'>
            <Clerk.Label className='text-sm text-gray500'>Utilizador</Clerk.Label>
            <Clerk.Input type='text' required className='p-2 rounded-md ring-1 ring-gray-300'/>
            <Clerk.FieldError className='text-xs text-red-400'/>
          </Clerk.Field>
          <Clerk.Field name="password" className='flex flex-col gap-2'>
            <Clerk.Label className='text-sm text-gray500'>Senha</Clerk.Label>
            <Clerk.Input type='password' required className='p-2 rounded-md ring-1 ring-gray-300'/>
            <Clerk.FieldError className='text-xs text-red-400'/>
          </Clerk.Field>
          <SignIn.Action submit className='bg-darkblue text-white my-1 rounded-md text-sm p-[10px]'>Entrar</SignIn.Action>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  )
}

export default LoginPage 

