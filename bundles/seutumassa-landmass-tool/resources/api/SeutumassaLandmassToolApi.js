
const login = "testuser";
const password = "password";
const authString = `${login}:${password}`;



export function getSeutumassaToolFields(url) {
  return fetch(Oskari.urls.getRoute('GetSeutumassaToolFields'), {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => {
      return data;
    }) 
    .catch(err => {
      return err;
  });
 }

export function getLandmassAreaByCoordinates(body) {
  return fetch('http://localhost:8090/api/v1/landmassareabycoordinates', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(authString)
    }
  })
    .then(response => response.json())
    .then(data => {
      return data;
    }) 
    .catch(err => {
        return err;
    });
};

export function getLandmassDataByLandmassAreaId(id) {
  return fetch('http://localhost:8090/api/v1/landmassdatabyareaid/'+id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(authString)
    }
  })
    .then(response => response.json())
    .then(data => {
      return data;
    }) 
    .catch(err => {
      return err;
  });
};

export function getPersonById(id){
  return fetch('http://localhost:8090/api/v1/person/'+id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(authString)
    }
  })
    .then(response => response.json())
    .then(data => {
      return data;
    }) 
    .catch(err => {
      return err;
  });
}


