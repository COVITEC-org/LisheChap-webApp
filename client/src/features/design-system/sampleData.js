// DEVELOPMENT-ONLY sample data for the design system reference page.
// Fictional restaurants and dishes used to preview components. This module is
// imported only by the dev-only route and is excluded from production builds.
// Real data comes from the API (seed data arrives with Phase 4).

import { Beef, CupSoda, Drumstick, Fish, IceCreamCone, Pizza, Salad, Sandwich, Soup } from 'lucide-react';

export const SAMPLE_CATEGORIES = [
  { id: 'chips', label: 'Chipsi', icon: Drumstick },
  { id: 'local', label: 'Vyakula vya nyumbani', icon: Soup },
  { id: 'pizza', label: 'Pizza', icon: Pizza },
  { id: 'burgers', label: 'Burger', icon: Sandwich },
  { id: 'fish', label: 'Samaki', icon: Fish },
  { id: 'beef', label: 'Nyama', icon: Beef },
  { id: 'healthy', label: 'Mlo wa afya', icon: Salad },
  { id: 'drinks', label: 'Vinywaji', icon: CupSoda },
  { id: 'desserts', label: 'Vitindamlo', icon: IceCreamCone },
];

export const SAMPLE_RESTAURANTS = [
  {
    id: 'sample-1',
    name: 'Mama Asha Kitchen',
    rating: 4.7,
    reviewCount: 128,
    distanceKm: 0.85,
    locationLabel: 'Sinza Mori, Dar es Salaam',
    prepTimeMinutes: [10, 15],
    isOpen: true,
    isChefActive: true,
    hasDelivery: true,
    food: { name: 'Chipsi Kuku', price: 7000 },
    availabilityStatus: undefined,
  },
  {
    id: 'sample-2',
    name: 'Campus Bites',
    rating: 4.3,
    reviewCount: 56,
    distanceKm: 2.14,
    locationLabel: 'Mlimani City, Dar es Salaam',
    prepTimeMinutes: [15, 25],
    isOpen: true,
    isChefActive: true,
    hasDelivery: false,
    food: { name: 'Chipsi Kuku', price: 6500 },
    availabilityStatus: 'PENDING',
  },
  {
    id: 'sample-3',
    name: 'Spicy Corner',
    rating: 4.5,
    reviewCount: 203,
    distanceKm: 3.4,
    locationLabel: 'Kariakoo, Dar es Salaam',
    prepTimeMinutes: [20, 30],
    isOpen: true,
    isChefActive: true,
    hasDelivery: true,
    food: { name: 'Chipsi Kuku', price: 8000 },
    availabilityStatus: 'KIPO',
  },
  {
    id: 'sample-4',
    name: 'Tasty Meals',
    rating: 0,
    reviewCount: 0,
    distanceKm: 5.9,
    locationLabel: 'Mwenge, Dar es Salaam',
    prepTimeMinutes: [15, 20],
    isOpen: false,
    isChefActive: false,
    hasDelivery: true,
    food: { name: 'Chipsi Kuku', price: 7500 },
    availabilityStatus: undefined,
  },
];

export const SAMPLE_FOODS = [
  {
    id: 'food-1',
    name: 'Chipsi Kuku',
    description: 'Chipsi za viazi mbichi zilizokaangwa pamoja na kuku wa kukaanga na kachumbari.',
    price: 7000,
    restaurantName: 'Mama Asha Kitchen',
    status: 'AVAILABLE',
    isFeatured: true,
  },
  {
    id: 'food-2',
    name: 'Pilau ya Nyama',
    description: 'Pilau yenye viungo vya asili, nyama ya ng’ombe na kachumbari.',
    price: 6000,
    restaurantName: 'Spicy Corner',
    status: 'AVAILABLE',
  },
  {
    id: 'food-3',
    name: 'Biryani ya Kuku',
    description: 'Wali wa biryani wenye harufu nzuri na kuku aliyeiva vizuri.',
    price: 9500,
    restaurantName: 'Foodie Hub',
    status: 'UNAVAILABLE',
  },
  {
    id: 'food-4',
    name: 'Ugali Samaki',
    description: 'Ugali wa sembe na samaki wa kupaka na mboga za majani.',
    price: 8500,
    restaurantName: 'Mama Asha Kitchen',
    status: 'AVAILABLE',
  },
];
