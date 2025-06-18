import fs from 'fs';

const cleanDb = () => {
  const cleanData = {
    users: [
      {
        id: '1',
        username: 'admin',
        age: 30
      }
    ],
    tasks: [],
    blacklistedTokens: []
  };
  fs.writeFileSync('db.json', JSON.stringify(cleanData, null, 2));
  console.log('db.json limpo com sucesso!');
};

cleanDb(); 