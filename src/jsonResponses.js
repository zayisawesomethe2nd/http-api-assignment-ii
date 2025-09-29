// Holds all of our users
const users = {};

// Takes request, response, status code, and object to send 
// returns with a JSON object. 
const respondJSON = (request, response, status, object) => {
    const content = JSON.stringify(object);
    const headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    };

    response.writeHead(status, headers);

    if(request.method !== 'HEAD') {
        response.write(content);
    }

    response.end();
};

// get the user object, and returns a 200 status code
const getUsers = (request, response) => {
    return respondJSON(request, response, 200, users);
};

// a function for adding a new user to the user object.
const addUser = (request, response) => {
    const responseJSON = {
        message: 'Name and age are both required.',
    };

    const { name, age } = request.body;

    // if the name or age is missing, give an error id and return the respondJSON
    if (!name || !age) {
        responseJSON.id = 'addUserMissingParams';
        return respondJSON(request, response, 400, responseJSON);
    }
    
    // No changes are confirmed yet, but we can set the status code to 204 for now
    let responseCode = 204;

    // If the name given does not already exist, set code to 201 and create the user.
    if (!users[name]) {
        responseCode = 201;
        users[name] = {
            name: name,
        };
    }

    // If the user already existed, replace their age. Otherwise, adds the age to the new user.
    users[name].age = age;

    // If we just created a new user, say we created it and return the respondJSON.
    if (responseCode === 201) {
        responseJSON.message = 'Created Successfully';
        return respondJSON(request, response, responseCode, responseJSON);
    }
    // Otherwise, return respondJSON.
    return respondJSON(request, response, responseCode, {});
};

// For a 404 Page Not Found.
const notFound = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };

    respondJSON(request, response, 404, responseJSON);
};

// all modules being exported...
module.exports = {
    notFound,
    getUsers,
    addUser,
};
