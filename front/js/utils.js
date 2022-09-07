export const url = 'http://localhost:3000/api/products/';

const params = new URLSearchParams(window.location.search);
export const id = params.get('id');
