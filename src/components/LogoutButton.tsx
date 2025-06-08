'use client'

import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

const LogoutButton = () => {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/') // Redirect to sign-in page
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-blueSky w-full"
    >
      <i className="bi bi-box-arrow-right text-lg"></i>
      <span className="hidden lg:block">Sair</span>
    </button>
  )
}

export default LogoutButton
