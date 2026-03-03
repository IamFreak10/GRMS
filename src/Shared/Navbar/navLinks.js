import { Home, Bed, CalendarCheck, Info } from 'lucide-react';

export const navLinks = [
  {
    name: 'Home',
    path: '/',
    icon: Home,
  },
  {
    name: 'Rooms',
    path: '/dashboard/book-room', 
    icon: Bed,
  },
  {
    name: 'Booking',
    path: '/dashboard/my-bookings', 
    icon: CalendarCheck,
  },
  {
    name: 'About',
    path: '/about',
    icon: Info,
  },
];
