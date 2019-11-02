const cats = [
  { id: 1, name: 'Fluffy' },
  { id: 2, name: 'Maru' },
  { id: 3, name: 'Mira' },
  { id: 4, name: 'Luna' },
  { id: 5, name: 'Miti' },
  { id: 6, name: 'Muffin' },
  { id: 7, name: 'June' }
];

let id = cats.reduce((acc, curr) => (curr.id > acc ? curr.id : acc), 0);

const paginate = (items, { perPage = 30, page } = {}) => {
  return {
    items: items.slice(page * perPage - perPage, page * perPage),
    total: Math.ceil(items.length / perPage),
    page
  };
};

const Cats = {
  findAll({ page = 1 }) {
    const pageIndex = parseInt(page, 10);
    return new Promise(resolve => resolve(paginate(cats, { page: pageIndex })));
  },

  create(data) {
    return new Promise(resolve => {
      const cat = { id: ++id, ...data };
      cats.push(cat);
      resolve(cat);
    });
  },

  find(data) {
    return new Promise(resolve => {
      const index = cats.findIndex(cat => cat.id === data.id);
      const cat = cats[index];
      resolve(cat);
    });
  },

  update(data) {
    return new Promise(resolve => {
      const index = cats.findIndex(cat => cat.id === data.id);
      const cat = { ...cats[index], ...data };
      cats[index] = cat;
      resolve(cat);
    });
  },

  delete(data) {
    return new Promise(resolve => {
      const index = cats.findIndex(cat => cat.id === data.id);
      const cat = cats[index];
      cats.splice(index, 1);
      resolve(cat);
    });
  }
};

module.exports = Cats;
