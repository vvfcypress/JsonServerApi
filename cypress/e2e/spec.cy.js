///<reference types="cypress"/>

import { faker } from '@faker-js/faker';
import post from '../fixtures/post.json';
import user from '../fixtures/user.json';

user.email = faker.internet.email({ provider: 'ukr.com' });
post.id = faker.number.int({ min: 120, max: 500 });

let token;
let postId;
let idArr;

describe('API tests', () => {

  it('Register user', () => {
    cy.request({
      method: 'POST',
      url: `/register`,
      body: user

    }).then(response => {
      expect(response.status).to.eq(201);

    })
  })

  it('Login user', () => {
    cy.request({
      method: 'POST',
      url: `/login`,
      body: user

    }).then(response => {
      expect(response.status).to.eq(200);

      token = response.body.accessToken;

    })
  })

  it('1. Find all posts', () => {
    cy.request({
      method: 'GET',
      url: `/posts`,

    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.headers['content-type']).to.include('application/json');

    })
  })

  it('2.Find first 10 posts', () => {
    cy.request({
      method: 'GET',
      url: `posts?_limit=10`,

    }).then(response => {
      expect(response.status).to.eq(200);
      
      idArr = [response.body];      

      for (let i = 0; i < idArr.length; i++) {        
          console.log(idArr[i]);      
      } 

    })
  })

  it('3.Find ids from 55 to 60 posts', () => { 

    cy.request({
      method: 'GET',
      url: `/posts?_start=54&_end=60`
    }).then(response => {
      expect(response.status).to.eq(200);

      idArr = [response.body];      

      for (let i = 0; i < idArr.length; i++) {        
          console.log(idArr[i]);      
      } 
         
    })
  })

  it('4.Create post with not authorized user', () => {

    cy.request({
      method: 'POST',
      url: `/664/posts`,
      body: post,
      failOnStatusCode: false,

    }).then(response => {
      expect(response.status).to.eq(401);

    })
  })

  it('5.Create post with authorized user', () => {
    cy.request({
      method: 'POST',
      url: '/664/posts',
      body: post,
      headers: {
        'Authorization': `Bearer ${token}`
      }

    }).then(response => {
      expect(response.status).to.eq(201);

      postId = response.body.id;

    }).then(() => {
      cy.request({
        method: 'GET',
        url: `/posts/${postId}`

      }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.eq(post.id);

      })
    })
  })

  it('6.Create post entity', () => {
    post.id = faker.number.int({ min: 120, max: 500 });
    post.body = faker.lorem.text();

    cy.request({
      method: 'POST',
      url: '/664/posts',
      body: post,
      headers: {
        'Authorization': `Bearer ${token}`
      }

    }).then(response => {
      expect(response.status).to.eq(201);

      postId = response.body.id;

    }).then(() => {
      cy.request({
        method: 'GET',
        url: `/posts/${postId}`

      }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.body).to.eq(post.body);

      })
    })
  })

  it('7.Update not existing entity', () => {
    post.body = faker.lorem.text();

    cy.request({
      method: 'PUT',
      url: `/posts`,
      body: post,
      failOnStatusCode: false

    }).then(response => {
      expect(response.status).to.eq(404);


    })
  })

  it('8.Create post entity', () => {
    post.id = faker.number.int({ min: 120, max: 500 });
    post.body = faker.lorem.text();

    cy.request({
      method: 'POST',
      url: '/664/posts',
      body: post,
      headers: {
        'Authorization': `Bearer ${token}`
      }

    }).then(response => {
      expect(response.status).to.eq(201);

      postId = response.body.id;

    }).then(() => {
      cy.request({
        method: 'PUT',
        url: `/posts/${postId}`,
        body: post

      }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.body).to.eq(post.body);

      })
    })
  })

  it('9. Delete not existing entity', () => {
    cy.request({
      method: 'DELETE',
      url: `/posts`,
      failOnStatusCode: false

    }).then(response => {
      expect(response.status).to.eq(404);


    })
  })


  it('10.Create, update, delete entity', () => {
    post.id = faker.number.int({ min: 120, max: 500 });
    post.body = faker.lorem.text();

    cy.request({
      method: 'POST',
      url: '/664/posts',
      body: post,
      headers: {
        'Authorization': `Bearer ${token}`
      }

    }).then(response => {
      expect(response.status).to.eq(201);

      postId = response.body.id;

    }).then(() => {
      cy.request({
        method: 'PUT',
        url: `/posts/${postId}`,
        body: post

      }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.body).to.eq(post.body);

      }).then(() => {
        cy.request({
          method: 'DELETE',
          url: `/posts/${postId}`

        }).then(response => {
          expect(response.status).to.eq(200);

        })
      })
    })
  })


})