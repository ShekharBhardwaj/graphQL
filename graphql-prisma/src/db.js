//Demo user data
const users = [
    {
        id:'1',
        name: 'Shekhar',
        email: 'shekhar@example.com',
        age: 28
    },
    {
        id:'2',
        name: 'Sarah',
        email: 'shekSarahhar@example.com'
    },
    {
        id:'3',
        name: 'Ruth',
        email: 'Ruth@example.com',
        age: 30
    }
];

const posts = [
    {
        id: 'abc01',
        title: 'How to train your dragon..',
        body: 'Dragon are not real, so to begin with you have to invent one for your sake.',
        published: true,
        author:'1'
    },
    {
        id: 'abc02',
        title: 'How to feed a monkey',
        body: 'Take your pizza and eat along the wall, where monkey\' are sitting, they will help themselves. ',
        published: true,
        author:'2'
    },
    {
        id: 'abc03',
        title: 'How to walk 500 miles in one day',
        body: 'Take a map and print it and tip toe over it',
        published: false,
        author:'3'
    },
    {
        id: 'abc04',
        title: 'How to win a game',
        body: 'play with all the losers',
        published: true,
        author:'1'
    }

];

const comments = [
    {
        id: 'xyz1',
        text: 'I have invented a dragon, waste of time I say',
        author:'1',
        postId:'abc01'
    },
    {
        id: 'xyz2',
        text: 'I can play with you I wanna winnnn',
        author:'2',
        postId:'abc04'
    },
    {
        id: 'xyz3',
        text: 'Monkeys are social human beings',
        author:'3',
        postId:'abc02'
    },
    {
        id: 'xyz4',
        text: 'do not have printer can I draw',
        author:'1',
        postId:'abc03'
    },
];
const db = {
    users,
    posts,
    comments
}

export {
   db as default
}