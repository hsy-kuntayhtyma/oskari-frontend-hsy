const login = "testuser";
const password = "password";
const authString = `${login}:${password}`;

const url = 'http://10.21.0.27:9902/landmass_api/api/v1/';
//const url = 'http://localhost:9902/landmass_api/api/v1/';
//const url = 'http://localhost:8090/api/v1/';

// export function getSeutumassaToolFields(url) {
//   return fetch(Oskari.urls.getRoute('GetSeutumassaToolFields'), {
//     method: 'GET',
//   })
//     .then(response => response.json())
//     .then(data => {
//       return data;
//     })
//     .catch(err => {
//       return err;
//   });
//  }

export function getLandmassAreaByCoordinates(body) {
  return fetch(url+'landmassareabycoordinates', {
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

export function addLandmassArea(body){
  return fetch(url+'landmassarea', {
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

export function updateLandmassArea(body){
  return fetch(url+'landmassarea/'+body.id, {
    method: 'PUT',
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

export function deleteLandmassAreaById(id){
  return fetch(url+'landmassarea/'+id, {
    method: 'DELETE',
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

export function getLandmassDataByLandmassAreaId(id) {
  return fetch(url+'landmassdatabyareaid/'+id, {
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

export function addLandmassData(body){
  return fetch(url+'landmassdata/', {
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

export function updateLandmassData(body){
  return fetch(url+'landmassdata/'+body.id, {
    method: 'PUT',
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

export function deleteLandmassDataById(id){
  return fetch(url+'landmassdata/'+id, {
    method: 'DELETE',
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

export function getPersonById(id){
  return fetch(url+'person/'+id, {
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

export function addPerson(body){
  return fetch(url+'person/', {
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

export function updatePerson(body){
  return fetch(url+'person/'+body.id, {
    method: 'PUT',
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


