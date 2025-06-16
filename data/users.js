export let users = [
    {
        id: '1',
        username: 'admin',
        age: 30
    }
];

export const setUsers = (newUsers) => {
    users = newUsers;
};