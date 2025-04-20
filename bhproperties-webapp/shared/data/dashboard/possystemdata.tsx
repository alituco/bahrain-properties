interface Product {
    id: number;
    imgSrc: string;
    title: string;
    category: string;
    description: string;
    price: string;
    inStock: string;
}

export const PosrSystemdata: Product[] = [
    {
        id: 1,
        imgSrc: '../../../assets/images/pos-system/9.jpg',
        title: 'Classic Cheeseburger',
        category: 'burger',
        description: 'Classic Burgers',
        price: '$78.99',
        inStock: '',
    },
    {
        id: 2,
        imgSrc: '../../../assets/images/pos-system/18.jpg',
        title: 'Coconut Almond Fudge',
        category: 'icecream',
        description: 'Specialty Flavors',
        price: '$29.99',
        inStock: 'out-of-stock',
    },
    {
        id: 3,
        imgSrc: '../../../assets/images/pos-system/17.jpg',
        title: 'Cappuccino',
        category: 'coffee',
        description: 'Espresso Beverages',
        price: '$7.99',
        inStock: '',
    },
    {
        id: 4,
        imgSrc: '../../../assets/images/pos-system/11.jpg',
        title: 'Frosting Choices',
        category: 'cupcakes',
        description: 'Cupcake Creations',
        price: '$19.99',
        inStock: '',
    },
    {
        id: 5,
        imgSrc: '../../../assets/images/pos-system/12.jpg',
        title: 'Nutella Cupcake',
        category: 'cupcakes',
        description: 'Specialty Cupcakes',
        price: '$123.99',
        inStock: '',
    },
    {
        id: 6,
        imgSrc: '../../../assets/images/pos-system/16.jpg',
        title: 'Mediterranean',
        category: 'pizza',
        description: 'Specialty Pizzas',
        price: '$2.79',
        inStock: '',
    },
    {
        id: 7,
        imgSrc: '../../../assets/images/pos-system/14.jpg',
        title: 'Cold Brew Concentrate',
        category: 'coffee',
        description: 'Cold Brews',
        price: '$1.29',
        inStock: '',
    },
    {
        id: 8,
        imgSrc: '../../../assets/images/pos-system/15.jpg',
        title: 'Blue Cheese Burger',
        category: 'burger',
        description: 'Gourmet Burgers',
        price: '$24.99',
        inStock: '',
    },
    {
        id: 9,
        imgSrc: '../../../assets/images/pos-system/19.jpg',
        title: 'Apple Cinnamon Waffle',
        category: 'waffle',
        description: 'Specialty Waffles',
        price: '$24.99',
        inStock: '',
    },
    {
        id: 10,
        imgSrc: '../../../assets/images/pos-system/10.jpg',
        title: 'Pesto Delight',
        category: 'pizza',
        description: 'Specialty Pizzas',
        price: '$24.99',
        inStock: '',
    },
    {
        id: 11,
        imgSrc: '../../../assets/images/pos-system/8.jpg',
        title: 'Cookie Dough Sundae',
        category: 'icecream',
        description: 'Sundae Creations',
        price: '$24.99',
        inStock: '',
    },
    {
        id: 12,
        imgSrc: '../../../assets/images/pos-system/13.jpg',
        title: 'Americano',
        category: 'coffee',
        description: 'Espresso Beverages',
        price: '$24.99',
        inStock: '',
    },
];

export const Orderlist = [
    {
        id: 1,
        imgSrc: '../../../assets/images/pos-system/17.jpg',
        title: 'Cappuccino',
        quantity: 1,
        price: '$3.99',
        discount: '30% Off',
    },
    {
        id: 2,
        imgSrc: '../../../assets/images/pos-system/19.jpg',
        title: 'Apple Cinnamon Waffle',
        quantity: 1,
        price: '$1.99',
        discount: '30% Off',
    },
    {
        id: 3,
        imgSrc: '../../../assets/images/pos-system/15.jpg',
        title: 'Classic Cheeseburger',
        quantity: 2,
        price: '$2.79',
        discount: '10% Off',
    },
    {
        id: 4,
        imgSrc: '../../../assets/images/pos-system/12.jpg',
        title: 'Nutella Cupcakes',
        quantity: 1,
        price: '$123.99',
        discount: '10% Off',
    },
    {
        id: 5,
        imgSrc: '../../../assets/images/pos-system/11.jpg',
        title: 'Strawberry Cupcakes',
        quantity: 1,
        price: '$123.99',
        discount: '10% Off',
    },
    {
        id: 6,
        imgSrc: '../../../assets/images/pos-system/14.jpg',
        title: 'Cold Coffee',
        quantity: 1,
        price: '$546.99',
        discount: '10% Off',
    },
    {
        id: 7,
        imgSrc: '../../../assets/images/pos-system/16.jpg',
        title: 'Cheese Burst Pizza',
        quantity: 2,
        price: '$4.99',
        discount: '10% Off',
    },
    {
        id: 8,
        imgSrc: '../../../assets/images/pos-system/13.jpg',
        title: 'Americano',
        quantity: 1,
        price: '$1.29',
        discount: '10% Off',
    },
];


interface FoodItem {
    id: number;
    name: string;
    category: string;
    price: string;
    orders: string;
    image: string;
    discount?: string; 
    color?: string;
}

export const TopSellingItems: FoodItem[] = [
    {
        id: 1,
        name: "Cappuccino",
        category: "Espresso Beverages",
        price: "$517",
        orders: "2.7K Orders",
        image: "../../../assets/images/pos-system/17.jpg"
    },
    {
        id: 2,
        name: "Cheese Burger",
        category: "Gourmet Burgers",
        price: "$564",
        orders: "1,758 Orders",
        image: "../../../assets/images/pos-system/15.jpg",
        discount: "15% Off",
        color: 'info'
    },
    {
        id: 3,
        name: "Cinnamon Waffle",
        category: "Specialty Waffles",
        price: "$24.89",
        orders: "894 Orders",
        image: "../../../assets/images/pos-system/19.jpg"
    },
    {
        id: 4,
        name: "Mediterranean",
        category: "Special Pizza",
        price: "$2.7",
        orders: "865 Orders",
        image: "../../../assets/images/pos-system/16.jpg",
        discount: "10% Off",
        color: 'primary1'
    },
    {
        id: 5,
        name: "Classic Burger",
        category: "Gourmet Burgers",
        price: "$564",
        orders: "1,758 Orders",
        image: "../../../assets/images/pos-system/9.jpg",
        discount: "10% Off",
        color: 'primary3'
    },
    {
        id: 6,
        name: "Almond Fudge",
        category: "Icecream",
        price: "$89",
        orders: "789 Orders",
        image: "../../../assets/images/pos-system/18.jpg",
        discount: "30% Off",
        color: 'success'
    }
];