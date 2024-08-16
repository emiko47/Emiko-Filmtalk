import { register } from './services/register.js';
import { login } from './services/login.js';
import { verify } from './services/verify.js';
import { addtowatchlist } from './services/addtowatchlist.js';
import { removefromwatchlist } from './services/removefromwatchlist.js';
import { getAllCards } from './services/getAllCards.js';
import { retrieveComments } from './services/retrieveComments.js';
import { saveComment } from './services/saveComment.js';
import { addNewCard } from './services/addNewCard.js';
import { buildResponse } from './utils/util.js';



const healthPath='/health';
const registerPath='/register';
const loginPath='/login';
const verifyPath='/verify';
const addtowatchlistPath='/addtowatchlist';
const removefromwatchlistPath='/removefromwatchlist';
const getAllCardsPath='/getAllCards';
const retrieveCommentsPath='/retrieveComments';
const saveCommentPath='/saveComment';
const addNewCardPath='/addNewCard';



//Remember this is the root lambda function that is triggered by the API we created.
//The API itself is just made up of 'resources' (a set of URLs, generated by a file structure we created)
//Depending on what URL is used when the API is called, /health, /register, e.t.c, the purpose of this lambda function is to 'do something' for each of these URLs
//In order to 'do something' we implemented each function we need to carry out in the lambda function as separate 'services' which can be called in this lambda function
export const handler = async (event) => {
  console.log('Request event: ', event);
  let response;
  switch(true){
    case event.httpMethod === 'GET' && event.path === healthPath:
      response = buildResponse(200);
      break;
    case event.httpMethod === 'POST' && event.path === addtowatchlistPath:
      const addtowatchlistBody = JSON.parse(event.body);//we will receive a body from the frontend containing the addtowatchlist details
      response = await addtowatchlist(addtowatchlistBody);
      break;
    case event.httpMethod === 'POST' && event.path === addNewCardPath:
      const addNewCardBody = JSON.parse(event.body);//we will receive a body from the frontend containing the addtowatchlist details
      response = await addNewCard(addNewCardBody);
      break;
    case event.httpMethod === 'POST' && event.path === removefromwatchlistPath:
      const removefromwatchlistBody = JSON.parse(event.body);//we will receive a body from the frontend containing the addtowatchlist details
      response = await removefromwatchlist(removefromwatchlistBody);
      break;
    case event.httpMethod === 'POST' && event.path === getAllCardsPath:
      const getAllCardsBody = JSON.parse(event.body);//we will receive a body from the frontend containing the addtowatchlist details
      response = await getAllCards(getAllCardsBody);
      break;
    case event.httpMethod === 'POST' && event.path === retrieveCommentsPath:
      const retrieveCommentsBody = JSON.parse(event.body);//we will receive a body from the frontend containing the addtowatchlist details
      response = await retrieveComments(retrieveCommentsBody);
      break;
    case event.httpMethod === 'POST' && event.path === saveCommentPath:
        const saveCommentBody = JSON.parse(event.body);//we will receive a body from the frontend containing the addtowatchlist details
        response = await saveComment(saveCommentBody);
        break;
    case event.httpMethod === 'POST' && event.path === registerPath:
        const registerBody = JSON.parse(event.body);//we will receive a body from the frontend containing the registration details
      response = await register(registerBody);//use await to make it an asynchronous function since DynamoDB will be handling the actual registration.
      break;
    case event.httpMethod === 'POST' && event.path === loginPath:
        const loginBody = JSON.parse(event.body);//we will receive a body from the frontend containing the login details
        response = await login(loginBody);//use await to make it an asynchronous function since DynamoDB will be handling the actual registration.
        break;
    case event.httpMethod === 'POST' && event.path === verifyPath:
        const verifyBody = JSON.parse(event.body);
        response = verify(verifyBody);//use this to verify the token to see if it is expired or valid
        break;
    default:
     response = buildResponse(404, '404 Not Found')
     
     
  }
  return response;
};

