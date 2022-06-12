import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Bryan',
      email: 'test@tester.com',
      password: bcrypt.hashSync('135246'),
      isAdmin: true,
    },

    {
      name: 'Leroy',
      email: 'test6@tester.com',
      password: bcrypt.hashSync('135246'),
      isAdmin: false,
    },
  ],
  //product creation
  merchs: [
    {
      _id: '1',
      name: 'OnePiece Hoodie',
      slug: 'onepiece-hoodie',
      category: 'Hoodie',
      image: '/images/op1.jpg',
      price: 60,
      stockCount: 20,
      brand: 'Anime',
      srating: 5.0,
      reviews: 20,
      description: 'Top Tier Item',
    },

    {
      _id: '2',
      name: 'OnePiece Sweatpants',
      slug: 'onepiece-sweatpants',
      category: 'Sweatpants',
      image: '/images/op2.jpg',
      price: 55,
      stockCount: 20,
      brand: 'Anime',
      srating: 5.0,
      reviews: 19,
      description: 'Top Tier Item',
    },

    {
      _id: '3',
      name: 'DragonBall Hoodie',
      slug: 'dragonball-hoodie',
      category: 'Hoodie',
      image: '/images/dbz2.jpg',
      price: 70,
      stockCount: 20,
      brand: 'Anime',
      srating: 4.5,
      reviews: 14,
      description: 'Top Tier Item',
    },

    {
      _id: '4',
      name: 'DragonBall Sweatpants',
      slug: 'dragonball-sweatpants',
      category: 'Sweatpants',
      image: '/images/dbz1.jpg',
      price: 55,
      stockCount: 20,
      brand: 'Anime',
      srating: 4.0,
      reviews: 15,
      description: 'Top Tier Item',
    },

    {
      _id: '5',
      name: 'DemonSlayer Hoodie',
      slug: 'demonslayer-hoodie',
      category: 'Hoodie',
      image: '/images/ds1_.jpg',
      price: 60,
      stockCount: 20,
      brand: 'Anime',
      srating: 5.0,
      reviews: 18,
      description: 'Top Tier Item',
    },

    {
      _id: '6',
      name: 'DemonSlayer Sweatpants',
      slug: 'demonslayer-sweatpants',
      category: 'Sweatpants',
      image: '/images/ds2_.jpg',
      price: 30,
      stockCount: 20,
      brand: 'Anime',
      srating: 5.0,
      reviews: 17,
      description: 'Top Tier Item',
    },
  ],
};
export default data;
