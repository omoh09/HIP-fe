// 'use client';

// import Link from 'next/link';
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Home, FileText, CreditCard, LogOut } from 'lucide-react';
// import type { User } from '@/lib/types/user';
// import { Button } from '@/components/ui/button';
// import { na}

// export default function UserMenu({ user }: { user: User }) {
//   return (
    

//     <DropdownMenu>
//       <DropdownMenuTrigger>
//         <Avatar className="size-9 cursor-pointer">
//           <AvatarImage alt={user.name || ''} />
//           <AvatarFallback>{user.email?.[0]}</AvatarFallback>
//         </Avatar>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent align="end">
//         <DropdownMenuItem asChild>
//           <Link href="/dashboard">
//             <Home className="mr-2 h-4 w-4" />
//             Dashboard
//           </Link>
//         </DropdownMenuItem>

//         <DropdownMenuItem asChild>
//           <Link href="/invoices">
//             <FileText className="mr-2 h-4 w-4" />
//             Invoices
//           </Link>
//         </DropdownMenuItem>

//         <DropdownMenuItem asChild>
//           <Link href="/billing">
//             <CreditCard className="mr-2 h-4 w-4" />
//             Billing
//           </Link>
//         </DropdownMenuItem>

//         <form action={() => console.log('Sign out clicked')}>
//           <button type="submit" className="w-full">
//             <DropdownMenuItem className="text-red-600">
//               <LogOut className="mr-2 h-4 w-4" />
//               Sign out
//             </DropdownMenuItem>
//           </button>
//         </form>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }




'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, FileText, CreditCard, LogOut } from 'lucide-react';
import type { User } from '@/lib/types/user';

export default function UserMenu({ user }: { user: User }) {
  function handleSignOut() {
    console.log('Sign out clicked');
    // later: clear token + redirect
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-9 cursor-pointer">
          <AvatarImage alt={user?.name || user?.email} />
          <AvatarFallback>
            {user?.email?.charAt(0).toUpperCase() || "Q"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/invoices" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Invoices
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/billing" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Transactions
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
