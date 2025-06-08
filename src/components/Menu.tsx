import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from "next/link";
import LogoutButton from './LogoutButton';

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Página Inicial",
        href: "/admin",
        visible: ["admin"],
      },
      {
        icon: "/patient.png",
        label: "Pacientes",
        href: "/list/patients",
        visible: ["admin"],
      },
      {
        icon: "/subject.png",
        label: "Produtos",
        href: "/list/medication",
        visible: ["admin"],
      },
      {
        icon: "/calendar.png",
        label: "Calendário",
        href: "/calendar",
        visible: ["admin"],
      },
    ],
  },
  {
    title: "OUTROS",
    items: [
      {
        icon: "/logout.png",
        label: "Sair",
        href: "#",
        visible: ["admin"],
      },
    ]
  },
];

const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className='hidden lg:block text-gray-400 font-light my-4'>{i.title}</span>
          {i.items.map((item) => {
              if (item.label === "Sair") {
                return (
                  <div key={item.label}>
                    <LogoutButton />
                  </div>
                )
              }
              return (
                <Link href={item.href} key={item.label} className='flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-blueSky'>
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className='hidden lg:block'>{item.label}</span>
                </Link>
              )
          })}
          {/* Add UserButton below the "Sair" menu item */}
          {i.title === "OUTROS" && (
            <div className='flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-blueSky'>
              <UserButton/> 
              <span className='hidden lg:block'>Administrador</span>

            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Menu;