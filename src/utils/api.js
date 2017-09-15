const api = "http://localhost:5001"


// Generate a unique token for storing your bookshelf data on the backend server.
let token = localStorage.token
if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

export const getCategories = () =>
  fetch(`${api}/categories`, { headers })
    .then(res => res.json())
    .then(data => data.categories)
    .catch(e => e)

    export const getPosts = (category) => {
      const url = category && category.length? `${api}/${category}/posts`:`${api}/posts`;
      return fetch(url, { headers })
        .then(res => res.json())
        .then(data => data)
        .catch(e => e)
      }

      ///posts/:id/comments
      export const getComments = (postId) => {
        return fetch(`${api}/posts/${postId}/comments`, { headers })
          .then(res => res.json())
          .then(data => data)
          .catch(e => e)
        }

      export const postOrCommentVote = (postOrCommentId, voteDirection,type) =>
        fetch(`${api}/${type}/${postOrCommentId}`, {
          method: 'POST',
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ option:voteDirection })
        }).then(res => res.json())
          .then(data => data)

    export const serverSavePost = (values) =>{
    let url = `${api}/posts`;
    let method="POST";
    if(values.existing_post)
    {
      url+=`/${values.id}`;
      method="PUT";
    }
    if(values.action=="deleteAction")
      method="DELETE";
    return (
    fetch(url, {
      method,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    }).then(res => values.action!="deleteAction"?res.json():{id:values.id})
      .then(data => data))
    }

    export const serverSaveComment = (values) =>{
    let url = `${api}/comments`;
    let method="POST";
    if(values.existing_comment)
    {
      url+=`/${values.id}`;
      method="PUT";
    }
    if(values.action=="deleteAction")
      method="DELETE";
    return (
    fetch(url, {
      method,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    }).then(res => values.action!="deleteAction"?res.json():{id:values.id,parentId:values.parentId})
      .then(data => data))
    }



export const get = (bookId) =>
  fetch(`${api}/books/${bookId}`, { headers })
    .then(res => res.json())
    .then(data => data.book)

export const getAll = () =>
  fetch(`${api}/books`, { headers })
    .then(res => res.json())
    .then(data => data.books)
    .catch(e => e)

export const update = (book, shelf) =>
  fetch(`${api}/books/${book.id}`, {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ shelf })
  }).then(res => res.json())

export const search = (query, maxResults) =>
  fetch(`${api}/search`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, maxResults })
  }).then(res => res.json())
    .then(data => data.books)
